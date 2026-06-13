import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PsychologicalAppointment } from '../../domain/entities/psychological-appointment.entity';
import { PsychologicalReferral } from '../../domain/entities/psychological-referral.entity';
import { PsychologicalRequest } from '../../domain/entities/psychological-request.entity';
import { AppointmentStatus } from '../../domain/enums/appointment-status.enum';
import { CareModality } from '../../domain/enums/care-modality.enum';
import { RequestStatus } from '../../domain/enums/request-status.enum';
import { RiskLevel } from '../../domain/enums/risk-level.enum';
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
import { PsychologicalCareService } from './psychological-care.service';

describe('PsychologicalCareService', () => {
  let service: PsychologicalCareService;
  let requestRepository: jest.Mocked<PsychologicalRequestRepository>;
  let appointmentRepository: jest.Mocked<PsychologicalAppointmentRepository>;
  let followUpRepository: jest.Mocked<PsychologicalFollowUpRepository>;
  let referralRepository: jest.Mocked<PsychologicalReferralRepository>;

  const request = new PsychologicalRequest(
    '87a6fd71-764f-4523-9993-49d61634744e',
    '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
    'Student reports anxiety symptoms before exams',
    RiskLevel.MEDIUM,
    RequestStatus.REQUESTED,
    new Date('2026-06-01T12:00:00.000Z'),
    new Date('2026-06-01T12:00:00.000Z'),
  );

  const appointment = new PsychologicalAppointment(
    'd6f58d82-a35e-4a8a-8dc4-8da6c67507ea',
    request.studentId,
    '76b6eb1f-2395-4b24-9d0b-7d02143b13ef',
    new Date('2026-06-15T14:30:00.000Z'),
    CareModality.IN_PERSON,
    AppointmentStatus.SCHEDULED,
    'First session scheduled after student welfare intake.',
    new Date('2026-06-01T12:00:00.000Z'),
    new Date('2026-06-01T12:00:00.000Z'),
  );

  beforeEach(async () => {
    requestRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByStudentId: jest.fn(),
      updateStatus: jest.fn(),
      delete: jest.fn(),
    };

    appointmentRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByStudentId: jest.fn(),
      updateStatus: jest.fn(),
      delete: jest.fn(),
    };

    followUpRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByStudentId: jest.fn(),
      updateRiskLevel: jest.fn(),
      delete: jest.fn(),
    };

    referralRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByStudentId: jest.fn(),
      updateStatus: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PsychologicalCareService,
        { provide: PSYCHOLOGICAL_REQUEST_REPOSITORY, useValue: requestRepository },
        {
          provide: PSYCHOLOGICAL_APPOINTMENT_REPOSITORY,
          useValue: appointmentRepository,
        },
        { provide: PSYCHOLOGICAL_FOLLOW_UP_REPOSITORY, useValue: followUpRepository },
        { provide: PSYCHOLOGICAL_REFERRAL_REPOSITORY, useValue: referralRepository },
      ],
    }).compile();

    service = module.get<PsychologicalCareService>(PsychologicalCareService);
  });

  it('should create a request with REQUESTED status', async () => {
    requestRepository.create.mockImplementation(
      async (createdRequest: PsychologicalRequest) => createdRequest,
    );

    const result = await service.createRequest({
      studentId: request.studentId,
      reason: request.reason,
      priority: request.priority,
      status: RequestStatus.COMPLETED,
    });

    expect(result.status).toBe(RequestStatus.REQUESTED);
    expect(requestRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should return all requests', async () => {
    requestRepository.findAll.mockResolvedValue([request]);

    await expect(service.getRequests()).resolves.toEqual([request]);
    expect(requestRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when request does not exist', async () => {
    requestRepository.findById.mockResolvedValue(null);

    await expect(service.getRequestById(request.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should update request status', async () => {
    const scheduledRequest = new PsychologicalRequest(
      request.id,
      request.studentId,
      request.reason,
      request.priority,
      RequestStatus.SCHEDULED,
      request.createdAt,
      new Date('2026-06-01T13:00:00.000Z'),
    );

    requestRepository.findById.mockResolvedValue(request);
    requestRepository.updateStatus.mockResolvedValue(scheduledRequest);

    const result = await service.updateRequestStatus(request.id, {
      status: RequestStatus.SCHEDULED,
    });

    expect(result.status).toBe(RequestStatus.SCHEDULED);
    expect(requestRepository.updateStatus).toHaveBeenCalledWith(
      request.id,
      RequestStatus.SCHEDULED,
    );
  });

  it('should create an appointment with SCHEDULED status', async () => {
    appointmentRepository.create.mockImplementation(
      async (createdAppointment: PsychologicalAppointment) => createdAppointment,
    );

    const result = await service.createAppointment({
      studentId: appointment.studentId,
      psychologistId: appointment.psychologistId,
      appointmentDate: appointment.appointmentDate.toISOString(),
      modality: appointment.modality,
      status: AppointmentStatus.CANCELLED,
      notes: appointment.notes,
    });

    expect(result.status).toBe(AppointmentStatus.SCHEDULED);
    expect(appointmentRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should update appointment status', async () => {
    const completedAppointment = new PsychologicalAppointment(
      appointment.id,
      appointment.studentId,
      appointment.psychologistId,
      appointment.appointmentDate,
      appointment.modality,
      AppointmentStatus.COMPLETED,
      appointment.notes,
      appointment.createdAt,
      new Date('2026-06-01T13:00:00.000Z'),
    );

    appointmentRepository.findById.mockResolvedValue(appointment);
    appointmentRepository.updateStatus.mockResolvedValue(completedAppointment);

    const result = await service.updateAppointmentStatus(appointment.id, {
      status: AppointmentStatus.COMPLETED,
    });

    expect(result.status).toBe(AppointmentStatus.COMPLETED);
    expect(appointmentRepository.updateStatus).toHaveBeenCalledWith(
      appointment.id,
      AppointmentStatus.COMPLETED,
    );
  });

  it('should create a follow-up for an existing appointment', async () => {
    appointmentRepository.findById.mockResolvedValue(appointment);
    followUpRepository.create.mockImplementation(async (createdFollowUp) => createdFollowUp);

    const result = await service.createFollowUp({
      appointmentId: appointment.id,
      studentId: appointment.studentId,
      observations: 'Student shows improvement.',
      recommendations: 'Continue weekly sessions.',
      riskLevel: RiskLevel.LOW,
      nextAction: 'Schedule next appointment.',
    });

    expect(result.appointmentId).toBe(appointment.id);
    expect(followUpRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should create a referral with REFERRED status', async () => {
    referralRepository.create.mockImplementation(
      async (createdReferral: PsychologicalReferral) => createdReferral,
    );

    const result = await service.createReferral({
      studentId: request.studentId,
      referredTo: 'External clinical psychology center',
      reason: 'Student requires specialized clinical evaluation.',
      status: RequestStatus.COMPLETED,
    });

    expect(result.status).toBe(RequestStatus.REFERRED);
    expect(referralRepository.create).toHaveBeenCalledTimes(1);
  });
});
