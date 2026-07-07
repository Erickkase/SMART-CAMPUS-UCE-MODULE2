import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateAppointmentDto } from '../dtos/create-appointment.dto';
import { UpdateAppointmentDto } from '../dtos/update-appointment.dto';
import { UpdateAppointmentStatusDto } from '../dtos/update-appointment-status.dto';
import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentStatus } from '../../domain/enums/appointment-status.enum';
import {
  APPOINTMENT_REPOSITORY,
  AppointmentRepository,
  UpdateAppointmentData,
} from '../../domain/repositories/appointment.repository';
import { StudentServiceClient } from '../../infrastructure/clients/student-service.client';

@Injectable()
export class AppointmentService {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: AppointmentRepository,
    private readonly studentServiceClient: StudentServiceClient,
  ) {}

  async createAppointment(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    await this.studentServiceClient.validateStudentExists(
      createAppointmentDto.studentId,
    );

    const now = new Date();
    const scheduledAt = new Date(createAppointmentDto.scheduledAt);

    if (Number.isNaN(scheduledAt.getTime())) {
      throw new BadRequestException('Invalid scheduledAt date');
    }

    if (scheduledAt.getTime() <= now.getTime()) {
      throw new BadRequestException(
        'Appointment must be scheduled in the future',
      );
    }

    const appointment = new Appointment(
      randomUUID(),
      createAppointmentDto.studentId,
      createAppointmentDto.psychologistId,
      scheduledAt,
      createAppointmentDto.reason,
      AppointmentStatus.PENDING,
      now,
      now,
    );

    return this.appointmentRepository.create(appointment);
  }

  async getAppointments(): Promise<Appointment[]> {
    return this.appointmentRepository.findAll();
  }

  async getAppointmentsByStudentId(studentId: string): Promise<Appointment[]> {
    return this.appointmentRepository.findByStudentId(studentId);
  }

  async getAppointmentById(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(id);

    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} was not found`);
    }

    return appointment;
  }

  async updateAppointment(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.getAppointmentById(id);

    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException(
        'Cannot update a completed appointment',
      );
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException(
        'Cannot update a cancelled appointment',
      );
    }

    const updateData: UpdateAppointmentData = {
      psychologistId: updateAppointmentDto.psychologistId,
      reason: updateAppointmentDto.reason,
    };

    if (updateAppointmentDto.scheduledAt !== undefined) {
      const scheduledAt = new Date(updateAppointmentDto.scheduledAt);

      if (Number.isNaN(scheduledAt.getTime())) {
        throw new BadRequestException('Invalid scheduledAt date');
      }

      updateData.scheduledAt = scheduledAt;
    }

    const updatedAppointment = await this.appointmentRepository.update(
      id,
      updateData,
    );

    if (!updatedAppointment) {
      throw new NotFoundException(`Appointment with id ${id} was not found`);
    }

    return updatedAppointment;
  }

  async updateAppointmentStatus(
    id: string,
    updateAppointmentStatusDto: UpdateAppointmentStatusDto,
  ): Promise<Appointment> {
    const appointment = await this.getAppointmentById(id);
    const { status } = updateAppointmentStatusDto;

    const allowedTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
      [AppointmentStatus.PENDING]: [
        AppointmentStatus.CONFIRMED,
        AppointmentStatus.CANCELLED,
      ],
      [AppointmentStatus.CONFIRMED]: [
        AppointmentStatus.CANCELLED,
        AppointmentStatus.COMPLETED,
      ],
      [AppointmentStatus.CANCELLED]: [],
      [AppointmentStatus.COMPLETED]: [],
    };

    if (!allowedTransitions[appointment.status].includes(status)) {
      throw new BadRequestException(
        `Cannot transition appointment from ${appointment.status} to ${status}`,
      );
    }

    const updatedAppointment = await this.appointmentRepository.updateStatus(
      id,
      status,
    );

    if (!updatedAppointment) {
      throw new NotFoundException(`Appointment with id ${id} was not found`);
    }

    return updatedAppointment;
  }

  async deleteAppointment(id: string): Promise<void> {
    await this.getAppointmentById(id);

    const deleted = await this.appointmentRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Appointment with id ${id} was not found`);
    }
  }
}
