import { EnrollmentStatus } from '../enums/enrollment-status.enum';

export class Enrollment {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly subjectId: string,
    public academicPeriod: string,
    public status: EnrollmentStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}
}
