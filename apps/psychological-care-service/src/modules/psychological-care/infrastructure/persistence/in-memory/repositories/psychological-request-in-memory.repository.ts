import { Injectable } from '@nestjs/common';
import { PsychologicalRequest } from '../../../../domain/entities/psychological-request.entity';
import { RequestStatus } from '../../../../domain/enums/request-status.enum';
import { PsychologicalRequestRepository } from '../../../../domain/repositories/psychological-request.repository';

@Injectable()
export class PsychologicalRequestInMemoryRepository implements PsychologicalRequestRepository {
  private readonly requests = new Map<string, PsychologicalRequest>();

  async create(request: PsychologicalRequest): Promise<PsychologicalRequest> {
    this.requests.set(request.id, request);
    return request;
  }

  async findAll(): Promise<PsychologicalRequest[]> {
    return this.sortByCreatedAt(Array.from(this.requests.values()));
  }

  async findById(id: string): Promise<PsychologicalRequest | null> {
    return this.requests.get(id) ?? null;
  }

  async findByStudentId(studentId: string): Promise<PsychologicalRequest[]> {
    return this.sortByCreatedAt(
      Array.from(this.requests.values()).filter((request) => request.studentId === studentId),
    );
  }

  async updateStatus(id: string, status: RequestStatus): Promise<PsychologicalRequest | null> {
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

  private sortByCreatedAt(requests: PsychologicalRequest[]): PsychologicalRequest[] {
    return requests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
