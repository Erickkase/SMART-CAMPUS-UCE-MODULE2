import { Test, TestingModule } from '@nestjs/testing';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationChannel } from '../../domain/enums/notification-channel.enum';
import { NotificationStatus } from '../../domain/enums/notification-status.enum';
import { RecipientType } from '../../domain/enums/recipient-type.enum';
import {
  NOTIFICATION_REPOSITORY,
  NotificationRepository,
} from '../../domain/repositories/notification.repository';
import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { UpdateNotificationStatusDto } from '../dtos/update-notification-status.dto';
import { NotificationService } from './notification.service';

const mockNotification: Notification = {
  id: 'notification-id',
  recipientId: 'recipient-id',
  recipientType: RecipientType.STUDENT,
  channel: NotificationChannel.EMAIL,
  subject: 'Test subject',
  content: 'Test content',
  status: NotificationStatus.PENDING,
  scheduledAt: null,
  sentAt: null,
  metadata: null,
  createdAt: new Date('2026-06-30T00:00:00.000Z'),
  updatedAt: new Date('2026-06-30T00:00:00.000Z'),
} as Notification;

const mockNotificationRepository: jest.Mocked<NotificationRepository> = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findByRecipientId: jest.fn(),
  update: jest.fn(),
  updateStatus: jest.fn(),
  delete: jest.fn(),
};

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: NOTIFICATION_REPOSITORY,
          useValue: mockNotificationRepository,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    jest.clearAllMocks();
  });

  it('should create a notification with PENDING status', async () => {
    mockNotificationRepository.create.mockResolvedValue(mockNotification);

    const dto: CreateNotificationDto = {
      recipientId: 'recipient-id',
      recipientType: RecipientType.STUDENT,
      channel: NotificationChannel.EMAIL,
      subject: 'Test subject',
      content: 'Test content',
    };

    const result = await service.createNotification(dto);

    expect(result).toEqual(mockNotification);
    expect(mockNotificationRepository.create).toHaveBeenCalledTimes(1);
    const created = mockNotificationRepository.create.mock.calls[0][0];
    expect(created.status).toBe(NotificationStatus.PENDING);
    expect(created.recipientId).toBe(dto.recipientId);
  });

  it('should return all notifications', async () => {
    mockNotificationRepository.findAll.mockResolvedValue([mockNotification]);

    const result = await service.getNotifications();

    expect(result).toEqual([mockNotification]);
    expect(mockNotificationRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return a notification by id', async () => {
    mockNotificationRepository.findById.mockResolvedValue(mockNotification);

    const result = await service.getNotificationById('notification-id');

    expect(result).toEqual(mockNotification);
    expect(mockNotificationRepository.findById).toHaveBeenCalledWith('notification-id');
  });

  it('should throw NotFoundException when notification is not found', async () => {
    mockNotificationRepository.findById.mockResolvedValue(null);

    await expect(service.getNotificationById('unknown-id')).rejects.toThrow(
      'Notification with id unknown-id was not found',
    );
  });

  it('should update notification status', async () => {
    const updated = { ...mockNotification, status: NotificationStatus.SENT };
    mockNotificationRepository.findById.mockResolvedValue(mockNotification);
    mockNotificationRepository.updateStatus.mockResolvedValue(updated);

    const dto: UpdateNotificationStatusDto = { status: NotificationStatus.SENT };
    const result = await service.updateNotificationStatus('notification-id', dto.status);

    expect(result.status).toBe(NotificationStatus.SENT);
    expect(mockNotificationRepository.updateStatus).toHaveBeenCalledWith(
      'notification-id',
      NotificationStatus.SENT,
    );
  });

  it('should delete a notification', async () => {
    mockNotificationRepository.findById.mockResolvedValue(mockNotification);
    mockNotificationRepository.delete.mockResolvedValue(true);

    await service.deleteNotification('notification-id');

    expect(mockNotificationRepository.delete).toHaveBeenCalledWith('notification-id');
  });
});
