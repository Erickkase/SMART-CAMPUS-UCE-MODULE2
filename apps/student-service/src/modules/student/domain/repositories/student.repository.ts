import { Student } from '../entities/student.entity';

export const STUDENT_REPOSITORY = 'STUDENT_REPOSITORY';

export interface UpdateStudentData {
  identification?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  academicProgram?: string;
  isActive?: boolean;
}

export interface StudentRepository {
  create(student: Student): Promise<Student>;
  findAll(): Promise<Student[]>;
  findById(id: string): Promise<Student | null>;
  update(id: string, data: UpdateStudentData): Promise<Student | null>;
  delete(id: string): Promise<boolean>;
}
