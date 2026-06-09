import { PsychologicalAppointment } from '../entities/psychological-appointment.entity';
import { AppointmentStatus } from '../enums/appointment-status.enum';

export const PSYCHOLOGICAL_APPOINTMENT_REPOSITORY = 'PSYCHOLOGICAL_APPOINTMENT_REPOSITORY';

export interface PsychologicalAppointmentRepository {
  create(appointment: PsychologicalAppointment): Promise<PsychologicalAppointment>;
  findAll(): Promise<PsychologicalAppointment[]>;
  findById(id: string): Promise<PsychologicalAppointment | null>;
  findByStudentId(studentId: string): Promise<PsychologicalAppointment[]>;
  updateStatus(id: string, status: AppointmentStatus): Promise<PsychologicalAppointment | null>;
  delete(id: string): Promise<boolean>;
}
