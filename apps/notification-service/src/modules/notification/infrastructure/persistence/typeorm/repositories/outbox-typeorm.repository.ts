import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutboxEvent } from '../../../../domain/entities/outbox-event.entity';
import { OutboxEventStatus } from '../../../../domain/enums/outbox-event-status.enum';
import { OutboxRepository } from '../../../../domain/repositories/outbox.repository';
import { OutboxEventTypeOrmEntity } from '../entities/outbox-event.typeorm-entity';

@Injectable()
export class OutboxTypeOrmRepository implements OutboxRepository {
  constructor(
    @InjectRepository(OutboxEventTypeOrmEntity)
    private readonly repository: Repository<OutboxEventTypeOrmEntity>,
  ) {}

  async create(outboxEvent: OutboxEvent): Promise<OutboxEvent> {
    const savedEntity = await this.repository.save(this.toPersistence(outboxEvent));
    return this.toDomain(savedEntity);
  }

  async findPending(limit: number): Promise<OutboxEvent[]> {
    const entities = await this.repository.find({
      where: { status: OutboxEventStatus.PENDING },
      order: { createdAt: 'ASC' },
      take: limit,
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async markAsProcessed(id: string): Promise<OutboxEvent | null> {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) {
      return null;
    }

    existing.status = OutboxEventStatus.PROCESSED;
    existing.processedAt = new Date();
    const savedEntity = await this.repository.save(existing);
    return this.toDomain(savedEntity);
  }

  async markAsFailed(id: string, errorMessage: string): Promise<OutboxEvent | null> {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) {
      return null;
    }

    existing.status = OutboxEventStatus.FAILED;
    existing.retryCount += 1;
    existing.errorMessage = errorMessage;
    existing.processedAt = new Date();
    const savedEntity = await this.repository.save(existing);
    return this.toDomain(savedEntity);
  }

  private toDomain(entity: OutboxEventTypeOrmEntity): OutboxEvent {
    return new OutboxEvent(
      entity.id,
      entity.aggregateType,
      entity.aggregateId,
      entity.eventType,
      entity.payload,
      entity.status,
      entity.retryCount,
      entity.errorMessage,
      entity.createdAt,
      entity.processedAt,
    );
  }

  private toPersistence(outboxEvent: OutboxEvent): Partial<OutboxEventTypeOrmEntity> {
    return {
      id: outboxEvent.id,
      aggregateType: outboxEvent.aggregateType,
      aggregateId: outboxEvent.aggregateId,
      eventType: outboxEvent.eventType,
      payload: outboxEvent.payload,
      status: outboxEvent.status,
      retryCount: outboxEvent.retryCount,
      errorMessage: outboxEvent.errorMessage,
      createdAt: outboxEvent.createdAt,
      processedAt: outboxEvent.processedAt,
    };
  }
}
