import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ScholarshipOutboxStatus } from '../../../../domain/enums/scholarship-outbox-status.enum';

@Entity({ name: 'scholarship_outbox_events' })
export class ScholarshipOutboxTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  aggregateId!: string;

  @Column({ type: 'varchar', length: 120 })
  eventType!: string;

  @Column({ type: 'text' })
  payload!: string;

  @Column({
    type: 'enum',
    enum: ScholarshipOutboxStatus,
    default: ScholarshipOutboxStatus.PENDING,
  })
  status!: ScholarshipOutboxStatus;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  publishedAt!: Date | null;
}
