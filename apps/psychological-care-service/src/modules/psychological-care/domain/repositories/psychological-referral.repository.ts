import { PsychologicalReferral } from '../entities/psychological-referral.entity';
import { RequestStatus } from '../enums/request-status.enum';

export const PSYCHOLOGICAL_REFERRAL_REPOSITORY = 'PSYCHOLOGICAL_REFERRAL_REPOSITORY';

export interface PsychologicalReferralRepository {
  create(referral: PsychologicalReferral): Promise<PsychologicalReferral>;
  findAll(): Promise<PsychologicalReferral[]>;
  findById(id: string): Promise<PsychologicalReferral | null>;
  findByStudentId(studentId: string): Promise<PsychologicalReferral[]>;
  updateStatus(id: string, status: RequestStatus): Promise<PsychologicalReferral | null>;
  delete(id: string): Promise<boolean>;
}
