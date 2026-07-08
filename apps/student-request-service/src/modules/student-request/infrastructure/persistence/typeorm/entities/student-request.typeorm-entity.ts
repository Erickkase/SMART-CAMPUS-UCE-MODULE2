import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { StudentRequestPriority } from '../../../../domain/enums/student-request-priority.enum';
import { StudentRequestStatus } from '../../../../domain/enums/student-request-status.enum';

@Entity({ name: 'student_requests' })
export class StudentRequestTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  studentId!: string;

  @Column({ type: 'varchar', length: 100 })
  requestType!: string;

  @Column({ type: 'varchar', length: 150 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'enum', enum: StudentRequestPriority })
  priority!: StudentRequestPriority;

  @Column({ type: 'enum', enum: StudentRequestStatus, default: StudentRequestStatus.PENDING })
  status!: StudentRequestStatus;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;
}
