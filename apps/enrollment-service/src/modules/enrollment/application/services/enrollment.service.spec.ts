import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Enrollment } from '../../domain/entities/enrollment.entity';
import { EnrollmentStatus } from '../../domain/enums/enrollment-status.enum';
import {
  ENROLLMENT_REPOSITORY,
  EnrollmentRepository,
} from '../../domain/repositories/enrollment.repository';
import { EnrollmentService } from './enrollment.service';

describe('EnrollmentService', () => {
  let service: EnrollmentService;
  let repository: jest.Mocked<EnrollmentRepository>;

  const enrollment = new Enrollment(
    '8cb693c7-4df3-41fd-b0de-8d4a8890a7a1',
    '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
    '86a8aa07-b63d-4b1d-9f87-62be9f6d4182',
    '2026-1',
    EnrollmentStatus.ENROLLED,
    new Date('2026-06-01T12:00:00.000Z'),
    new Date('2026-06-01T12:00:00.000Z'),
  );

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByStudentId: jest.fn(),
      findBySubjectId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentService,
        {
          provide: ENROLLMENT_REPOSITORY,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<EnrollmentService>(EnrollmentService);
  });

  it('should create an enrollment with ENROLLED status', async () => {
    repository.create.mockImplementation(
      async (createdEnrollment: Enrollment) => createdEnrollment,
    );

    const result = await service.createEnrollment({
      studentId: enrollment.studentId,
      subjectId: enrollment.subjectId,
      academicPeriod: enrollment.academicPeriod,
      status: EnrollmentStatus.CANCELLED,
    });

    expect(result.status).toBe(EnrollmentStatus.ENROLLED);
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it('should return all enrollments', async () => {
    repository.findAll.mockResolvedValue([enrollment]);

    await expect(service.getEnrollments()).resolves.toEqual([enrollment]);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when enrollment does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.getEnrollmentById(enrollment.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should update enrollment status', async () => {
    const droppedEnrollment = new Enrollment(
      enrollment.id,
      enrollment.studentId,
      enrollment.subjectId,
      enrollment.academicPeriod,
      EnrollmentStatus.DROPPED,
      enrollment.createdAt,
      new Date('2026-06-01T13:00:00.000Z'),
    );

    repository.findById.mockResolvedValue(enrollment);
    repository.update.mockResolvedValue(droppedEnrollment);

    const result = await service.updateEnrollment(enrollment.id, {
      status: EnrollmentStatus.DROPPED,
    });

    expect(result.status).toBe(EnrollmentStatus.DROPPED);
    expect(repository.update).toHaveBeenCalledWith(enrollment.id, {
      academicPeriod: undefined,
      status: EnrollmentStatus.DROPPED,
    });
  });

  it('should delete an enrollment', async () => {
    repository.findById.mockResolvedValue(enrollment);
    repository.delete.mockResolvedValue(true);

    await expect(service.deleteEnrollment(enrollment.id)).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith(enrollment.id);
  });
});
