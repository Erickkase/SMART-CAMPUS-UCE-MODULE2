import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentService } from './appointment.service';
import { APPOINTMENT_REPOSITORY } from '../../domain/repositories/appointment.repository';
import { AppointmentStatus } from '../../domain/enums/appointment-status.enum';
import { Appointment } from '../../domain/entities/appointment.entity';
import { StudentServiceClient } from '../../infrastructure/clients/student-service.client';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let repository: jest.Mocked<{
    create: jest.Mock;
    findAll: jest.Mock;
    findById: jest.Mock;
    findByStudentId: jest.Mock;
    update: jest.Mock;
    updateStatus: jest.Mock;
    delete: jest.Mock;
  }>;
  let studentClient: jest.Mocked<StudentServiceClient>;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByStudentId: jest.fn(),
      update: jest.fn(),
      updateStatus: jest.fn(),
      delete: jest.fn(),
    };

    studentClient = {
      validateStudentExists: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<StudentServiceClient>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        { provide: APPOINTMENT_REPOSITORY, useValue: repository },
        { provide: StudentServiceClient, useValue: studentClient },
      ],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAppointment', () => {
    it('should create an appointment with PENDING status', async () => {
      const dto = {
        studentId: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
        psychologistId: '9c6ef28c-c551-427f-b8c0-cf8261598513',
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        reason: 'Initial consultation',
      };

      repository.create.mockImplementation((appointment) =>
        Promise.resolve(appointment),
      );

      const result = await service.createAppointment(dto);

      expect(result.status).toBe(AppointmentStatus.PENDING);
      expect(result.studentId).toBe(dto.studentId);
      expect(result.psychologistId).toBe(dto.psychologistId);
      expect(studentClient.validateStudentExists).toHaveBeenCalledWith(
        dto.studentId,
      );
    });

    it('should reject appointments scheduled in the past', async () => {
      const dto = {
        studentId: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
        psychologistId: '9c6ef28c-c551-427f-b8c0-cf8261598513',
        scheduledAt: new Date(Date.now() - 86400000).toISOString(),
        reason: 'Initial consultation',
      };

      await expect(service.createAppointment(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateAppointmentStatus', () => {
    it('should allow PENDING -> CONFIRMED transition', async () => {
      const appointment = new Appointment(
        'id-1',
        'student-1',
        'psych-1',
        new Date(Date.now() + 86400000),
        'reason',
        AppointmentStatus.PENDING,
        new Date(),
        new Date(),
      );

      repository.findById.mockResolvedValue(appointment);
      repository.updateStatus.mockResolvedValue({
        ...appointment,
        status: AppointmentStatus.CONFIRMED,
      });

      const result = await service.updateAppointmentStatus('id-1', {
        status: AppointmentStatus.CONFIRMED,
      });

      expect(result.status).toBe(AppointmentStatus.CONFIRMED);
    });

    it('should reject invalid status transitions', async () => {
      const appointment = new Appointment(
        'id-1',
        'student-1',
        'psych-1',
        new Date(Date.now() + 86400000),
        'reason',
        AppointmentStatus.COMPLETED,
        new Date(),
        new Date(),
      );

      repository.findById.mockResolvedValue(appointment);

      await expect(
        service.updateAppointmentStatus('id-1', {
          status: AppointmentStatus.CANCELLED,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAppointmentById', () => {
    it('should throw NotFoundException when appointment does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getAppointmentById('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
