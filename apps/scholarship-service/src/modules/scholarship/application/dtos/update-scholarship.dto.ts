import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ScholarshipStatus } from '../../domain/enums/scholarship-status.enum';
import { CreateScholarshipDto } from './create-scholarship.dto';

export class UpdateScholarshipDto extends PartialType(CreateScholarshipDto) {
  @ApiPropertyOptional({
    description: 'Student identifier',
    format: 'uuid',
    example: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
  })
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @ApiPropertyOptional({
    description: 'Scholarship type requested by the student',
    example: 'ECONOMIC_SUPPORT',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  scholarshipType?: string;

  @ApiPropertyOptional({
    description: 'Reason submitted by the student',
    example: 'Updated justification after document review',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  reason?: string;

  @ApiPropertyOptional({
    description: 'Workflow status',
    enum: ScholarshipStatus,
    example: ScholarshipStatus.UNDER_REVIEW,
  })
  @IsOptional()
  @IsEnum(ScholarshipStatus)
  status?: ScholarshipStatus;
}
