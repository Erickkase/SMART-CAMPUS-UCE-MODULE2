import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
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
    example: '9c6ef28c-c551-427f-b8c0-cf8261598513',
  })
  @IsUUID()
  psychologistId!: string;

  @ApiProperty({
    description: 'Scheduled date and time for the appointment (ISO 8601)',
    example: '2026-07-10T14:00:00.000Z',
  })
  @IsDateString()
  scheduledAt!: string;

  @ApiProperty({
    description: 'Reason for the psychological care appointment',
    example: 'Initial consultation for academic stress',
  })
  @IsString()
  @IsNotEmpty()
  reason!: string;
}
