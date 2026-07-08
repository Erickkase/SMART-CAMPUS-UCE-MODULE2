import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScholarshipOutboxEvent } from '../../../../domain/entities/scholarship-outbox-event.entity';
import { ScholarshipOutboxStatus } from '../../../../domain/enums/scholarship-outbox-status.enum';
import {
  ScholarshipOutboxRepository,
} from '../../../../domain/repositories/scholarship-outbox.repository';
import { ScholarshipOutboxTypeOrmEntity } from '../entities/scholarship-outbox.typeorm-entity';

@Injectable()
export class ScholarshipOutboxTypeOrmRepository
  implements ScholarshipOutboxRepository
{
  constructor(
    @InjectRepository(ScholarshipOutboxTypeOrmEntity)
    private readonly repository: Repository<ScholarshipOutboxTypeOrmEntity>,
  ) {}

  async create(event: ScholarshipOutboxEvent): Promise<ScholarshipOutboxEvent> {
    const saved = await this.repository.save({
      id: event.id,
      aggregateId: event.aggregateId,
      eventType: event.eventType,
      payload: event.payload,
      status: event.status,
      createdAt: event.createdAt,
      publishedAt: event.publishedAt,
    });

    return this.toDomain(saved);
  }

  async findPending(): Promise<ScholarshipOutboxEvent[]> {
    const entities = await this.repository.find({
      where: { status: ScholarshipOutboxStatus.PENDING },
      order: { createdAt: 'ASC' },
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  async markPublished(id: string, publishedAt: Date): Promise<void> {
    await this.repository.update(id, {
      status: ScholarshipOutboxStatus.PUBLISHED,
      publishedAt,
    });
  }

  private toDomain(entity: ScholarshipOutboxTypeOrmEntity): ScholarshipOutboxEvent {
    return new ScholarshipOutboxEvent(
      entity.id,
      entity.aggregateId,
      entity.eventType,
      entity.payload,
      entity.status,
      entity.createdAt,
      entity.publishedAt,
    );
  }
}
