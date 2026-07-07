import { StudentRequestPriority } from '../enums/student-request-priority.enum';
import { StudentRequestStatus } from '../enums/student-request-status.enum';

export class StudentRequest {
  constructor(
    public readonly id: string,
    public studentId: string,
    public requestType: string,
    public title: string,
    public description: string,
    public priority: StudentRequestPriority,
    public status: StudentRequestStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}
}
