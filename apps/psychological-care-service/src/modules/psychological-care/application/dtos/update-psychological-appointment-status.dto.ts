import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AppointmentStatus } from '../../domain/enums/appointment-status.enum';

export class UpdatePsychologicalAppointmentStatusDto {
  @ApiProperty({
    description: 'New psychological appointment status',
    enum: AppointmentStatus,
    example: AppointmentStatus.COMPLETED,
  })
  @IsEnum(AppointmentStatus)
  status!: AppointmentStatus;
}
