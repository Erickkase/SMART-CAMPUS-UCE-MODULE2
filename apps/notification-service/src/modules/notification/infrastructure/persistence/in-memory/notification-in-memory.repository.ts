import { Injectable } from '@nestjs/common';
import { Notification } from '../../../domain/entities/notification.entity';
import { NotificationStatus } from '../../../domain/enums/notification-status.enum';
import {
  NotificationRepository,
  UpdateNotificationData,
} from '../../../domain/repositories/notification.repository';

@Injectable()
export class NotificationInMemoryRepository implements NotificationRepository {
  private readonly notifications = new Map<string, Notification>();

  async create(notification: Notification): Promise<Notification> {
    this.notifications.set(notification.id, notification);
    return notification;
  }

  async findAll(): Promise<Notification[]> {
    return Array.from(this.notifications.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  async findById(id: string): Promise<Notification | null> {
    return this.notifications.get(id) ?? null;
  }

  async findByRecipientId(recipientId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter((notification) => notification.recipientId === recipientId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async update(id: string, data: UpdateNotificationData): Promise<Notification | null> {
    const existing = this.notifications.get(id);
    if (!existing) {
      return null;
    }

    if (data.recipientId !== undefined) existing.recipientId = data.recipientId;
    if (data.recipientType !== undefined) existing.recipientType = data.recipientType;
    if (data.channel !== undefined) existing.channel = data.channel;
    if (data.subject !== undefined) existing.subject = data.subject;
    if (data.content !== undefined) existing.content = data.content;
    if (data.scheduledAt !== undefined) existing.scheduledAt = data.scheduledAt;
    if (data.sentAt !== undefined) existing.sentAt = data.sentAt;
    if (data.metadata !== undefined) existing.metadata = data.metadata;

    existing.updatedAt = new Date();
    this.notifications.set(id, existing);
    return existing;
  }

  async updateStatus(id: string, status: NotificationStatus): Promise<Notification | null> {
    const existing = this.notifications.get(id);
    if (!existing) {
      return null;
    }

    existing.status = status;
    existing.updatedAt = new Date();
    this.notifications.set(id, existing);
    return existing;
  }

  async delete(id: string): Promise<boolean> {
    return this.notifications.delete(id);
  }
}
