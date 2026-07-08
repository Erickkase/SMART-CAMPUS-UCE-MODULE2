import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Notification } from '../../../../domain/entities/notification.entity';
import { OutboxEvent } from '../../../../domain/entities/outbox-event.entity';
import { NotificationStatus } from '../../../../domain/enums/notification-status.enum';
import {
  NotificationRepository,
  UpdateNotificationData,
} from '../../../../domain/repositories/notification.repository';
import { OutboxEventTypeOrmEntity } from '../entities/outbox-event.typeorm-entity';
import { NotificationTypeOrmEntity } from '../entities/notification.typeorm-entity';

@Injectable()
export class NotificationTypeOrmRepository implements NotificationRepository {
  constructor(
    @InjectRepository(NotificationTypeOrmEntity)
    private readonly repository: Repository<NotificationTypeOrmEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async create(notification: Notification): Promise<Notification> {
    const savedEntity = await this.repository.save(this.toPersistence(notification));
    return this.toDomain(savedEntity);
  }

  async createWithOutbox(
    notification: Notification,
    outboxEvent: OutboxEvent,
  ): Promise<Notification> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const savedNotification = await queryRunner.manager.save(
        NotificationTypeOrmEntity,
        this.toPersistence(notification),
      );

      await queryRunner.manager.save(
        OutboxEventTypeOrmEntity,
        this.toPersistenceOutbox(outboxEvent),
      );

      await queryRunner.commitTransaction();
      return this.toDomain(savedNotification);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Notification[]> {
    const entities = await this.repository.find({ order: { createdAt: 'DESC' } });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findById(id: string): Promise<Notification | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByRecipientId(recipientId: string): Promise<Notification[]> {
    const entities = await this.repository.find({
      where: { recipientId },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async update(id: string, data: UpdateNotificationData): Promise<Notification | null> {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) {
      return null;
    }

    const savedEntity = await this.repository.save(this.repository.merge(existing, data));
    return this.toDomain(savedEntity);
  }

  async updateStatus(id: string, status: NotificationStatus): Promise<Notification | null> {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) {
      return null;
    }

    existing.status = status;
    const savedEntity = await this.repository.save(existing);
    return this.toDomain(savedEntity);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  private toDomain(entity: NotificationTypeOrmEntity): Notification {
    return new Notification(
      entity.id,
      entity.recipientId,
      entity.recipientType,
      entity.channel,
      entity.subject,
      entity.content,
      entity.status,
      entity.scheduledAt,
      entity.sentAt,
      entity.metadata,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  private toPersistence(notification: Notification): Partial<NotificationTypeOrmEntity> {
    return {
      id: notification.id,
      recipientId: notification.recipientId,
      recipientType: notification.recipientType,
      channel: notification.channel,
      subject: notification.subject,
      content: notification.content,
      status: notification.status,
      scheduledAt: notification.scheduledAt,
      sentAt: notification.sentAt,
      metadata: notification.metadata,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };
  }

  private toPersistenceOutbox(outboxEvent: OutboxEvent): Partial<OutboxEventTypeOrmEntity> {
    return {
      id: outboxEvent.id,
      aggregateType: outboxEvent.aggregateType,
      aggregateId: outboxEvent.aggregateId,
      eventType: outboxEvent.eventType,
      payload: outboxEvent.payload,
      status: outboxEvent.status,
      retryCount: outboxEvent.retryCount,
      errorMessage: outboxEvent.errorMessage,
      createdAt: outboxEvent.createdAt,
      processedAt: outboxEvent.processedAt,
    };
  }
}
