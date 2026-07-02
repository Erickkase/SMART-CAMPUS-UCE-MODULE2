import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { NotificationStatus } from '../../domain/enums/notification-status.enum';

export class UpdateNotificationStatusDto {
  @ApiProperty({
    description: 'New notification status',
    enum: NotificationStatus,
    example: NotificationStatus.SENT,
  })
  @IsEnum(NotificationStatus)
  status!: NotificationStatus;
}
