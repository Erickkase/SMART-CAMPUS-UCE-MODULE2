import { AppointmentStatus } from '../enums/appointment-status.enum';

export class Appointment {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly psychologistId: string,
    public scheduledAt: Date,
    public reason: string,
    public status: AppointmentStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}
}
