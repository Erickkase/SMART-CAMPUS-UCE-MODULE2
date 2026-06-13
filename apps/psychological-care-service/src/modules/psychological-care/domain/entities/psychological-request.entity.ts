import { RequestStatus } from '../enums/request-status.enum';
import { RiskLevel } from '../enums/risk-level.enum';

export class PsychologicalRequest {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public reason: string,
    public priority: RiskLevel,
    public status: RequestStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}
}
