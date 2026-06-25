import { Subject } from '../entities/subject.entity';

export const SUBJECT_REPOSITORY = 'SUBJECT_REPOSITORY';

export interface UpdateSubjectData {
  code?: string;
  name?: string;
  credits?: number;
  academicLevel?: number;
  isActive?: boolean;
}

export interface SubjectRepository {
  create(subject: Subject): Promise<Subject>;
  findAll(): Promise<Subject[]>;
  findById(id: string): Promise<Subject | null>;
  update(id: string, data: UpdateSubjectData): Promise<Subject | null>;
  delete(id: string): Promise<boolean>;
}
