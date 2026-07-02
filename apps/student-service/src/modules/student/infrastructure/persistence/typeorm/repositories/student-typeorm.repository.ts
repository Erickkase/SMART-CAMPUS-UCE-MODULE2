import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../../../../domain/entities/student.entity';
import {
  StudentRepository,
  UpdateStudentData,
} from '../../../../domain/repositories/student.repository';
import { StudentTypeOrmEntity } from '../entities/student.typeorm-entity';

@Injectable()
export class StudentTypeOrmRepository implements StudentRepository {
  constructor(
    @InjectRepository(StudentTypeOrmEntity)
    private readonly repository: Repository<StudentTypeOrmEntity>,
  ) {}

  async create(student: Student): Promise<Student> {
    const savedEntity = await this.repository.save(this.toPersistence(student));
    return this.toDomain(savedEntity);
  }

  async findAll(): Promise<Student[]> {
    const entities = await this.repository.find({ order: { createdAt: 'DESC' } });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findById(id: string): Promise<Student | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async update(id: string, data: UpdateStudentData): Promise<Student | null> {
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

  private toDomain(entity: StudentTypeOrmEntity): Student {
    return new Student(
      entity.id,
      entity.identification,
      entity.firstName,
      entity.lastName,
      entity.email,
      entity.academicProgram,
      entity.isActive,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  private toPersistence(student: Student): Partial<StudentTypeOrmEntity> {
    return {
      id: student.id,
      identification: student.identification,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      academicProgram: student.academicProgram,
      isActive: student.isActive,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    };
  }
}
