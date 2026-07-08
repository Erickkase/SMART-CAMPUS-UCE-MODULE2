import { ScholarshipOutboxStatus } from '../enums/scholarship-outbox-status.enum';

export class ScholarshipOutboxEvent {
  constructor(
    public readonly id: string,
    public readonly aggregateId: string,
    public readonly eventType: string,
    public readonly payload: string,
    public status: ScholarshipOutboxStatus,
    public readonly createdAt: Date,
    public publishedAt: Date | null,
  ) {}
}
