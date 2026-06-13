import { RiskLevel } from '../enums/risk-level.enum';

export class PsychologicalFollowUp {
  constructor(
    public readonly id: string,
    public readonly appointmentId: string,
    public readonly studentId: string,
    public observations: string,
    public recommendations: string,
    public riskLevel: RiskLevel,
    public nextAction: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}
}
