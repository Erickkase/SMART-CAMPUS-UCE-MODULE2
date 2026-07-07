import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Channel, ChannelModel, ConsumeMessage, connect } from 'amqplib';

const CONSUMED_ROUTING_KEYS = ['scholarship.created', 'scholarship.status.updated'] as const;
const QUEUE_NAME = 'psychological-care.scholarship.events';

@Injectable()
export class ScholarshipRabbitMqConsumerService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(ScholarshipRabbitMqConsumerService.name);
  private readonly enabled: boolean;
  private readonly exchange: string;
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;

  constructor(private readonly configService: ConfigService) {
    this.enabled = this.configService.get<boolean>('rabbitmq.enabled') ?? false;
    this.exchange = this.configService.get<string>('rabbitmq.exchange') ?? 'welfare.events';
  }

  async onModuleInit(): Promise<void> {
    if (!this.enabled) {
      return;
    }

    try {
      const connection = await connect(
        this.configService.get<string>('rabbitmq.url') ?? 'amqp://guest:guest@localhost:5672',
      );
      const channel = await connection.createChannel();
      await channel.assertExchange(this.exchange, 'topic', { durable: true });
      await channel.assertQueue(QUEUE_NAME, { durable: true });

      for (const routingKey of CONSUMED_ROUTING_KEYS) {
        await channel.bindQueue(QUEUE_NAME, this.exchange, routingKey);
      }

      await channel.consume(QUEUE_NAME, (message) => this.handleMessage(message));

      this.connection = connection;
      this.channel = channel;
      this.logger.log('Connected to RabbitMQ broker');
    } catch (error) {
      this.logger.warn(
        `RabbitMQ consumer setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel?.close().catch(() => undefined);
    await this.connection?.close().catch(() => undefined);
  }

  private handleMessage(message: ConsumeMessage | null): void {
    if (!message || !this.channel) {
      return;
    }

    this.logger.log(
      `Received RabbitMQ event ${message.fields.routingKey}: ${message.content.toString('utf8')}`,
    );
    this.channel.ack(message);
  }
}
