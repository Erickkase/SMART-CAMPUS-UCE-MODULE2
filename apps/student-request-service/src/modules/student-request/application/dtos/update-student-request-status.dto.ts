import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { StudentRequestStatus } from '../../domain/enums/student-request-status.enum';

export class UpdateStudentRequestStatusDto {
  @ApiProperty({ enum: StudentRequestStatus, example: StudentRequestStatus.IN_REVIEW })
  @IsEnum(StudentRequestStatus)
  status!: StudentRequestStatus;
}
