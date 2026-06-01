import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ScholarshipStatus } from '../../domain/enums/scholarship-status.enum';

export class CreateScholarshipDto {
  @ApiProperty({
    description: 'Student identifier',
    format: 'uuid',
    example: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
  })
  @IsUUID()
  studentId!: string;

  @ApiProperty({
    description: 'Scholarship type requested by the student',
    example: 'ECONOMIC_SUPPORT',
  })
  @IsString()
  @IsNotEmpty()
  scholarshipType!: string;

  @ApiProperty({
    description: 'Reason submitted by the student',
    example: 'Financial hardship due to family situation',
  })
  @IsString()
  @IsNotEmpty()
  reason!: string;

  @ApiProperty({
    description: 'Initial workflow status',
    enum: ScholarshipStatus,
    example: ScholarshipStatus.PENDING,
  })
  @IsEnum(ScholarshipStatus)
  status!: ScholarshipStatus;
}
