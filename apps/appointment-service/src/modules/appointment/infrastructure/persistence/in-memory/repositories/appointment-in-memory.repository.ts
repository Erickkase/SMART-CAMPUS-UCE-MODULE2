import { Injectable } from '@nestjs/common';
import { Appointment } from '../../../../domain/entities/appointment.entity';
import { AppointmentStatus } from '../../../../domain/enums/appointment-status.enum';
import {
  AppointmentRepository,
  UpdateAppointmentData,
} from '../../../../domain/repositories/appointment.repository';

@Injectable()
export class AppointmentInMemoryRepository implements AppointmentRepository {
  private readonly appointments = new Map<string, Appointment>();

  async create(appointment: Appointment): Promise<Appointment> {
    this.appointments.set(appointment.id, appointment);
    return appointment;
  }

  async findAll(): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  async findById(id: string): Promise<Appointment | null> {
    return this.appointments.get(id) ?? null;
  }

  async findByStudentId(studentId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter((appointment) => appointment.studentId === studentId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async update(
    id: string,
    data: UpdateAppointmentData,
  ): Promise<Appointment | null> {
    const existing = this.appointments.get(id);
    if (!existing) {
      return null;
    }

    if (data.psychologistId !== undefined) {
      (existing as { psychologistId: string }).psychologistId =
        data.psychologistId;
    }
    if (data.scheduledAt !== undefined) {
      (existing as { scheduledAt: Date }).scheduledAt = data.scheduledAt;
    }
    if (data.reason !== undefined) {
      existing.reason = data.reason;
    }
    if (data.status !== undefined) {
      existing.status = data.status;
    }
    existing.updatedAt = new Date();

    this.appointments.set(id, existing);
    return existing;
  }

  async updateStatus(
    id: string,
    status: AppointmentStatus,
  ): Promise<Appointment | null> {
    return this.update(id, { status });
  }

  async delete(id: string): Promise<boolean> {
    return this.appointments.delete(id);
  }
}
