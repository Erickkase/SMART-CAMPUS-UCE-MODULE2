import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MqttClient, connect } from 'mqtt';

const SUBSCRIBED_TOPICS = ['scholarship.created', 'scholarship.status.updated'] as const;

@Injectable()
export class ScholarshipEventsConsumerService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(ScholarshipEventsConsumerService.name);
  private readonly mqttEnabled: boolean;
  private readonly client: MqttClient | null;

  constructor(private readonly configService: ConfigService) {
    this.mqttEnabled = this.configService.get<boolean>('mqtt.enabled') ?? false;

    if (!this.mqttEnabled) {
      this.client = null;
      return;
    }

    this.client = connect(this.configService.get<string>('mqtt.brokerUrl')!, {
      clientId: `${this.configService.get<string>('mqtt.clientId')}-consumer`,
    });
  }

  async onModuleInit(): Promise<void> {
    if (!this.client) {
      return;
    }

    this.client.on('connect', () => {
      this.logger.log('Connected to MQTT broker');

      for (const topic of SUBSCRIBED_TOPICS) {
        this.client?.subscribe(topic, { qos: 1 }, (error) => {
          if (error) {
            this.logger.warn(`Unable to subscribe to ${topic}: ${error.message}`);
          }
        });
      }
    });

    this.client.on('message', (topic, message) => {
      this.logger.log(
        `Received MQTT event ${topic}: ${message.toString('utf8')}`,
      );
    });

    this.client.on('error', (error) => {
      this.logger.warn(`MQTT consumer error: ${error.message}`);
    });
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.client) {
      return;
    }

    await new Promise<void>((resolve) => {
      this.client?.end(false, {}, () => resolve());
    });
  }
}
