import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RequestStatus } from '../../domain/enums/request-status.enum';

export class UpdatePsychologicalReferralStatusDto {
  @ApiProperty({
    description: 'New psychological referral status',
    enum: RequestStatus,
    example: RequestStatus.COMPLETED,
  })
  @IsEnum(RequestStatus)
  status!: RequestStatus;
}
