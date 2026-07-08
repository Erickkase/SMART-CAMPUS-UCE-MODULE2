import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ScholarshipOutboxEvent } from '../../domain/entities/scholarship-outbox-event.entity';
import { ScholarshipOutboxStatus } from '../../domain/enums/scholarship-outbox-status.enum';
import {
  SCHOLARSHIP_OUTBOX_REPOSITORY,
  ScholarshipOutboxRepository,
} from '../../domain/repositories/scholarship-outbox.repository';
import { ScholarshipKafkaProducerService } from '../messaging/scholarship-kafka-producer.service';
import { ScholarshipMqttPublisherService } from '../messaging/scholarship-mqtt-publisher.service';
import { ScholarshipRabbitMqPublisherService } from '../messaging/scholarship-rabbitmq-publisher.service';

type ScholarshipEventPayload = {
  event: string;
  scholarshipId: string;
  studentId: string;
  scholarshipType: string;
  status: string;
  occurredAt: string;
};

@Injectable()
export class ScholarshipOutboxDispatcherService
  implements OnModuleInit, OnModuleDestroy
{
  private flushInterval: NodeJS.Timeout | null = null;

  constructor(
    @Inject(SCHOLARSHIP_OUTBOX_REPOSITORY)
    private readonly outboxRepository: ScholarshipOutboxRepository,
    private readonly scholarshipMqttPublisher: ScholarshipMqttPublisherService,
    private readonly scholarshipKafkaProducer: ScholarshipKafkaProducerService,
    private readonly scholarshipRabbitMqPublisher: ScholarshipRabbitMqPublisherService,
  ) {}

  onModuleInit(): void {
    this.flushInterval = setInterval(() => {
      void this.flushPendingEvents();
    }, 15000);
  }

  onModuleDestroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
  }

  async enqueueEvent(payload: ScholarshipEventPayload): Promise<void> {
    await this.outboxRepository.create(
      new ScholarshipOutboxEvent(
        randomUUID(),
        payload.scholarshipId,
        payload.event,
        JSON.stringify(payload),
        ScholarshipOutboxStatus.PENDING,
        new Date(),
        null,
      ),
    );
  }

  async flushPendingEvents(): Promise<void> {
    const events = await this.outboxRepository.findPending();

    for (const event of events) {
      const payload = JSON.parse(event.payload) as ScholarshipEventPayload;

      if (payload.event === 'scholarship.created') {
        await this.scholarshipMqttPublisher.publishScholarshipCreated(payload as never);
        await this.scholarshipKafkaProducer.publishScholarshipCreated(payload as never);
        await this.scholarshipRabbitMqPublisher.publishScholarshipCreated(payload as never);
      }

      if (payload.event === 'scholarship.status.updated') {
        await this.scholarshipMqttPublisher.publishScholarshipStatusUpdated(payload as never);
        await this.scholarshipKafkaProducer.publishScholarshipStatusUpdated(payload as never);
        await this.scholarshipRabbitMqPublisher.publishScholarshipStatusUpdated(payload as never);
      }

      await this.outboxRepository.markPublished(event.id, new Date());
    }
  }
}
