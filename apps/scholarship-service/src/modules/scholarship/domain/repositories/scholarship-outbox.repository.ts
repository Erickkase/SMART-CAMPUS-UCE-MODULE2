import { ScholarshipOutboxEvent } from '../entities/scholarship-outbox-event.entity';

export const SCHOLARSHIP_OUTBOX_REPOSITORY = 'SCHOLARSHIP_OUTBOX_REPOSITORY';

export interface ScholarshipOutboxRepository {
  create(event: ScholarshipOutboxEvent): Promise<ScholarshipOutboxEvent>;
  findPending(): Promise<ScholarshipOutboxEvent[]>;
  markPublished(id: string, publishedAt: Date): Promise<void>;
}
