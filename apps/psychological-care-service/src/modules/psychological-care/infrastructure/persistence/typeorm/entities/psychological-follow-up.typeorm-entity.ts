import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RiskLevel } from '../../../../domain/enums/risk-level.enum';

@Entity({ name: 'psychological_follow_ups' })
export class PsychologicalFollowUpTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  appointmentId!: string;

  @Column({ type: 'varchar', length: 100 })
  studentId!: string;

  @Column({ type: 'text' })
  observations!: string;

  @Column({ type: 'text' })
  recommendations!: string;

  @Column({ type: 'enum', enum: RiskLevel, default: RiskLevel.LOW })
  riskLevel!: RiskLevel;

  @Column({ type: 'text' })
  nextAction!: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;
}
