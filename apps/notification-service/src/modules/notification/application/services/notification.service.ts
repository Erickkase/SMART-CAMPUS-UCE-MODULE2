import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationStatus } from '../../domain/enums/notification-status.enum';
import {
  NOTIFICATION_REPOSITORY,
  NotificationRepository,
  UpdateNotificationData,
} from '../../domain/repositories/notification.repository';
import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { UpdateNotificationDto } from '../dtos/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async createNotification(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const now = new Date();
    const notification = new Notification(
      randomUUID(),
      createNotificationDto.recipientId,
      createNotificationDto.recipientType,
      createNotificationDto.channel,
      createNotificationDto.subject,
      createNotificationDto.content,
      NotificationStatus.PENDING,
      createNotificationDto.scheduledAt ? new Date(createNotificationDto.scheduledAt) : null,
      null,
      createNotificationDto.metadata ?? null,
      now,
      now,
    );

    return this.notificationRepository.create(notification);
  }

  async getNotifications(): Promise<Notification[]> {
    return this.notificationRepository.findAll();
  }

  async getNotificationById(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findById(id);

    if (!notification) {
      throw new NotFoundException(`Notification with id ${id} was not found`);
    }

    return notification;
  }

  async getNotificationsByRecipientId(recipientId: string): Promise<Notification[]> {
    return this.notificationRepository.findByRecipientId(recipientId);
  }

  async updateNotification(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    await this.getNotificationById(id);

    const updateData: UpdateNotificationData = {
      recipientId: updateNotificationDto.recipientId,
      recipientType: updateNotificationDto.recipientType,
      channel: updateNotificationDto.channel,
      subject: updateNotificationDto.subject,
      content: updateNotificationDto.content,
      scheduledAt: updateNotificationDto.scheduledAt
        ? new Date(updateNotificationDto.scheduledAt)
        : undefined,
      metadata: updateNotificationDto.metadata,
    };

    const updatedNotification = await this.notificationRepository.update(id, updateData);

    if (!updatedNotification) {
      throw new NotFoundException(`Notification with id ${id} was not found`);
    }

    return updatedNotification;
  }

  async updateNotificationStatus(id: string, status: NotificationStatus): Promise<Notification> {
    await this.getNotificationById(id);

    const updatedNotification = await this.notificationRepository.updateStatus(id, status);

    if (!updatedNotification) {
      throw new NotFoundException(`Notification with id ${id} was not found`);
    }

    return updatedNotification;
  }

  async deleteNotification(id: string): Promise<void> {
    await this.getNotificationById(id);

    const deleted = await this.notificationRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Notification with id ${id} was not found`);
    }
  }
}
