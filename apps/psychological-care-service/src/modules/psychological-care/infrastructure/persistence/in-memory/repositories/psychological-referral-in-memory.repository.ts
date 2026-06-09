import { Injectable } from '@nestjs/common';
import { PsychologicalReferral } from '../../../../domain/entities/psychological-referral.entity';
import { RequestStatus } from '../../../../domain/enums/request-status.enum';
import { PsychologicalReferralRepository } from '../../../../domain/repositories/psychological-referral.repository';

@Injectable()
export class PsychologicalReferralInMemoryRepository implements PsychologicalReferralRepository {
  private readonly referrals = new Map<string, PsychologicalReferral>();

  async create(referral: PsychologicalReferral): Promise<PsychologicalReferral> {
    this.referrals.set(referral.id, referral);
    return referral;
  }

  async findAll(): Promise<PsychologicalReferral[]> {
    return this.sortByCreatedAt(Array.from(this.referrals.values()));
  }

  async findById(id: string): Promise<PsychologicalReferral | null> {
    return this.referrals.get(id) ?? null;
  }

  async findByStudentId(studentId: string): Promise<PsychologicalReferral[]> {
    return this.sortByCreatedAt(
      Array.from(this.referrals.values()).filter((referral) => referral.studentId === studentId),
    );
  }

  async updateStatus(id: string, status: RequestStatus): Promise<PsychologicalReferral | null> {
    const existing = this.referrals.get(id);
    if (!existing) {
      return null;
    }

    existing.status = status;
    existing.updatedAt = new Date();
    this.referrals.set(id, existing);
    return existing;
  }

  async delete(id: string): Promise<boolean> {
    return this.referrals.delete(id);
  }

  private sortByCreatedAt(referrals: PsychologicalReferral[]): PsychologicalReferral[] {
    return referrals.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
