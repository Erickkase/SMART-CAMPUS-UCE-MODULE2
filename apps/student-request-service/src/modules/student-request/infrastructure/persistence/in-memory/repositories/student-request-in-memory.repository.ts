import { Injectable } from '@nestjs/common';
import { StudentRequest } from '../../../../domain/entities/student-request.entity';
import { StudentRequestStatus } from '../../../../domain/enums/student-request-status.enum';
import { StudentRequestRepository, UpdateStudentRequestData } from '../../../../domain/repositories/student-request.repository';

@Injectable()
export class StudentRequestInMemoryRepository implements StudentRequestRepository {
  private readonly requests = new Map<string, StudentRequest>();

  async create(studentRequest: StudentRequest): Promise<StudentRequest> {
    this.requests.set(studentRequest.id, studentRequest);
    return studentRequest;
  }

  async findAll(): Promise<StudentRequest[]> {
    return Array.from(this.requests.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<StudentRequest | null> {
    return this.requests.get(id) ?? null;
  }

  async findByStudentId(studentId: string): Promise<StudentRequest[]> {
    return Array.from(this.requests.values())
      .filter((request) => request.studentId === studentId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async update(id: string, data: UpdateStudentRequestData): Promise<StudentRequest | null> {
    const existing = this.requests.get(id);
    if (!existing) {
      return null;
    }

    if (data.studentId !== undefined) existing.studentId = data.studentId;
    if (data.requestType !== undefined) existing.requestType = data.requestType;
    if (data.title !== undefined) existing.title = data.title;
    if (data.description !== undefined) existing.description = data.description;
    if (data.priority !== undefined) existing.priority = data.priority;
    existing.updatedAt = new Date();

    this.requests.set(id, existing);
    return existing;
  }

  async updateStatus(id: string, status: StudentRequestStatus): Promise<StudentRequest | null> {
    const existing = this.requests.get(id);
    if (!existing) {
      return null;
    }

    existing.status = status;
    existing.updatedAt = new Date();
    this.requests.set(id, existing);
    return existing;
  }

  async delete(id: string): Promise<boolean> {
    return this.requests.delete(id);
  }
}
