import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAppointmentDto {
  @ApiPropertyOptional({
    description: 'Psychologist identifier',
    format: 'uuid',
    example: '9c6ef28c-c551-427f-b8c0-cf8261598513',
  })
  @IsUUID()
  @IsOptional()
  psychologistId?: string;

  @ApiPropertyOptional({
    description: 'Scheduled date and time for the appointment (ISO 8601)',
    example: '2026-07-10T14:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @ApiPropertyOptional({
    description: 'Reason for the psychological care appointment',
    example: 'Follow-up session',
  })
  @IsString()
  @IsOptional()
  reason?: string;
}
