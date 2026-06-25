import { Injectable } from '@nestjs/common';
import { Subject } from '../../../../domain/entities/subject.entity';
import {
  SubjectRepository,
  UpdateSubjectData,
} from '../../../../domain/repositories/subject.repository';

@Injectable()
export class SubjectInMemoryRepository implements SubjectRepository {
  private readonly subjects = new Map<string, Subject>();

  async create(subject: Subject): Promise<Subject> {
    this.subjects.set(subject.id, subject);
    return subject;
  }

  async findAll(): Promise<Subject[]> {
    return Array.from(this.subjects.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  async findById(id: string): Promise<Subject | null> {
    return this.subjects.get(id) ?? null;
  }

  async update(id: string, data: UpdateSubjectData): Promise<Subject | null> {
    const existing = this.subjects.get(id);
    if (!existing) {
      return null;
    }

    if (data.code !== undefined) existing.code = data.code;
    if (data.name !== undefined) existing.name = data.name;
    if (data.credits !== undefined) existing.credits = data.credits;
    if (data.academicLevel !== undefined) existing.academicLevel = data.academicLevel;
    if (data.isActive !== undefined) existing.isActive = data.isActive;
    existing.updatedAt = new Date();

    this.subjects.set(id, existing);
    return existing;
  }

  async delete(id: string): Promise<boolean> {
    return this.subjects.delete(id);
  }
}
