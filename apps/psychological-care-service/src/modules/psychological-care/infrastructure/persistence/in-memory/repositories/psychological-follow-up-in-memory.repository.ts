import { Injectable } from '@nestjs/common';
import { PsychologicalFollowUp } from '../../../../domain/entities/psychological-follow-up.entity';
import { RiskLevel } from '../../../../domain/enums/risk-level.enum';
import { PsychologicalFollowUpRepository } from '../../../../domain/repositories/psychological-follow-up.repository';

@Injectable()
export class PsychologicalFollowUpInMemoryRepository implements PsychologicalFollowUpRepository {
  private readonly followUps = new Map<string, PsychologicalFollowUp>();

  async create(followUp: PsychologicalFollowUp): Promise<PsychologicalFollowUp> {
    this.followUps.set(followUp.id, followUp);
    return followUp;
  }

  async findAll(): Promise<PsychologicalFollowUp[]> {
    return this.sortByCreatedAt(Array.from(this.followUps.values()));
  }

  async findById(id: string): Promise<PsychologicalFollowUp | null> {
    return this.followUps.get(id) ?? null;
  }

  async findByStudentId(studentId: string): Promise<PsychologicalFollowUp[]> {
    return this.sortByCreatedAt(
      Array.from(this.followUps.values()).filter((followUp) => followUp.studentId === studentId),
    );
  }

  async updateRiskLevel(id: string, riskLevel: RiskLevel): Promise<PsychologicalFollowUp | null> {
    const existing = this.followUps.get(id);
    if (!existing) {
      return null;
    }

    existing.riskLevel = riskLevel;
    existing.updatedAt = new Date();
    this.followUps.set(id, existing);
    return existing;
  }

  async delete(id: string): Promise<boolean> {
    return this.followUps.delete(id);
  }

  private sortByCreatedAt(followUps: PsychologicalFollowUp[]): PsychologicalFollowUp[] {
    return followUps.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
