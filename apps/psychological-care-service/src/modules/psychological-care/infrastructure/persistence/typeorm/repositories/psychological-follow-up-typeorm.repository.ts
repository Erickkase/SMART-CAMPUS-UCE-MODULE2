import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PsychologicalFollowUp } from '../../../../domain/entities/psychological-follow-up.entity';
import { RiskLevel } from '../../../../domain/enums/risk-level.enum';
import { PsychologicalFollowUpRepository } from '../../../../domain/repositories/psychological-follow-up.repository';
import { PsychologicalFollowUpTypeOrmEntity } from '../entities/psychological-follow-up.typeorm-entity';

@Injectable()
export class PsychologicalFollowUpTypeOrmRepository implements PsychologicalFollowUpRepository {
  constructor(
    @InjectRepository(PsychologicalFollowUpTypeOrmEntity)
    private readonly repository: Repository<PsychologicalFollowUpTypeOrmEntity>,
  ) {}

  async create(followUp: PsychologicalFollowUp): Promise<PsychologicalFollowUp> {
    const savedEntity = await this.repository.save(this.toPersistence(followUp));
    return this.toDomain(savedEntity);
  }

  async findAll(): Promise<PsychologicalFollowUp[]> {
    const entities = await this.repository.find({ order: { createdAt: 'DESC' } });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findById(id: string): Promise<PsychologicalFollowUp | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByStudentId(studentId: string): Promise<PsychologicalFollowUp[]> {
    const entities = await this.repository.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async updateRiskLevel(id: string, riskLevel: RiskLevel): Promise<PsychologicalFollowUp | null> {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) {
      return null;
    }

    existing.riskLevel = riskLevel;
    const savedEntity = await this.repository.save(existing);
    return this.toDomain(savedEntity);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  private toDomain(entity: PsychologicalFollowUpTypeOrmEntity): PsychologicalFollowUp {
    return new PsychologicalFollowUp(
      entity.id,
      entity.appointmentId,
      entity.studentId,
      entity.observations,
      entity.recommendations,
      entity.riskLevel,
      entity.nextAction,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  private toPersistence(followUp: PsychologicalFollowUp): Partial<PsychologicalFollowUpTypeOrmEntity> {
    return {
      id: followUp.id,
      appointmentId: followUp.appointmentId,
      studentId: followUp.studentId,
      observations: followUp.observations,
      recommendations: followUp.recommendations,
      riskLevel: followUp.riskLevel,
      nextAction: followUp.nextAction,
      createdAt: followUp.createdAt,
      updatedAt: followUp.updatedAt,
    };
  }
}
