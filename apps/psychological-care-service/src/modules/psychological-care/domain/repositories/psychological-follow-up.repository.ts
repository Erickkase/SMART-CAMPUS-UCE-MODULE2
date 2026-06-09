import { PsychologicalFollowUp } from '../entities/psychological-follow-up.entity';
import { RiskLevel } from '../enums/risk-level.enum';

export const PSYCHOLOGICAL_FOLLOW_UP_REPOSITORY = 'PSYCHOLOGICAL_FOLLOW_UP_REPOSITORY';

export interface PsychologicalFollowUpRepository {
  create(followUp: PsychologicalFollowUp): Promise<PsychologicalFollowUp>;
  findAll(): Promise<PsychologicalFollowUp[]>;
  findById(id: string): Promise<PsychologicalFollowUp | null>;
  findByStudentId(studentId: string): Promise<PsychologicalFollowUp[]>;
  updateRiskLevel(id: string, riskLevel: RiskLevel): Promise<PsychologicalFollowUp | null>;
  delete(id: string): Promise<boolean>;
}
