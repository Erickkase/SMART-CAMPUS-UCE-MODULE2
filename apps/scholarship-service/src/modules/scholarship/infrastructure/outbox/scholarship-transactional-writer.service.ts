import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Scholarship } from '../../domain/entities/scholarship.entity';
import { ScholarshipOutboxEvent } from '../../domain/entities/scholarship-outbox-event.entity';
import { ScholarshipStatus } from '../../domain/enums/scholarship-status.enum';
import {
  SCHOLARSHIP_OUTBOX_REPOSITORY,
  ScholarshipOutboxRepository,
} from '../../domain/repositories/scholarship-outbox.repository';
import {
  SCHOLARSHIP_REPOSITORY,
  ScholarshipRepository,
} from '../../domain/repositories/scholarship.repository';
import { ScholarshipOutboxTypeOrmEntity } from '../persistence/typeorm/entities/scholarship-outbox.typeorm-entity';
import { ScholarshipTypeOrmEntity } from '../persistence/typeorm/entities/scholarship.typeorm-entity';

@Injectable()
export class ScholarshipTransactionalWriterService {
  private readonly dbEnabled: boolean;

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    @Inject(SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: ScholarshipRepository,
    @Inject(SCHOLARSHIP_OUTBOX_REPOSITORY)
    private readonly scholarshipOutboxRepository: ScholarshipOutboxRepository,
  ) {
    this.dbEnabled = this.configService.get<boolean>('databaseEnabled') ?? false;
  }

  async createScholarshipWithEvent(
    scholarship: Scholarship,
    outboxEvent: ScholarshipOutboxEvent,
  ): Promise<Scholarship> {
    if (!this.dbEnabled) {
      const createdScholarship = await this.scholarshipRepository.create(scholarship);
      await this.scholarshipOutboxRepository.create(outboxEvent);
      return createdScholarship;
    }

    return this.dataSource.transaction(async (manager) => {
      const scholarshipRepository = manager.getRepository(ScholarshipTypeOrmEntity);
      const outboxRepository = manager.getRepository(ScholarshipOutboxTypeOrmEntity);

      const savedScholarship = await scholarshipRepository.save({
        id: scholarship.id,
        studentId: scholarship.studentId,
        scholarshipType: scholarship.scholarshipType,
        reason: scholarship.reason,
        status: scholarship.status,
        createdAt: scholarship.createdAt,
        updatedAt: scholarship.updatedAt,
      });

      await outboxRepository.save({
        id: outboxEvent.id,
        aggregateId: outboxEvent.aggregateId,
        eventType: outboxEvent.eventType,
        payload: outboxEvent.payload,
        status: outboxEvent.status,
        createdAt: outboxEvent.createdAt,
        publishedAt: outboxEvent.publishedAt,
      });

      return this.toDomain(savedScholarship);
    });
  }

  async updateScholarshipStatusWithEvent(
    id: string,
    status: ScholarshipStatus,
    outboxEvent: ScholarshipOutboxEvent,
  ): Promise<Scholarship> {
    if (!this.dbEnabled) {
      const updatedScholarship = await this.scholarshipRepository.updateStatus(id, status);

      if (!updatedScholarship) {
        throw new NotFoundException(`Scholarship with id ${id} was not found`);
      }

      await this.scholarshipOutboxRepository.create(outboxEvent);
      return updatedScholarship;
    }

    return this.dataSource.transaction(async (manager) => {
      const scholarshipRepository = manager.getRepository(ScholarshipTypeOrmEntity);
      const outboxRepository = manager.getRepository(ScholarshipOutboxTypeOrmEntity);
      const scholarshipEntity = await scholarshipRepository.findOne({ where: { id } });

      if (!scholarshipEntity) {
        throw new NotFoundException(`Scholarship with id ${id} was not found`);
      }

      scholarshipEntity.status = status;
      const savedScholarship = await scholarshipRepository.save(scholarshipEntity);

      await outboxRepository.save({
        id: outboxEvent.id,
        aggregateId: outboxEvent.aggregateId,
        eventType: outboxEvent.eventType,
        payload: outboxEvent.payload,
        status: outboxEvent.status,
        createdAt: outboxEvent.createdAt,
        publishedAt: outboxEvent.publishedAt,
      });

      return this.toDomain(savedScholarship);
    });
  }

  private toDomain(entity: ScholarshipTypeOrmEntity): Scholarship {
    return new Scholarship(
      entity.id,
      entity.studentId,
      entity.scholarshipType,
      entity.reason,
      entity.status,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
