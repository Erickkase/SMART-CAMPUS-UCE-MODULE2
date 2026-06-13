import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RequestStatus } from '../../../../domain/enums/request-status.enum';
import { RiskLevel } from '../../../../domain/enums/risk-level.enum';

@Entity({ name: 'psychological_requests' })
export class PsychologicalRequestTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  studentId!: string;

  @Column({ type: 'text' })
  reason!: string;

  @Column({ type: 'enum', enum: RiskLevel, default: RiskLevel.LOW })
  priority!: RiskLevel;

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.REQUESTED })
  status!: RequestStatus;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;
}
