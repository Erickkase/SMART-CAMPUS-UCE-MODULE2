import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PsychologicalRequest } from '../../../../domain/entities/psychological-request.entity';
import { RequestStatus } from '../../../../domain/enums/request-status.enum';
import { PsychologicalRequestRepository } from '../../../../domain/repositories/psychological-request.repository';
import { PsychologicalRequestTypeOrmEntity } from '../entities/psychological-request.typeorm-entity';

@Injectable()
export class PsychologicalRequestTypeOrmRepository implements PsychologicalRequestRepository {
  constructor(
    @InjectRepository(PsychologicalRequestTypeOrmEntity)
    private readonly repository: Repository<PsychologicalRequestTypeOrmEntity>,
  ) {}

  async create(request: PsychologicalRequest): Promise<PsychologicalRequest> {
    const savedEntity = await this.repository.save(this.toPersistence(request));
    return this.toDomain(savedEntity);
  }

  async findAll(): Promise<PsychologicalRequest[]> {
    const entities = await this.repository.find({ order: { createdAt: 'DESC' } });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findById(id: string): Promise<PsychologicalRequest | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByStudentId(studentId: string): Promise<PsychologicalRequest[]> {
    const entities = await this.repository.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async updateStatus(id: string, status: RequestStatus): Promise<PsychologicalRequest | null> {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) {
      return null;
    }

    existing.status = status;
    const savedEntity = await this.repository.save(existing);
    return this.toDomain(savedEntity);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  private toDomain(entity: PsychologicalRequestTypeOrmEntity): PsychologicalRequest {
    return new PsychologicalRequest(
      entity.id,
      entity.studentId,
      entity.reason,
      entity.priority,
      entity.status,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  private toPersistence(request: PsychologicalRequest): Partial<PsychologicalRequestTypeOrmEntity> {
    return {
      id: request.id,
      studentId: request.studentId,
      reason: request.reason,
      priority: request.priority,
      status: request.status,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    };
  }
}
