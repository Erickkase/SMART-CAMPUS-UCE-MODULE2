import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';
import { Scholarship } from '../../domain/entities/scholarship.entity';
import {
  SCHOLARSHIP_CREATED_TOPIC,
  SCHOLARSHIP_STATUS_UPDATED_TOPIC,
} from './scholarship-mqtt-topics';

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

  async publishScholarshipCreated(scholarship: Scholarship): Promise<void> {
    await this.publish({
      key: scholarship.id,
      event: SCHOLARSHIP_CREATED_TOPIC,
      scholarshipId: scholarship.id,
      studentId: scholarship.studentId,
      scholarshipType: scholarship.scholarshipType,
      status: scholarship.status,
      occurredAt: scholarship.createdAt.toISOString(),
    });
  }

  async publishScholarshipStatusUpdated(scholarship: Scholarship): Promise<void> {
    await this.publish({
      key: scholarship.id,
      event: SCHOLARSHIP_STATUS_UPDATED_TOPIC,
      scholarshipId: scholarship.id,
      studentId: scholarship.studentId,
      scholarshipType: scholarship.scholarshipType,
      status: scholarship.status,
      occurredAt: scholarship.updatedAt.toISOString(),
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
