import { RequestStatus } from '../enums/request-status.enum';

export class PsychologicalReferral {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public referredTo: string,
    public reason: string,
    public status: RequestStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}
}
