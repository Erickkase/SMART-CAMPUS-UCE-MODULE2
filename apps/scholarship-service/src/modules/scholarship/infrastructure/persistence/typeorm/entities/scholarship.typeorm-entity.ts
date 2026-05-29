import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ScholarshipStatus } from '../../../../domain/enums/scholarship-status.enum';

@Entity({ name: 'scholarships' })
export class ScholarshipTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  studentId: string;

  @Column({ type: 'varchar', length: 100 })
  scholarshipType: string;

  @Column({ type: 'text' })
  reason: string;

  @Column({
    type: 'enum',
    enum: ScholarshipStatus,
    default: ScholarshipStatus.PENDING,
  })
  status: ScholarshipStatus;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
