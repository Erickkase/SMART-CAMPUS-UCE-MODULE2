import { Injectable } from '@nestjs/common';
import { PsychologicalAppointment } from '../../../../domain/entities/psychological-appointment.entity';
import { AppointmentStatus } from '../../../../domain/enums/appointment-status.enum';
import { PsychologicalAppointmentRepository } from '../../../../domain/repositories/psychological-appointment.repository';

@Injectable()
export class PsychologicalAppointmentInMemoryRepository implements PsychologicalAppointmentRepository {
  private readonly appointments = new Map<string, PsychologicalAppointment>();

  async create(appointment: PsychologicalAppointment): Promise<PsychologicalAppointment> {
    this.appointments.set(appointment.id, appointment);
    return appointment;
  }

  async findAll(): Promise<PsychologicalAppointment[]> {
    return this.sortByCreatedAt(Array.from(this.appointments.values()));
  }

  async findById(id: string): Promise<PsychologicalAppointment | null> {
    return this.appointments.get(id) ?? null;
  }

  async findByStudentId(studentId: string): Promise<PsychologicalAppointment[]> {
    return this.sortByCreatedAt(
      Array.from(this.appointments.values()).filter(
        (appointment) => appointment.studentId === studentId,
      ),
    );
  }

  async updateStatus(
    id: string,
    status: AppointmentStatus,
  ): Promise<PsychologicalAppointment | null> {
    const existing = this.appointments.get(id);
    if (!existing) {
      return null;
    }

    existing.status = status;
    existing.updatedAt = new Date();
    this.appointments.set(id, existing);
    return existing;
  }

  async delete(id: string): Promise<boolean> {
    return this.appointments.delete(id);
  }

  private sortByCreatedAt(appointments: PsychologicalAppointment[]): PsychologicalAppointment[] {
    return appointments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
