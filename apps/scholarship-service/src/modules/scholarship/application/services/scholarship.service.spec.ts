import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Scholarship } from '../../domain/entities/scholarship.entity';
import { ScholarshipStatus } from '../../domain/enums/scholarship-status.enum';
import {
  SCHOLARSHIP_REPOSITORY,
  ScholarshipRepository,
} from '../../domain/repositories/scholarship.repository';
import { ScholarshipCacheService } from '../../infrastructure/cache/scholarship-cache.service';
import { ScholarshipOutboxDispatcherService } from '../../infrastructure/outbox/scholarship-outbox-dispatcher.service';
import { ScholarshipTransactionalWriterService } from '../../infrastructure/outbox/scholarship-transactional-writer.service';
import { ScholarshipService } from './scholarship.service';

describe('ScholarshipService', () => {
  let service: ScholarshipService;
  let repository: jest.Mocked<ScholarshipRepository>;
  let cacheService: jest.Mocked<ScholarshipCacheService>;
  let outboxDispatcher: jest.Mocked<ScholarshipOutboxDispatcherService>;
  let transactionalWriter: jest.Mocked<ScholarshipTransactionalWriterService>;

  const scholarship = new Scholarship(
    '67e95da2-65f7-4de7-8dc0-622b7298236b',
    '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
    'ECONOMIC_SUPPORT',
    'Financial hardship due to family situation',
    ScholarshipStatus.PENDING,
    new Date('2026-06-01T12:00:00.000Z'),
    new Date('2026-06-01T12:00:00.000Z'),
  );

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      updateStatus: jest.fn(),
      delete: jest.fn(),
    };

    outboxDispatcher = {
      enqueueEvent: jest.fn(),
      flushPendingEvents: jest.fn(),
      onModuleInit: jest.fn(),
      onModuleDestroy: jest.fn(),
    } as unknown as jest.Mocked<ScholarshipOutboxDispatcherService>;

    transactionalWriter = {
      createScholarshipWithEvent: jest.fn(),
      updateScholarshipStatusWithEvent: jest.fn(),
    } as unknown as jest.Mocked<ScholarshipTransactionalWriterService>;

    cacheService = {
      getScholarshipList: jest.fn(),
      setScholarshipList: jest.fn(),
      invalidateScholarshipList: jest.fn(),
      onModuleDestroy: jest.fn(),
    } as unknown as jest.Mocked<ScholarshipCacheService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScholarshipService,
        {
          provide: SCHOLARSHIP_REPOSITORY,
          useValue: repository,
        },
        {
          provide: ScholarshipCacheService,
          useValue: cacheService,
        },
        {
          provide: ScholarshipOutboxDispatcherService,
          useValue: outboxDispatcher,
        },
        {
          provide: ScholarshipTransactionalWriterService,
          useValue: transactionalWriter,
        },
      ],
    }).compile();

    service = module.get<ScholarshipService>(ScholarshipService);
  });

  it('should create a scholarship with PENDING status', async () => {
    transactionalWriter.createScholarshipWithEvent.mockImplementation(
      async (createdScholarship: Scholarship) => createdScholarship,
    );

    const result = await service.createScholarship({
      studentId: scholarship.studentId,
      scholarshipType: scholarship.scholarshipType,
      reason: scholarship.reason,
      status: ScholarshipStatus.APPROVED,
    });

    expect(result.status).toBe(ScholarshipStatus.PENDING);
    expect(transactionalWriter.createScholarshipWithEvent).toHaveBeenCalledTimes(1);
    expect(cacheService.invalidateScholarshipList).toHaveBeenCalledTimes(1);
    expect(outboxDispatcher.flushPendingEvents).toHaveBeenCalledTimes(1);
  });

  it('should return all scholarships', async () => {
    cacheService.getScholarshipList.mockResolvedValue(null);
    repository.findAll.mockResolvedValue([scholarship]);

    await expect(service.getScholarships()).resolves.toEqual([scholarship]);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(cacheService.setScholarshipList).toHaveBeenCalledWith([scholarship]);
  });

  it('should return scholarships from cache when available', async () => {
    cacheService.getScholarshipList.mockResolvedValue([scholarship]);

    await expect(service.getScholarships()).resolves.toEqual([scholarship]);
    expect(repository.findAll).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when scholarship does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.getScholarshipById(scholarship.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should approve an existing scholarship', async () => {
    const approvedScholarship = new Scholarship(
      scholarship.id,
      scholarship.studentId,
      scholarship.scholarshipType,
      scholarship.reason,
      ScholarshipStatus.APPROVED,
      scholarship.createdAt,
      new Date('2026-06-01T13:00:00.000Z'),
    );

    repository.findById.mockResolvedValue(scholarship);
    transactionalWriter.updateScholarshipStatusWithEvent.mockResolvedValue(
      approvedScholarship,
    );

    const result = await service.updateScholarshipStatus(scholarship.id, {
      status: ScholarshipStatus.APPROVED,
    });

    expect(result.status).toBe(ScholarshipStatus.APPROVED);
    expect(transactionalWriter.updateScholarshipStatusWithEvent).toHaveBeenCalledTimes(1);
    expect(cacheService.invalidateScholarshipList).toHaveBeenCalledTimes(1);
    expect(outboxDispatcher.flushPendingEvents).toHaveBeenCalledTimes(1);
  });

  it('should reject invalid status transitions', async () => {
    repository.findById.mockResolvedValue(scholarship);

    await expect(
      service.updateScholarshipStatus(scholarship.id, {
        status: ScholarshipStatus.UNDER_REVIEW,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
