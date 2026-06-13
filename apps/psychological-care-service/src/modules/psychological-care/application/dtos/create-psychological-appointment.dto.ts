import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { AppointmentStatus } from '../../domain/enums/appointment-status.enum';
import { CareModality } from '../../domain/enums/care-modality.enum';

export class CreatePsychologicalAppointmentDto {
  @ApiProperty({
    description: 'Student identifier',
    format: 'uuid',
    example: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
  })
  @IsUUID()
  studentId!: string;

  @ApiProperty({
    description: 'Psychologist identifier',
    format: 'uuid',
    example: '76b6eb1f-2395-4b24-9d0b-7d02143b13ef',
  })
  @IsUUID()
  psychologistId!: string;

  @ApiProperty({
    description: 'Appointment date and time',
    example: '2026-06-15T14:30:00.000Z',
  })
  @IsDateString()
  appointmentDate!: string;

  @ApiProperty({
    description: 'Care modality for the appointment',
    enum: CareModality,
    example: CareModality.IN_PERSON,
  })
  @IsEnum(CareModality)
  modality!: CareModality;

  @ApiProperty({
    description: 'Initial appointment status',
    enum: AppointmentStatus,
    example: AppointmentStatus.SCHEDULED,
  })
  @IsEnum(AppointmentStatus)
  status!: AppointmentStatus;

  @ApiProperty({
    description: 'Appointment notes',
    example: 'First session scheduled after student welfare intake.',
  })
  @IsString()
  @IsNotEmpty()
  notes!: string;
}
