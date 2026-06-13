import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RequestStatus } from '../../domain/enums/request-status.enum';

export class UpdatePsychologicalRequestStatusDto {
  @ApiProperty({
    description: 'New psychological request status',
    enum: RequestStatus,
    example: RequestStatus.SCHEDULED,
  })
  @IsEnum(RequestStatus)
  status!: RequestStatus;
}
