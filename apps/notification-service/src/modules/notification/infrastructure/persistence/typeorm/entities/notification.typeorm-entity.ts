import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NotificationChannel } from '../../../../domain/enums/notification-channel.enum';
import { NotificationStatus } from '../../../../domain/enums/notification-status.enum';
import { RecipientType } from '../../../../domain/enums/recipient-type.enum';

@Entity({ name: 'notifications' })
export class NotificationTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  recipientId!: string;

  @Column({ type: 'enum', enum: RecipientType })
  recipientType!: RecipientType;

  @Column({ type: 'enum', enum: NotificationChannel })
  channel!: NotificationChannel;

  @Column({ type: 'varchar', length: 255 })
  subject!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'enum', enum: NotificationStatus, default: NotificationStatus.PENDING })
  status!: NotificationStatus;

  @Column({ type: 'timestamp with time zone', nullable: true })
  scheduledAt!: Date | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  sentAt!: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, unknown> | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;
}
