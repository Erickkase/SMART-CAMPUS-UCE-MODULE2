import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { RequestStatus } from '../../domain/enums/request-status.enum';
import { RiskLevel } from '../../domain/enums/risk-level.enum';

export class CreatePsychologicalRequestDto {
  @ApiProperty({
    description: 'Student identifier',
    format: 'uuid',
    example: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
  })
  @IsUUID()
  studentId!: string;

  @ApiProperty({
    description: 'Reason for requesting psychological care',
    example: 'Student reports anxiety symptoms before exams',
  })
  @IsString()
  @IsNotEmpty()
  reason!: string;

  @ApiProperty({
    description: 'Initial priority assigned to the request',
    enum: RiskLevel,
    example: RiskLevel.MEDIUM,
  })
  @IsEnum(RiskLevel)
  priority!: RiskLevel;

  @ApiProperty({
    description: 'Initial request workflow status',
    enum: RequestStatus,
    example: RequestStatus.REQUESTED,
  })
  @IsEnum(RequestStatus)
  status!: RequestStatus;
}
