import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EnrollmentStatus } from '../../domain/enums/enrollment-status.enum';
import { CreateEnrollmentDto } from './create-enrollment.dto';

export class UpdateEnrollmentDto extends PartialType(CreateEnrollmentDto) {
  @ApiPropertyOptional({ description: 'Academic period', example: '2026-2' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  academicPeriod?: string;

  @ApiPropertyOptional({
    description: 'Enrollment status',
    enum: EnrollmentStatus,
    example: EnrollmentStatus.DROPPED,
  })
  @IsOptional()
  @IsEnum(EnrollmentStatus)
  status?: EnrollmentStatus;
}
