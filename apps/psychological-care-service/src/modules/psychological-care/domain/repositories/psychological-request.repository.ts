import { PsychologicalRequest } from '../entities/psychological-request.entity';
import { RequestStatus } from '../enums/request-status.enum';

export const PSYCHOLOGICAL_REQUEST_REPOSITORY = 'PSYCHOLOGICAL_REQUEST_REPOSITORY';

export interface PsychologicalRequestRepository {
  create(request: PsychologicalRequest): Promise<PsychologicalRequest>;
  findAll(): Promise<PsychologicalRequest[]>;
  findById(id: string): Promise<PsychologicalRequest | null>;
  findByStudentId(studentId: string): Promise<PsychologicalRequest[]>;
  updateStatus(id: string, status: RequestStatus): Promise<PsychologicalRequest | null>;
  delete(id: string): Promise<boolean>;
}
