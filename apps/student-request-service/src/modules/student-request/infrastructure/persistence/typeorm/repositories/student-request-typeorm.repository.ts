import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentRequest } from '../../../../domain/entities/student-request.entity';
import { StudentRequestStatus } from '../../../../domain/enums/student-request-status.enum';
import { StudentRequestRepository, UpdateStudentRequestData } from '../../../../domain/repositories/student-request.repository';
import { StudentRequestTypeOrmEntity } from '../entities/student-request.typeorm-entity';

@Injectable()
export class StudentRequestTypeOrmRepository implements StudentRequestRepository {
  constructor(
    @InjectRepository(StudentRequestTypeOrmEntity)
    private readonly repository: Repository<StudentRequestTypeOrmEntity>,
  ) {}

  async create(studentRequest: StudentRequest): Promise<StudentRequest> {
    const saved = await this.repository.save(this.toPersistence(studentRequest));
    return this.toDomain(saved);
  }

  async findAll(): Promise<StudentRequest[]> {
    const entities = await this.repository.find({ order: { createdAt: 'DESC' } });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findById(id: string): Promise<StudentRequest | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByStudentId(studentId: string): Promise<StudentRequest[]> {
    const entities = await this.repository.find({ where: { studentId }, order: { createdAt: 'DESC' } });
    return entities.map((entity) => this.toDomain(entity));
  }

  async update(id: string, data: UpdateStudentRequestData): Promise<StudentRequest | null> {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) {
      return null;
    }

    const merged = this.repository.merge(existing, data);
    const saved = await this.repository.save(merged);
    return this.toDomain(saved);
  }

  async updateStatus(id: string, status: StudentRequestStatus): Promise<StudentRequest | null> {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) {
      return null;
    }

    existing.status = status;
    const saved = await this.repository.save(existing);
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  private toDomain(entity: StudentRequestTypeOrmEntity): StudentRequest {
    return new StudentRequest(
      entity.id,
      entity.studentId,
      entity.requestType,
      entity.title,
      entity.description,
      entity.priority,
      entity.status,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  private toPersistence(studentRequest: StudentRequest): Partial<StudentRequestTypeOrmEntity> {
    return {
      id: studentRequest.id,
      studentId: studentRequest.studentId,
      requestType: studentRequest.requestType,
      title: studentRequest.title,
      description: studentRequest.description,
      priority: studentRequest.priority,
      status: studentRequest.status,
      createdAt: studentRequest.createdAt,
      updatedAt: studentRequest.updatedAt,
    };
  }
}
