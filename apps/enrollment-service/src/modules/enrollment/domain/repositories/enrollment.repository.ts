import { Enrollment } from '../entities/enrollment.entity';
import { EnrollmentStatus } from '../enums/enrollment-status.enum';

export const ENROLLMENT_REPOSITORY = 'ENROLLMENT_REPOSITORY';

export interface UpdateEnrollmentData {
  academicPeriod?: string;
  status?: EnrollmentStatus;
}

export interface EnrollmentRepository {
  create(enrollment: Enrollment): Promise<Enrollment>;
  findAll(): Promise<Enrollment[]>;
  findById(id: string): Promise<Enrollment | null>;
  findByStudentId(studentId: string): Promise<Enrollment[]>;
  findBySubjectId(subjectId: string): Promise<Enrollment[]>;
  update(id: string, data: UpdateEnrollmentData): Promise<Enrollment | null>;
  delete(id: string): Promise<boolean>;
}
