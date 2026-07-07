import { Test, TestingModule } from '@nestjs/testing';
import { OutboxEvent } from '../../domain/entities/outbox-event.entity';
import { OutboxEventStatus } from '../../domain/enums/outbox-event-status.enum';
import {
  OUTBOX_REPOSITORY,
  OutboxRepository,
} from '../../domain/repositories/outbox.repository';
import { OutboxProcessorService } from './outbox-processor.service';

const createMockOutboxEvent = (id: string): OutboxEvent =>
  new OutboxEvent(
    id,
    'Notification',
    `aggregate-${id}`,
    'NotificationCreated',
    { notificationId: id },
    OutboxEventStatus.PENDING,
    0,
    null,
    new Date('2026-06-30T00:00:00.000Z'),
    null,
  );

const mockOutboxRepository: jest.Mocked<OutboxRepository> = {
  create: jest.fn(),
  findPending: jest.fn(),
  markAsProcessed: jest.fn(),
  markAsFailed: jest.fn(),
};

describe('OutboxProcessorService', () => {
  let service: OutboxProcessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OutboxProcessorService,
        {
          provide: OUTBOX_REPOSITORY,
          useValue: mockOutboxRepository,
        },
      ],
    }).compile();

    service = module.get<OutboxProcessorService>(OutboxProcessorService);
    jest.clearAllMocks();
  });

  it('should publish pending events and mark them as processed', async () => {
    const event = createMockOutboxEvent('event-1');
    mockOutboxRepository.findPending.mockResolvedValue([event]);
    mockOutboxRepository.markAsProcessed.mockResolvedValue({
      ...event,
      status: OutboxEventStatus.PROCESSED,
      processedAt: new Date(),
    });

    await service.processPendingEvents();

    expect(mockOutboxRepository.findPending).toHaveBeenCalledWith(10);
    expect(mockOutboxRepository.markAsProcessed).toHaveBeenCalledWith(event.id);
    expect(mockOutboxRepository.markAsFailed).not.toHaveBeenCalled();
  });

  it('should mark events as failed when publication fails', async () => {
    const event = createMockOutboxEvent('event-2');
    mockOutboxRepository.findPending.mockResolvedValue([event]);
    mockOutboxRepository.markAsProcessed.mockRejectedValue(new Error('Database error'));
    mockOutboxRepository.markAsFailed.mockResolvedValue({
      ...event,
      status: OutboxEventStatus.FAILED,
      retryCount: 1,
      errorMessage: 'Database error',
      processedAt: new Date(),
    });

    await service.processPendingEvents();

    expect(mockOutboxRepository.markAsProcessed).toHaveBeenCalledWith(event.id);
    expect(mockOutboxRepository.markAsFailed).toHaveBeenCalledWith(event.id, 'Database error');
  });

  it('should not process events concurrently', async () => {
    mockOutboxRepository.findPending.mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return [];
    });

    const firstCall = service.processPendingEvents();
    const secondCall = service.processPendingEvents();

    await Promise.all([firstCall, secondCall]);

    expect(mockOutboxRepository.findPending).toHaveBeenCalledTimes(1);
  });
});
