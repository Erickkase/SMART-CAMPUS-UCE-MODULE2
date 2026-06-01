import { Injectable } from '@nestjs/common';
import { Scholarship } from '../../../../domain/entities/scholarship.entity';
import { ScholarshipStatus } from '../../../../domain/enums/scholarship-status.enum';
import {
  ScholarshipRepository,
  UpdateScholarshipData,
} from '../../../../domain/repositories/scholarship.repository';

@Injectable()
export class ScholarshipInMemoryRepository implements ScholarshipRepository {
  private readonly scholarships = new Map<string, Scholarship>();

  async create(scholarship: Scholarship): Promise<Scholarship> {
    this.scholarships.set(scholarship.id, scholarship);
    return scholarship;
  }

  async findAll(): Promise<Scholarship[]> {
    return Array.from(this.scholarships.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  async findById(id: string): Promise<Scholarship | null> {
    return this.scholarships.get(id) ?? null;
  }

  async update(
    id: string,
    data: UpdateScholarshipData,
  ): Promise<Scholarship | null> {
    const existing = this.scholarships.get(id);
    if (!existing) {
      return null;
    }

    if (data.studentId !== undefined) {
      (existing as { studentId: string }).studentId = data.studentId;
    }
    if (data.scholarshipType !== undefined) {
      existing.scholarshipType = data.scholarshipType;
    }
    if (data.reason !== undefined) {
      existing.reason = data.reason;
    }
    if (data.status !== undefined) {
      existing.status = data.status;
    }
    existing.updatedAt = new Date();

    this.scholarships.set(id, existing);
    return existing;
  }

  async updateStatus(
    id: string,
    status: ScholarshipStatus,
  ): Promise<Scholarship | null> {
    return this.update(id, { status });
  }

  async delete(id: string): Promise<boolean> {
    return this.scholarships.delete(id);
  }
}
