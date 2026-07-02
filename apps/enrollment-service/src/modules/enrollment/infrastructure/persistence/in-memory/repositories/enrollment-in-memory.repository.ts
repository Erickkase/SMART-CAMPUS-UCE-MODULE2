import { Injectable } from '@nestjs/common';
import { Enrollment } from '../../../../domain/entities/enrollment.entity';
import {
  EnrollmentRepository,
  UpdateEnrollmentData,
} from '../../../../domain/repositories/enrollment.repository';

@Injectable()
export class EnrollmentInMemoryRepository implements EnrollmentRepository {
  private readonly enrollments = new Map<string, Enrollment>();

  async create(enrollment: Enrollment): Promise<Enrollment> {
    this.enrollments.set(enrollment.id, enrollment);
    return enrollment;
  }

  async findAll(): Promise<Enrollment[]> {
    return this.sortByCreatedAt(Array.from(this.enrollments.values()));
  }

  async findById(id: string): Promise<Enrollment | null> {
    return this.enrollments.get(id) ?? null;
  }

  async findByStudentId(studentId: string): Promise<Enrollment[]> {
    return this.sortByCreatedAt(
      Array.from(this.enrollments.values()).filter(
        (enrollment) => enrollment.studentId === studentId,
      ),
    );
  }

  async findBySubjectId(subjectId: string): Promise<Enrollment[]> {
    return this.sortByCreatedAt(
      Array.from(this.enrollments.values()).filter(
        (enrollment) => enrollment.subjectId === subjectId,
      ),
    );
  }

  async update(id: string, data: UpdateEnrollmentData): Promise<Enrollment | null> {
    const existing = this.enrollments.get(id);
    if (!existing) {
      return null;
    }

    if (data.academicPeriod !== undefined) existing.academicPeriod = data.academicPeriod;
    if (data.status !== undefined) existing.status = data.status;
    existing.updatedAt = new Date();

    this.enrollments.set(id, existing);
    return existing;
  }

  async delete(id: string): Promise<boolean> {
    return this.enrollments.delete(id);
  }

  private sortByCreatedAt(enrollments: Enrollment[]): Enrollment[] {
    return enrollments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
