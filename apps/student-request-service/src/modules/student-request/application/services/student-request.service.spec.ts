import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { StudentRequest } from '../../domain/entities/student-request.entity';
import { StudentRequestPriority } from '../../domain/enums/student-request-priority.enum';
import { StudentRequestStatus } from '../../domain/enums/student-request-status.enum';
import { STUDENT_REQUEST_REPOSITORY, StudentRequestRepository } from '../../domain/repositories/student-request.repository';
import { StudentRequestService } from './student-request.service';

describe('StudentRequestService', () => {
  let service: StudentRequestService;
  let repository: jest.Mocked<StudentRequestRepository>;

  const studentRequest = new StudentRequest(
    '67e95da2-65f7-4de7-8dc0-622b7298236b',
    '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
    'SCHOLARSHIP_REVIEW',
    'Review scholarship decision',
    'Student requests a detailed review of the current scholarship decision.',
    StudentRequestPriority.MEDIUM,
    StudentRequestStatus.PENDING,
    new Date('2026-06-01T12:00:00.000Z'),
    new Date('2026-06-01T12:00:00.000Z'),
  );

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentRequestService,
        {
          provide: STUDENT_REQUEST_REPOSITORY,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<StudentRequestService>(StudentRequestService);
  });

  it('should create a request with PENDING status', async () => {
    repository.create.mockImplementation(async (created) => created);

    const result = await service.createStudentRequest({
      studentId: studentRequest.studentId,
      requestType: studentRequest.requestType,
      title: studentRequest.title,
      description: studentRequest.description,
      priority: studentRequest.priority,
      status: StudentRequestStatus.APPROVED,
    });

    expect(result.status).toBe(StudentRequestStatus.PENDING);
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it('should return all requests', async () => {
    repository.findAll.mockResolvedValue([studentRequest]);

    await expect(service.getStudentRequests()).resolves.toEqual([studentRequest]);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when request does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.getStudentRequestById(studentRequest.id)).rejects.toBeInstanceOf(NotFoundException);
  });
});
