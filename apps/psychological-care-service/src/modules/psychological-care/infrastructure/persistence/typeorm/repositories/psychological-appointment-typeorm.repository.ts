import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PsychologicalAppointment } from '../../../../domain/entities/psychological-appointment.entity';
import { AppointmentStatus } from '../../../../domain/enums/appointment-status.enum';
import { PsychologicalAppointmentRepository } from '../../../../domain/repositories/psychological-appointment.repository';
import { PsychologicalAppointmentTypeOrmEntity } from '../entities/psychological-appointment.typeorm-entity';

@Injectable()
export class PsychologicalAppointmentTypeOrmRepository implements PsychologicalAppointmentRepository {
  constructor(
    @InjectRepository(PsychologicalAppointmentTypeOrmEntity)
    private readonly repository: Repository<PsychologicalAppointmentTypeOrmEntity>,
  ) {}

  async create(appointment: PsychologicalAppointment): Promise<PsychologicalAppointment> {
    const savedEntity = await this.repository.save(this.toPersistence(appointment));
    return this.toDomain(savedEntity);
  }

  async findAll(): Promise<PsychologicalAppointment[]> {
    const entities = await this.repository.find({ order: { createdAt: 'DESC' } });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findById(id: string): Promise<PsychologicalAppointment | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByStudentId(studentId: string): Promise<PsychologicalAppointment[]> {
    const entities = await this.repository.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async updateStatus(
    id: string,
    status: AppointmentStatus,
  ): Promise<PsychologicalAppointment | null> {
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

  private toDomain(entity: PsychologicalAppointmentTypeOrmEntity): PsychologicalAppointment {
    return new PsychologicalAppointment(
      entity.id,
      entity.studentId,
      entity.psychologistId,
      entity.appointmentDate,
      entity.modality,
      entity.status,
      entity.notes ?? '',
      entity.createdAt,
      entity.updatedAt,
    );
  }

  private toPersistence(
    appointment: PsychologicalAppointment,
  ): Partial<PsychologicalAppointmentTypeOrmEntity> {
    return {
      id: appointment.id,
      studentId: appointment.studentId,
      psychologistId: appointment.psychologistId,
      appointmentDate: appointment.appointmentDate,
      modality: appointment.modality,
      status: appointment.status,
      notes: appointment.notes,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    };
  }
}
