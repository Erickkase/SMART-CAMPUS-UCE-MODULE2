import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID, Length } from 'class-validator';
import { StudentRequestPriority } from '../../domain/enums/student-request-priority.enum';
import { StudentRequestStatus } from '../../domain/enums/student-request-status.enum';

export class CreateStudentRequestDto {
  @ApiProperty({ example: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5' })
  @IsUUID()
  studentId!: string;

  @ApiProperty({ example: 'SCHOLARSHIP_REVIEW' })
  @IsString()
  @Length(3, 100)
  requestType!: string;

  @ApiProperty({ example: 'Review scholarship decision' })
  @IsString()
  @Length(5, 150)
  title!: string;

  @ApiProperty({ example: 'Student requests a detailed review of the current scholarship decision.' })
  @IsString()
  @Length(10, 1000)
  description!: string;

  @ApiProperty({ enum: StudentRequestPriority, example: StudentRequestPriority.MEDIUM })
  @IsEnum(StudentRequestPriority)
  priority!: StudentRequestPriority;

  @ApiProperty({ enum: StudentRequestStatus, example: StudentRequestStatus.APPROVED })
  @IsEnum(StudentRequestStatus)
  status!: StudentRequestStatus;
}
