import { Injectable } from '@nestjs/common';
import { ScholarshipOutboxEvent } from '../../../../domain/entities/scholarship-outbox-event.entity';
import { ScholarshipOutboxStatus } from '../../../../domain/enums/scholarship-outbox-status.enum';
import { ScholarshipOutboxRepository } from '../../../../domain/repositories/scholarship-outbox.repository';

@Injectable()
export class ScholarshipOutboxInMemoryRepository
  implements ScholarshipOutboxRepository
{
  private readonly events = new Map<string, ScholarshipOutboxEvent>();

  async create(event: ScholarshipOutboxEvent): Promise<ScholarshipOutboxEvent> {
    this.events.set(event.id, event);
    return event;
  }

  async findPending(): Promise<ScholarshipOutboxEvent[]> {
    return Array.from(this.events.values())
      .filter((event) => event.status === ScholarshipOutboxStatus.PENDING)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async markPublished(id: string, publishedAt: Date): Promise<void> {
    const event = this.events.get(id);

    if (!event) {
      return;
    }

    event.status = ScholarshipOutboxStatus.PUBLISHED;
    event.publishedAt = publishedAt;
    this.events.set(id, event);
  }
}
