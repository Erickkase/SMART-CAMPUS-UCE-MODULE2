import { OutboxEvent } from '../entities/outbox-event.entity';

export const OUTBOX_REPOSITORY = 'OUTBOX_REPOSITORY';

export interface OutboxRepository {
  create(outboxEvent: OutboxEvent): Promise<OutboxEvent>;
  findPending(limit: number): Promise<OutboxEvent[]>;
  markAsProcessed(id: string): Promise<OutboxEvent | null>;
  markAsFailed(id: string, errorMessage: string): Promise<OutboxEvent | null>;
}
