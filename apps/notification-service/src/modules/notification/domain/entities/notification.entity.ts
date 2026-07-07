import { NotificationChannel } from '../enums/notification-channel.enum';
import { NotificationStatus } from '../enums/notification-status.enum';
import { RecipientType } from '../enums/recipient-type.enum';

export class Notification {
  constructor(
    public readonly id: string,
    public recipientId: string,
    public recipientType: RecipientType,
    public channel: NotificationChannel,
    public subject: string,
    public content: string,
    public status: NotificationStatus,
    public scheduledAt: Date | null,
    public sentAt: Date | null,
    public metadata: Record<string, unknown> | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}
}
