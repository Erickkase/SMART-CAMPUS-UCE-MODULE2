import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, Kafka } from 'kafkajs';

@Injectable()
export class ScholarshipKafkaConsumerService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(ScholarshipKafkaConsumerService.name);
  private readonly enabled: boolean;
  private readonly topic: string;
  private consumer: Consumer | null = null;

  constructor(private readonly configService: ConfigService) {
    this.enabled = this.configService.get<boolean>('kafka.enabled') ?? false;
    this.topic =
      this.configService.get<string>('kafka.topics.scholarshipEvents') ??
      'scholarship.events';
  }

  async onModuleInit(): Promise<void> {
    if (!this.enabled) {
      return;
    }

    try {
      const kafka = new Kafka({
        clientId:
          this.configService.get<string>('kafka.clientId') ??
          'psychological-care-service',
        brokers: this.configService.get<string[]>('kafka.brokers') ?? ['localhost:9094'],
      });

      const consumer = kafka.consumer({
        groupId: 'psychological-care-scholarship-events',
      });

      await consumer.connect();
      await consumer.subscribe({ topic: this.topic, fromBeginning: false });
      await consumer.run({
        eachMessage: async ({ message }) => {
          if (!message.value) {
            return;
          }

          this.logger.log(
            `Received Kafka event ${this.topic}: ${message.value.toString()}`,
          );
        },
      });

      this.consumer = consumer;
      this.logger.log('Connected to Kafka broker');
    } catch (error) {
      this.logger.warn(
        `Kafka consumer setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.consumer) {
      return;
    }

    await this.consumer.disconnect().catch(() => undefined);
  }
}
