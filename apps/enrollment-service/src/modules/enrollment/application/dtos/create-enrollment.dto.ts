import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { EnrollmentStatus } from '../../domain/enums/enrollment-status.enum';

export class CreateEnrollmentDto {
  @ApiProperty({
    description: 'Student identifier',
    format: 'uuid',
    example: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
  })
  @IsUUID()
  studentId!: string;

  @ApiProperty({
    description: 'Subject identifier',
    format: 'uuid',
    example: '86a8aa07-b63d-4b1d-9f87-62be9f6d4182',
  })
  @IsUUID()
  subjectId!: string;

  @ApiProperty({
    description: 'Academic period for the enrollment',
    example: '2026-1',
  })
  @IsString()
  @IsNotEmpty()
  academicPeriod!: string;

  @ApiProperty({
    description: 'Initial enrollment status',
    enum: EnrollmentStatus,
    example: EnrollmentStatus.ENROLLED,
  })
  @IsEnum(EnrollmentStatus)
  status!: EnrollmentStatus;
}
