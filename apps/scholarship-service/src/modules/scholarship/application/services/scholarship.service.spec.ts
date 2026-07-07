import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Scholarship } from '../../domain/entities/scholarship.entity';
import { ScholarshipStatus } from '../../domain/enums/scholarship-status.enum';
import {
  SCHOLARSHIP_REPOSITORY,
  ScholarshipRepository,
} from '../../domain/repositories/scholarship.repository';
import { ScholarshipCacheService } from '../../infrastructure/cache/scholarship-cache.service';
import { ScholarshipKafkaProducerService } from '../../infrastructure/messaging/scholarship-kafka-producer.service';
import { ScholarshipMqttPublisherService } from '../../infrastructure/messaging/scholarship-mqtt-publisher.service';
import { ScholarshipRabbitMqPublisherService } from '../../infrastructure/messaging/scholarship-rabbitmq-publisher.service';
import { ScholarshipService } from './scholarship.service';

describe('ScholarshipService', () => {
  let service: ScholarshipService;
  let repository: jest.Mocked<ScholarshipRepository>;
  let cacheService: jest.Mocked<ScholarshipCacheService>;
  let mqttPublisher: jest.Mocked<ScholarshipMqttPublisherService>;
  let kafkaProducer: jest.Mocked<ScholarshipKafkaProducerService>;
  let rabbitMqPublisher: jest.Mocked<ScholarshipRabbitMqPublisherService>;

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

    mqttPublisher = {
      publishScholarshipCreated: jest.fn(),
      publishScholarshipStatusUpdated: jest.fn(),
      onModuleDestroy: jest.fn(),
    } as unknown as jest.Mocked<ScholarshipMqttPublisherService>;

    kafkaProducer = {
      publishScholarshipCreated: jest.fn(),
      publishScholarshipStatusUpdated: jest.fn(),
      onModuleDestroy: jest.fn(),
    } as unknown as jest.Mocked<ScholarshipKafkaProducerService>;

    rabbitMqPublisher = {
      publishScholarshipCreated: jest.fn(),
      publishScholarshipStatusUpdated: jest.fn(),
      onModuleDestroy: jest.fn(),
    } as unknown as jest.Mocked<ScholarshipRabbitMqPublisherService>;

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
          provide: ScholarshipMqttPublisherService,
          useValue: mqttPublisher,
        },
        {
          provide: ScholarshipKafkaProducerService,
          useValue: kafkaProducer,
        },
        {
          provide: ScholarshipRabbitMqPublisherService,
          useValue: rabbitMqPublisher,
        },
      ],
    }).compile();

    service = module.get<ScholarshipService>(ScholarshipService);
  });

  it('should create a scholarship with PENDING status', async () => {
    repository.create.mockImplementation(
      async (createdScholarship: Scholarship) => createdScholarship,
    );

    const result = await service.createScholarship({
      studentId: scholarship.studentId,
      scholarshipType: scholarship.scholarshipType,
      reason: scholarship.reason,
      status: ScholarshipStatus.APPROVED,
    });

    expect(result.status).toBe(ScholarshipStatus.PENDING);
    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(cacheService.invalidateScholarshipList).toHaveBeenCalledTimes(1);
    expect(mqttPublisher.publishScholarshipCreated).toHaveBeenCalledTimes(1);
    expect(kafkaProducer.publishScholarshipCreated).toHaveBeenCalledTimes(1);
    expect(rabbitMqPublisher.publishScholarshipCreated).toHaveBeenCalledTimes(1);
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
    repository.updateStatus.mockResolvedValue(approvedScholarship);

    const result = await service.updateScholarshipStatus(scholarship.id, {
      status: ScholarshipStatus.APPROVED,
    });

    expect(result.status).toBe(ScholarshipStatus.APPROVED);
    expect(repository.updateStatus).toHaveBeenCalledWith(
      scholarship.id,
      ScholarshipStatus.APPROVED,
    );
    expect(cacheService.invalidateScholarshipList).toHaveBeenCalledTimes(1);
    expect(mqttPublisher.publishScholarshipStatusUpdated).toHaveBeenCalledWith(
      approvedScholarship,
    );
    expect(kafkaProducer.publishScholarshipStatusUpdated).toHaveBeenCalledWith(
      approvedScholarship,
    );
    expect(rabbitMqPublisher.publishScholarshipStatusUpdated).toHaveBeenCalledWith(
      approvedScholarship,
    );
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
