import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RequestStatus } from '../../../../domain/enums/request-status.enum';

@Entity({ name: 'psychological_referrals' })
export class PsychologicalReferralTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  studentId!: string;

  @Column({ type: 'varchar', length: 150 })
  referredTo!: string;

  @Column({ type: 'text' })
  reason!: string;

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.REFERRED })
  status!: RequestStatus;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;
}
