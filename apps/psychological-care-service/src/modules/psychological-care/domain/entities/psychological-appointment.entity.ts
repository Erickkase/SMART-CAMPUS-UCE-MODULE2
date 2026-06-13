import { AppointmentStatus } from '../enums/appointment-status.enum';
import { CareModality } from '../enums/care-modality.enum';

export class PsychologicalAppointment {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly psychologistId: string,
    public appointmentDate: Date,
    public modality: CareModality,
    public status: AppointmentStatus,
    public notes: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}
}
