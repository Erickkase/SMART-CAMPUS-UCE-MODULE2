import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AppointmentRepository,
  UpdateAppointmentData,
} from '../../../../domain/repositories/appointment.repository';
import { Appointment } from '../../../../domain/entities/appointment.entity';
import { AppointmentStatus } from '../../../../domain/enums/appointment-status.enum';
import { AppointmentTypeOrmEntity } from '../entities/appointment.typeorm-entity';

@Injectable()
export class AppointmentTypeOrmRepository implements AppointmentRepository {
  constructor(
    @InjectRepository(AppointmentTypeOrmEntity)
    private readonly repository: Repository<AppointmentTypeOrmEntity>,
  ) {}

  async create(appointment: Appointment): Promise<Appointment> {
    const persistenceEntity = this.toPersistence(appointment);
    const savedEntity = await this.repository.save(persistenceEntity);
    return this.toDomain(savedEntity);
  }

  async findAll(): Promise<Appointment[]> {
    const entities = await this.repository.find({
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findById(id: string): Promise<Appointment | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByStudentId(studentId: string): Promise<Appointment[]> {
    const entities = await this.repository.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async update(
    id: string,
    data: UpdateAppointmentData,
  ): Promise<Appointment | null> {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) {
      return null;
    }

    const merged = this.repository.merge(existing, data);
    const savedEntity = await this.repository.save(merged);
    return this.toDomain(savedEntity);
  }

  async updateStatus(
    id: string,
    status: AppointmentStatus,
  ): Promise<Appointment | null> {
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

  private toDomain(entity: AppointmentTypeOrmEntity): Appointment {
    return new Appointment(
      entity.id,
      entity.studentId,
      entity.psychologistId,
      entity.scheduledAt,
      entity.reason,
      entity.status,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  private toPersistence(
    appointment: Appointment,
  ): Partial<AppointmentTypeOrmEntity> {
    return {
      id: appointment.id,
      studentId: appointment.studentId,
      psychologistId: appointment.psychologistId,
      scheduledAt: appointment.scheduledAt,
      reason: appointment.reason,
      status: appointment.status,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    };
  }
}
