import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ScholarshipStatus } from '../../domain/enums/scholarship-status.enum';

export class UpdateScholarshipStatusDto {
  @ApiProperty({
    description: 'New scholarship status',
    enum: ScholarshipStatus,
    example: ScholarshipStatus.APPROVED,
  })
  @IsEnum(ScholarshipStatus)
  status: ScholarshipStatus;
}
