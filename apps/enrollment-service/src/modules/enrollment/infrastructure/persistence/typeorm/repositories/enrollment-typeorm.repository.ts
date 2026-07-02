import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from '../../../../domain/entities/enrollment.entity';
import {
  EnrollmentRepository,
  UpdateEnrollmentData,
} from '../../../../domain/repositories/enrollment.repository';
import { EnrollmentTypeOrmEntity } from '../entities/enrollment.typeorm-entity';

@Injectable()
export class EnrollmentTypeOrmRepository implements EnrollmentRepository {
  constructor(
    @InjectRepository(EnrollmentTypeOrmEntity)
    private readonly repository: Repository<EnrollmentTypeOrmEntity>,
  ) {}

  async create(enrollment: Enrollment): Promise<Enrollment> {
    const savedEntity = await this.repository.save(this.toPersistence(enrollment));
    return this.toDomain(savedEntity);
  }

  async findAll(): Promise<Enrollment[]> {
    const entities = await this.repository.find({ order: { createdAt: 'DESC' } });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findById(id: string): Promise<Enrollment | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByStudentId(studentId: string): Promise<Enrollment[]> {
    const entities = await this.repository.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findBySubjectId(subjectId: string): Promise<Enrollment[]> {
    const entities = await this.repository.find({
      where: { subjectId },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async update(id: string, data: UpdateEnrollmentData): Promise<Enrollment | null> {
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

  private toDomain(entity: EnrollmentTypeOrmEntity): Enrollment {
    return new Enrollment(
      entity.id,
      entity.studentId,
      entity.subjectId,
      entity.academicPeriod,
      entity.status,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  private toPersistence(enrollment: Enrollment): Partial<EnrollmentTypeOrmEntity> {
    return {
      id: enrollment.id,
      studentId: enrollment.studentId,
      subjectId: enrollment.subjectId,
      academicPeriod: enrollment.academicPeriod,
      status: enrollment.status,
      createdAt: enrollment.createdAt,
      updatedAt: enrollment.updatedAt,
    };
  }
}
