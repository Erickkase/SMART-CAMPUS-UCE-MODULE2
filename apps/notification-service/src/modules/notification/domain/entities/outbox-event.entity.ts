import { OutboxEventStatus } from '../enums/outbox-event-status.enum';

export class OutboxEvent {
  constructor(
    public readonly id: string,
    public aggregateType: string,
    public aggregateId: string,
    public eventType: string,
    public payload: Record<string, unknown>,
    public status: OutboxEventStatus,
    public retryCount: number,
    public errorMessage: string | null,
    public readonly createdAt: Date,
    public processedAt: Date | null,
  ) {}
}
