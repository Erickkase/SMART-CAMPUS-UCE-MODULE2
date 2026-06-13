import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreatePsychologicalAppointmentDto } from '../dtos/create-psychological-appointment.dto';
import { CreatePsychologicalFollowUpDto } from '../dtos/create-psychological-follow-up.dto';
import { CreatePsychologicalReferralDto } from '../dtos/create-psychological-referral.dto';
import { CreatePsychologicalRequestDto } from '../dtos/create-psychological-request.dto';
import { UpdatePsychologicalAppointmentStatusDto } from '../dtos/update-psychological-appointment-status.dto';
import { UpdatePsychologicalReferralStatusDto } from '../dtos/update-psychological-referral-status.dto';
import { UpdatePsychologicalRequestStatusDto } from '../dtos/update-psychological-request-status.dto';
import { PsychologicalAppointment } from '../../domain/entities/psychological-appointment.entity';
import { PsychologicalFollowUp } from '../../domain/entities/psychological-follow-up.entity';
import { PsychologicalReferral } from '../../domain/entities/psychological-referral.entity';
import { PsychologicalRequest } from '../../domain/entities/psychological-request.entity';
import { AppointmentStatus } from '../../domain/enums/appointment-status.enum';
import { RequestStatus } from '../../domain/enums/request-status.enum';
import {
  PSYCHOLOGICAL_APPOINTMENT_REPOSITORY,
  PsychologicalAppointmentRepository,
} from '../../domain/repositories/psychological-appointment.repository';
import {
  PSYCHOLOGICAL_FOLLOW_UP_REPOSITORY,
  PsychologicalFollowUpRepository,
} from '../../domain/repositories/psychological-follow-up.repository';
import {
  PSYCHOLOGICAL_REFERRAL_REPOSITORY,
  PsychologicalReferralRepository,
} from '../../domain/repositories/psychological-referral.repository';
import {
  PSYCHOLOGICAL_REQUEST_REPOSITORY,
  PsychologicalRequestRepository,
} from '../../domain/repositories/psychological-request.repository';

@Injectable()
export class PsychologicalCareService {
  constructor(
    @Inject(PSYCHOLOGICAL_REQUEST_REPOSITORY)
    private readonly requestRepository: PsychologicalRequestRepository,
    @Inject(PSYCHOLOGICAL_APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: PsychologicalAppointmentRepository,
    @Inject(PSYCHOLOGICAL_FOLLOW_UP_REPOSITORY)
    private readonly followUpRepository: PsychologicalFollowUpRepository,
    @Inject(PSYCHOLOGICAL_REFERRAL_REPOSITORY)
    private readonly referralRepository: PsychologicalReferralRepository,
  ) {}

  async createRequest(
    createRequestDto: CreatePsychologicalRequestDto,
  ): Promise<PsychologicalRequest> {
    const now = new Date();
    const request = new PsychologicalRequest(
      randomUUID(),
      createRequestDto.studentId,
      createRequestDto.reason,
      createRequestDto.priority,
      RequestStatus.REQUESTED,
      now,
      now,
    );

    return this.requestRepository.create(request);
  }

  async getRequests(): Promise<PsychologicalRequest[]> {
    return this.requestRepository.findAll();
  }

  async getRequestById(id: string): Promise<PsychologicalRequest> {
    const request = await this.requestRepository.findById(id);

    if (!request) {
      throw new NotFoundException(`Psychological request with id ${id} was not found`);
    }

    return request;
  }

  async updateRequestStatus(
    id: string,
    updateRequestStatusDto: UpdatePsychologicalRequestStatusDto,
  ): Promise<PsychologicalRequest> {
    await this.getRequestById(id);

    const updatedRequest = await this.requestRepository.updateStatus(
      id,
      updateRequestStatusDto.status,
    );

    if (!updatedRequest) {
      throw new NotFoundException(`Psychological request with id ${id} was not found`);
    }

    return updatedRequest;
  }

  async deleteRequest(id: string): Promise<void> {
    await this.getRequestById(id);

    const deleted = await this.requestRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Psychological request with id ${id} was not found`);
    }
  }

  async createAppointment(
    createAppointmentDto: CreatePsychologicalAppointmentDto,
  ): Promise<PsychologicalAppointment> {
    const now = new Date();
    const appointment = new PsychologicalAppointment(
      randomUUID(),
      createAppointmentDto.studentId,
      createAppointmentDto.psychologistId,
      new Date(createAppointmentDto.appointmentDate),
      createAppointmentDto.modality,
      AppointmentStatus.SCHEDULED,
      createAppointmentDto.notes,
      now,
      now,
    );

    return this.appointmentRepository.create(appointment);
  }

  async getAppointments(): Promise<PsychologicalAppointment[]> {
    return this.appointmentRepository.findAll();
  }

  async getAppointmentsByStudentId(studentId: string): Promise<PsychologicalAppointment[]> {
    const appointments = await this.appointmentRepository.findByStudentId(studentId);

    if (appointments.length === 0) {
      throw new NotFoundException(
        `Psychological appointments for student ${studentId} were not found`,
      );
    }

    return appointments;
  }

  async updateAppointmentStatus(
    id: string,
    updateAppointmentStatusDto: UpdatePsychologicalAppointmentStatusDto,
  ): Promise<PsychologicalAppointment> {
    await this.getAppointmentById(id);

    const updatedAppointment = await this.appointmentRepository.updateStatus(
      id,
      updateAppointmentStatusDto.status,
    );

    if (!updatedAppointment) {
      throw new NotFoundException(`Psychological appointment with id ${id} was not found`);
    }

    return updatedAppointment;
  }

  async createFollowUp(
    createFollowUpDto: CreatePsychologicalFollowUpDto,
  ): Promise<PsychologicalFollowUp> {
    await this.getAppointmentById(createFollowUpDto.appointmentId);

    const now = new Date();
    const followUp = new PsychologicalFollowUp(
      randomUUID(),
      createFollowUpDto.appointmentId,
      createFollowUpDto.studentId,
      createFollowUpDto.observations,
      createFollowUpDto.recommendations,
      createFollowUpDto.riskLevel,
      createFollowUpDto.nextAction,
      now,
      now,
    );

    return this.followUpRepository.create(followUp);
  }

  async getFollowUpsByStudentId(studentId: string): Promise<PsychologicalFollowUp[]> {
    const followUps = await this.followUpRepository.findByStudentId(studentId);

    if (followUps.length === 0) {
      throw new NotFoundException(
        `Psychological follow-ups for student ${studentId} were not found`,
      );
    }

    return followUps;
  }

  async createReferral(
    createReferralDto: CreatePsychologicalReferralDto,
  ): Promise<PsychologicalReferral> {
    const now = new Date();
    const referral = new PsychologicalReferral(
      randomUUID(),
      createReferralDto.studentId,
      createReferralDto.referredTo,
      createReferralDto.reason,
      RequestStatus.REFERRED,
      now,
      now,
    );

    return this.referralRepository.create(referral);
  }

  async getReferralsByStudentId(studentId: string): Promise<PsychologicalReferral[]> {
    const referrals = await this.referralRepository.findByStudentId(studentId);

    if (referrals.length === 0) {
      throw new NotFoundException(
        `Psychological referrals for student ${studentId} were not found`,
      );
    }

    return referrals;
  }

  async updateReferralStatus(
    id: string,
    updateReferralStatusDto: UpdatePsychologicalReferralStatusDto,
  ): Promise<PsychologicalReferral> {
    await this.getReferralById(id);

    const updatedReferral = await this.referralRepository.updateStatus(
      id,
      updateReferralStatusDto.status,
    );

    if (!updatedReferral) {
      throw new NotFoundException(`Psychological referral with id ${id} was not found`);
    }

    return updatedReferral;
  }

  private async getAppointmentById(id: string): Promise<PsychologicalAppointment> {
    const appointment = await this.appointmentRepository.findById(id);

    if (!appointment) {
      throw new NotFoundException(`Psychological appointment with id ${id} was not found`);
    }

    return appointment;
  }

  private async getReferralById(id: string): Promise<PsychologicalReferral> {
    const referral = await this.referralRepository.findById(id);

    if (!referral) {
      throw new NotFoundException(`Psychological referral with id ${id} was not found`);
    }

    return referral;
  }
}
