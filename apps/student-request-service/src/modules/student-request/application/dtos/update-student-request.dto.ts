import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { StudentRequestPriority } from '../../domain/enums/student-request-priority.enum';

export class UpdateStudentRequestDto {
  @ApiPropertyOptional({ example: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5' })
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @ApiPropertyOptional({ example: 'PSYCHOLOGICAL_SUPPORT' })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  requestType?: string;

  @ApiPropertyOptional({ example: 'Update counseling request information' })
  @IsOptional()
  @IsString()
  @Length(5, 150)
  title?: string;

  @ApiPropertyOptional({ example: 'Student adds more context for the request.' })
  @IsOptional()
  @IsString()
  @Length(10, 1000)
  description?: string;

  @ApiPropertyOptional({ enum: StudentRequestPriority, example: StudentRequestPriority.HIGH })
  @IsOptional()
  @IsEnum(StudentRequestPriority)
  priority?: StudentRequestPriority;
}
