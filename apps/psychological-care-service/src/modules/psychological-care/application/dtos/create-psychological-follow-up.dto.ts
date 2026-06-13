import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { RiskLevel } from '../../domain/enums/risk-level.enum';

export class CreatePsychologicalFollowUpDto {
  @ApiProperty({
    description: 'Appointment identifier',
    format: 'uuid',
    example: '44d28ea3-2bc1-4fd7-97ee-7c876e0acba4',
  })
  @IsUUID()
  appointmentId!: string;

  @ApiProperty({
    description: 'Student identifier',
    format: 'uuid',
    example: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
  })
  @IsUUID()
  studentId!: string;

  @ApiProperty({
    description: 'Follow-up observations',
    example: 'Student shows improvement in stress management routines.',
  })
  @IsString()
  @IsNotEmpty()
  observations!: string;

  @ApiProperty({
    description: 'Professional recommendations',
    example: 'Continue breathing exercises and schedule a follow-up session.',
  })
  @IsString()
  @IsNotEmpty()
  recommendations!: string;

  @ApiProperty({
    description: 'Current risk level identified during follow-up',
    enum: RiskLevel,
    example: RiskLevel.LOW,
  })
  @IsEnum(RiskLevel)
  riskLevel!: RiskLevel;

  @ApiProperty({
    description: 'Next action to be taken',
    example: 'Schedule follow-up appointment in two weeks.',
  })
  @IsString()
  @IsNotEmpty()
  nextAction!: string;
}
