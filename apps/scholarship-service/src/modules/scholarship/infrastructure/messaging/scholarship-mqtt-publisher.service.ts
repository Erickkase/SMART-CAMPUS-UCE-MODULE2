import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MqttClient, connect } from 'mqtt';
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
export class ScholarshipMqttPublisherService implements OnModuleDestroy {
  private readonly logger = new Logger(ScholarshipMqttPublisherService.name);
  private readonly mqttEnabled: boolean;
  private readonly client: MqttClient | null;

  constructor(private readonly configService: ConfigService) {
    this.mqttEnabled = this.configService.get<boolean>('mqtt.enabled') ?? false;

    if (!this.mqttEnabled) {
      this.client = null;
      return;
    }

    this.client = connect(this.configService.get<string>('mqtt.brokerUrl')!, {
      clientId: this.configService.get<string>('mqtt.clientId'),
    });

    this.client.on('connect', () => {
      this.logger.log('Connected to MQTT broker');
    });

    this.client.on('error', (error) => {
      this.logger.warn(`MQTT publisher error: ${error.message}`);
    });
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
    if (!this.client) {
      return;
    }

    await new Promise<void>((resolve) => {
      this.client?.end(false, {}, () => resolve());
    });
  }

  private async publish(topic: string, payload: Record<string, string>): Promise<void> {
    if (!this.client) {
      return;
    }

    const client = this.client;

    await new Promise<void>((resolve) => {
      client.publish(topic, JSON.stringify(payload), { qos: 1 }, (error) => {
        if (error) {
          this.logger.warn(`Unable to publish MQTT topic ${topic}: ${error.message}`);
        }

        resolve();
      });
    });
  }
}
