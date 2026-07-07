import { StudentRequest } from '../entities/student-request.entity';
import { StudentRequestPriority } from '../enums/student-request-priority.enum';
import { StudentRequestStatus } from '../enums/student-request-status.enum';

export const STUDENT_REQUEST_REPOSITORY = 'STUDENT_REQUEST_REPOSITORY';

export interface UpdateStudentRequestData {
  studentId?: string;
  requestType?: string;
  title?: string;
  description?: string;
  priority?: StudentRequestPriority;
}

export interface StudentRequestRepository {
  create(studentRequest: StudentRequest): Promise<StudentRequest>;
  findAll(): Promise<StudentRequest[]>;
  findById(id: string): Promise<StudentRequest | null>;
  findByStudentId(studentId: string): Promise<StudentRequest[]>;
  update(id: string, data: UpdateStudentRequestData): Promise<StudentRequest | null>;
  updateStatus(id: string, status: StudentRequestStatus): Promise<StudentRequest | null>;
  delete(id: string): Promise<boolean>;
}
