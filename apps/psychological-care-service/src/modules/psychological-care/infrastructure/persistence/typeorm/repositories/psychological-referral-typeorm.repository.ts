import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PsychologicalReferral } from '../../../../domain/entities/psychological-referral.entity';
import { RequestStatus } from '../../../../domain/enums/request-status.enum';
import { PsychologicalReferralRepository } from '../../../../domain/repositories/psychological-referral.repository';
import { PsychologicalReferralTypeOrmEntity } from '../entities/psychological-referral.typeorm-entity';

@Injectable()
export class PsychologicalReferralTypeOrmRepository implements PsychologicalReferralRepository {
  constructor(
    @InjectRepository(PsychologicalReferralTypeOrmEntity)
    private readonly repository: Repository<PsychologicalReferralTypeOrmEntity>,
  ) {}

  async create(referral: PsychologicalReferral): Promise<PsychologicalReferral> {
    const savedEntity = await this.repository.save(this.toPersistence(referral));
    return this.toDomain(savedEntity);
  }

  async findAll(): Promise<PsychologicalReferral[]> {
    const entities = await this.repository.find({ order: { createdAt: 'DESC' } });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findById(id: string): Promise<PsychologicalReferral | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByStudentId(studentId: string): Promise<PsychologicalReferral[]> {
    const entities = await this.repository.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async updateStatus(id: string, status: RequestStatus): Promise<PsychologicalReferral | null> {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) {
      return null;
    }

    existing.status = status;
    const savedEntity = await this.repository.save(existing);
    return this.toDomain(savedEntity);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  private toDomain(entity: PsychologicalReferralTypeOrmEntity): PsychologicalReferral {
    return new PsychologicalReferral(
      entity.id,
      entity.studentId,
      entity.referredTo,
      entity.reason,
      entity.status,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  private toPersistence(referral: PsychologicalReferral): Partial<PsychologicalReferralTypeOrmEntity> {
    return {
      id: referral.id,
      studentId: referral.studentId,
      referredTo: referral.referredTo,
      reason: referral.reason,
      status: referral.status,
      createdAt: referral.createdAt,
      updatedAt: referral.updatedAt,
    };
  }
}
