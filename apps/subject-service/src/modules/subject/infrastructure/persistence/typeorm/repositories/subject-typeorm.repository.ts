import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from '../../../../domain/entities/subject.entity';
import {
  SubjectRepository,
  UpdateSubjectData,
} from '../../../../domain/repositories/subject.repository';
import { SubjectTypeOrmEntity } from '../entities/subject.typeorm-entity';

@Injectable()
export class SubjectTypeOrmRepository implements SubjectRepository {
  constructor(
    @InjectRepository(SubjectTypeOrmEntity)
    private readonly repository: Repository<SubjectTypeOrmEntity>,
  ) {}

  async create(subject: Subject): Promise<Subject> {
    const savedEntity = await this.repository.save(this.toPersistence(subject));
    return this.toDomain(savedEntity);
  }

  async findAll(): Promise<Subject[]> {
    const entities = await this.repository.find({ order: { createdAt: 'DESC' } });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findById(id: string): Promise<Subject | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async update(id: string, data: UpdateSubjectData): Promise<Subject | null> {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) {
      return null;
    }

    const savedEntity = await this.repository.save(this.repository.merge(existing, data));
    return this.toDomain(savedEntity);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  private toDomain(entity: SubjectTypeOrmEntity): Subject {
    return new Subject(
      entity.id,
      entity.code,
      entity.name,
      entity.credits,
      entity.academicLevel,
      entity.isActive,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  private toPersistence(subject: Subject): Partial<SubjectTypeOrmEntity> {
    return {
      id: subject.id,
      code: subject.code,
      name: subject.name,
      credits: subject.credits,
      academicLevel: subject.academicLevel,
      isActive: subject.isActive,
      createdAt: subject.createdAt,
      updatedAt: subject.updatedAt,
    };
  }
}
