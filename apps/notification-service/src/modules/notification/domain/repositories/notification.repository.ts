import { Notification } from '../entities/notification.entity';
import { NotificationChannel } from '../enums/notification-channel.enum';
import { NotificationStatus } from '../enums/notification-status.enum';
import { RecipientType } from '../enums/recipient-type.enum';

export const NOTIFICATION_REPOSITORY = 'NOTIFICATION_REPOSITORY';

export interface UpdateNotificationData {
  recipientId?: string;
  recipientType?: RecipientType;
  channel?: NotificationChannel;
  subject?: string;
  content?: string;
  scheduledAt?: Date | null;
  sentAt?: Date | null;
  metadata?: Record<string, unknown> | null;
}

export interface NotificationRepository {
  create(notification: Notification): Promise<Notification>;
  findAll(): Promise<Notification[]>;
  findById(id: string): Promise<Notification | null>;
  findByRecipientId(recipientId: string): Promise<Notification[]>;
  update(id: string, data: UpdateNotificationData): Promise<Notification | null>;
  updateStatus(id: string, status: NotificationStatus): Promise<Notification | null>;
  delete(id: string): Promise<boolean>;
}
