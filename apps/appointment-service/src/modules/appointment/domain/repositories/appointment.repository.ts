import { Appointment } from '../entities/appointment.entity';
import { AppointmentStatus } from '../enums/appointment-status.enum';

export const APPOINTMENT_REPOSITORY = 'APPOINTMENT_REPOSITORY';

export interface UpdateAppointmentData {
  psychologistId?: string;
  scheduledAt?: Date;
  reason?: string;
  status?: AppointmentStatus;
}

export interface AppointmentRepository {
  create(appointment: Appointment): Promise<Appointment>;
  findAll(): Promise<Appointment[]>;
  findById(id: string): Promise<Appointment | null>;
  findByStudentId(studentId: string): Promise<Appointment[]>;
  update(id: string, data: UpdateAppointmentData): Promise<Appointment | null>;
  updateStatus(
    id: string,
    status: AppointmentStatus,
  ): Promise<Appointment | null>;
  delete(id: string): Promise<boolean>;
}
