import { ScholarshipStatus } from '../enums/scholarship-status.enum';

export class Scholarship {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public scholarshipType: string,
    public reason: string,
    public status: ScholarshipStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}
}
