import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';
import {
  SCHOLARSHIP_CREATED_TOPIC,
  SCHOLARSHIP_STATUS_UPDATED_TOPIC,
} from './scholarship-mqtt-topics';

type ScholarshipEventPayload = {
  event: string;
  scholarshipId: string;
  studentId: string;
  scholarshipType: string;
  status: string;
  occurredAt: string;
};

@Injectable()
export class ScholarshipKafkaProducerService implements OnModuleDestroy {
  private readonly logger = new Logger(ScholarshipKafkaProducerService.name);
  private readonly enabled: boolean;
  private readonly topic: string;
  private producer: Producer | null = null;
  private setupPromise: Promise<void> | null = null;

  constructor(private readonly configService: ConfigService) {
    this.enabled = this.configService.get<boolean>('kafka.enabled') ?? false;
    this.topic =
      this.configService.get<string>('kafka.topics.scholarshipEvents') ??
      'scholarship.events';
  }

  async publishScholarshipCreated(payload: ScholarshipEventPayload): Promise<void> {
    await this.publish({
      key: payload.scholarshipId,
      event: payload.event,
      scholarshipId: payload.scholarshipId,
      studentId: payload.studentId,
      scholarshipType: payload.scholarshipType,
      status: payload.status,
      occurredAt: payload.occurredAt,
    });
  }

  async publishScholarshipStatusUpdated(
    payload: ScholarshipEventPayload,
  ): Promise<void> {
    await this.publish({
      key: payload.scholarshipId,
      event: payload.event,
      scholarshipId: payload.scholarshipId,
      studentId: payload.studentId,
      scholarshipType: payload.scholarshipType,
      status: payload.status,
      occurredAt: payload.occurredAt,
    });
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.producer) {
      return;
    }

    await this.producer.disconnect().catch(() => undefined);
  }

  private async publish(payload: Record<string, string>): Promise<void> {
    if (!this.enabled) {
      return;
    }

    await this.ensureSetup();

    if (!this.producer) {
      return;
    }

    await this.producer.send({
      topic: this.topic,
      messages: [
        {
          key: payload.key,
          value: JSON.stringify(payload),
        },
      ],
    });
  }

  private async ensureSetup(): Promise<void> {
    if (this.producer) {
      return;
    }

    this.setupPromise ??= this.setup();
    await this.setupPromise;
  }

  private async setup(): Promise<void> {
    try {
      const kafka = new Kafka({
        clientId:
          this.configService.get<string>('kafka.clientId') ?? 'scholarship-service',
        brokers: this.configService.get<string[]>('kafka.brokers') ?? ['localhost:9094'],
      });

      const producer = kafka.producer();
      await producer.connect();
      this.producer = producer;
      this.logger.log('Connected to Kafka broker');
    } catch (error) {
      this.logger.warn(
        `Kafka producer setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
