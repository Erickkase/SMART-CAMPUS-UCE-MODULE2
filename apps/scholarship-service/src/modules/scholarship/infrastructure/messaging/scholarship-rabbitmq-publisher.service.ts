import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Channel, ChannelModel, connect } from 'amqplib';
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
export class ScholarshipRabbitMqPublisherService implements OnModuleDestroy {
  private readonly logger = new Logger(ScholarshipRabbitMqPublisherService.name);
  private readonly enabled: boolean;
  private readonly exchange: string;
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;
  private setupPromise: Promise<void> | null = null;

  constructor(private readonly configService: ConfigService) {
    this.enabled = this.configService.get<boolean>('rabbitmq.enabled') ?? false;
    this.exchange = this.configService.get<string>('rabbitmq.exchange') ?? 'welfare.events';
  }

  async publishScholarshipCreated(payload: ScholarshipEventPayload): Promise<void> {
    await this.publish(SCHOLARSHIP_CREATED_TOPIC, {
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
    await this.publish(SCHOLARSHIP_STATUS_UPDATED_TOPIC, {
      event: payload.event,
      scholarshipId: payload.scholarshipId,
      studentId: payload.studentId,
      scholarshipType: payload.scholarshipType,
      status: payload.status,
      occurredAt: payload.occurredAt,
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel?.close().catch(() => undefined);
    await this.connection?.close().catch(() => undefined);
  }

  private async publish(topic: string, payload: Record<string, string>): Promise<void> {
    if (!this.enabled) {
      return;
    }

    await this.ensureSetup();

    const channel = this.channel;
    if (!channel) {
      return;
    }

    channel.publish(this.exchange, topic, Buffer.from(JSON.stringify(payload)), {
      contentType: 'application/json',
      persistent: true,
    });
  }

  private async ensureSetup(): Promise<void> {
    if (this.channel) {
      return;
    }

    this.setupPromise ??= this.setup();
    await this.setupPromise;
  }

  private async setup(): Promise<void> {
    try {
      const connection = await connect(
        this.configService.get<string>('rabbitmq.url') ?? 'amqp://guest:guest@localhost:5672',
      );
      const channel = await connection.createChannel();
      await channel.assertExchange(this.exchange, 'topic', { durable: true });

      this.connection = connection;
      this.channel = channel;
      this.logger.log('Connected to RabbitMQ broker');
    } catch (error) {
      this.logger.warn(
        `RabbitMQ publisher setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
