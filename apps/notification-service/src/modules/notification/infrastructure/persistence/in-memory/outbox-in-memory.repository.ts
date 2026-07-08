import { Injectable } from '@nestjs/common';
import { OutboxEvent } from '../../../domain/entities/outbox-event.entity';
import { OutboxEventStatus } from '../../../domain/enums/outbox-event-status.enum';
import { OutboxRepository } from '../../../domain/repositories/outbox.repository';

@Injectable()
export class OutboxInMemoryRepository implements OutboxRepository {
  private readonly outboxEvents = new Map<string, OutboxEvent>();

  async create(outboxEvent: OutboxEvent): Promise<OutboxEvent> {
    this.outboxEvents.set(outboxEvent.id, outboxEvent);
    return outboxEvent;
  }

  async findPending(limit: number): Promise<OutboxEvent[]> {
    return Array.from(this.outboxEvents.values())
      .filter((event) => event.status === OutboxEventStatus.PENDING)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice(0, limit);
  }

  async markAsProcessed(id: string): Promise<OutboxEvent | null> {
    const existing = this.outboxEvents.get(id);
    if (!existing) {
      return null;
    }

    existing.status = OutboxEventStatus.PROCESSED;
    existing.processedAt = new Date();
    this.outboxEvents.set(id, existing);
    return existing;
  }

  async markAsFailed(id: string, errorMessage: string): Promise<OutboxEvent | null> {
    const existing = this.outboxEvents.get(id);
    if (!existing) {
      return null;
    }

    existing.status = OutboxEventStatus.FAILED;
    existing.retryCount += 1;
    existing.errorMessage = errorMessage;
    existing.processedAt = new Date();
    this.outboxEvents.set(id, existing);
    return existing;
  }
}
