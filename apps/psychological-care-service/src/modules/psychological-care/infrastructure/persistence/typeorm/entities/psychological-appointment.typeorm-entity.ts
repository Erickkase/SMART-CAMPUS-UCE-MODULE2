import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AppointmentStatus } from '../../../../domain/enums/appointment-status.enum';
import { CareModality } from '../../../../domain/enums/care-modality.enum';

@Entity({ name: 'psychological_appointments' })
export class PsychologicalAppointmentTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  studentId!: string;

  @Column({ type: 'varchar', length: 100 })
  psychologistId!: string;

  @Column({ type: 'timestamp with time zone' })
  appointmentDate!: Date;

  @Column({ type: 'enum', enum: CareModality })
  modality!: CareModality;

  @Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.SCHEDULED })
  status!: AppointmentStatus;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;
}
