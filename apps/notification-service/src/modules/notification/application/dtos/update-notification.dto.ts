import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { NotificationChannel } from '../../domain/enums/notification-channel.enum';
import { RecipientType } from '../../domain/enums/recipient-type.enum';

export class UpdateNotificationDto {
  @ApiProperty({
    description: 'Recipient identifier',
    format: 'uuid',
    example: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  recipientId?: string;

  @ApiProperty({
    description: 'Recipient type',
    enum: RecipientType,
    example: RecipientType.STUDENT,
    required: false,
  })
  @IsOptional()
  @IsEnum(RecipientType)
  recipientType?: RecipientType;

  @ApiProperty({
    description: 'Notification channel',
    enum: NotificationChannel,
    example: NotificationChannel.EMAIL,
    required: false,
  })
  @IsOptional()
  @IsEnum(NotificationChannel)
  channel?: NotificationChannel;

  @ApiProperty({
    description: 'Notification subject',
    example: 'Scholarship request updated',
    required: false,
  })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({
    description: 'Notification content',
    example: 'Your scholarship request has been approved.',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'Optional scheduled date for the notification',
    required: false,
    example: '2026-07-01T10:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiProperty({
    description: 'Optional metadata for the notification',
    required: false,
    example: { pushToken: 'abc123' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
