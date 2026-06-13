import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { RequestStatus } from '../../domain/enums/request-status.enum';

export class CreatePsychologicalReferralDto {
  @ApiProperty({
    description: 'Student identifier',
    format: 'uuid',
    example: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
  })
  @IsUUID()
  studentId!: string;

  @ApiProperty({
    description: 'Institution, department, or specialist receiving the referral',
    example: 'External clinical psychology center',
  })
  @IsString()
  @IsNotEmpty()
  referredTo!: string;

  @ApiProperty({
    description: 'Referral reason',
    example: 'Student requires specialized clinical evaluation.',
  })
  @IsString()
  @IsNotEmpty()
  reason!: string;

  @ApiProperty({
    description: 'Initial referral status',
    enum: RequestStatus,
    example: RequestStatus.REFERRED,
  })
  @IsEnum(RequestStatus)
  status!: RequestStatus;
}
