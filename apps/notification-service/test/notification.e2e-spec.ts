import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'http';
import * as request from 'supertest';
import { NotificationChannel } from '../src/modules/notification/domain/enums/notification-channel.enum';
import { NotificationStatus } from '../src/modules/notification/domain/enums/notification-status.enum';
import { RecipientType } from '../src/modules/notification/domain/enums/recipient-type.enum';

describe('Notification API', () => {
  let app: INestApplication;
  let httpServer: Server;

  beforeAll(async () => {
    Object.assign(process.env, {
      NODE_ENV: 'test',
      DB_ENABLED: 'false',
    });

    const { AppModule } = await import('../src/app.module');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    httpServer = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health should return health status', async () => {
    await request(httpServer)
      .get('/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  it('POST /notifications should create a notification', async () => {
    const response = await request(httpServer)
      .post('/notifications')
      .send({
        recipientId: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
        recipientType: RecipientType.STUDENT,
        channel: NotificationChannel.EMAIL,
        subject: 'Scholarship request updated',
        content: 'Your scholarship request has been approved.',
      })
      .expect(201);

    expect(response.body).toMatchObject({
      recipientId: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
      recipientType: RecipientType.STUDENT,
      channel: NotificationChannel.EMAIL,
      subject: 'Scholarship request updated',
      content: 'Your scholarship request has been approved.',
      status: NotificationStatus.PENDING,
    });
    expect(response.body.id).toBeDefined();
  });

  it('GET /notifications should return notifications', async () => {
    await request(httpServer)
      .post('/notifications')
      .send({
        recipientId: '4d51ffba-3cc1-410d-82d3-92ef2c8a6104',
        recipientType: RecipientType.STAFF,
        channel: NotificationChannel.SMS,
        subject: 'Appointment reminder',
        content: 'You have an appointment tomorrow.',
      })
      .expect(201);

    const response = await request(httpServer).get('/notifications').expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('PATCH /notifications/:id/status should update notification status', async () => {
    const createdResponse = await request(httpServer)
      .post('/notifications')
      .send({
        recipientId: '9d232967-baba-4232-963c-64c69d4256bb',
        recipientType: RecipientType.STUDENT,
        channel: NotificationChannel.PUSH,
        subject: 'New follow-up',
        content: 'A follow-up has been registered.',
      })
      .expect(201);

    const createdNotification = createdResponse.body as { id: string };

    const response = await request(httpServer)
      .patch(`/notifications/${createdNotification.id}/status`)
      .send({ status: NotificationStatus.SENT })
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdNotification.id,
      status: NotificationStatus.SENT,
    });
  });

  it('GET /notifications/recipient/:recipientId should return recipient notifications', async () => {
    const recipientId = 'bd8d7c9e-c4ea-45db-9dd2-88fc734f49e1';

    await request(httpServer)
      .post('/notifications')
      .send({
        recipientId,
        recipientType: RecipientType.STUDENT,
        channel: NotificationChannel.EMAIL,
        subject: 'Reminder',
        content: 'Reminder content.',
      })
      .expect(201);

    const response = await request(httpServer)
      .get(`/notifications/recipient/${recipientId}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].recipientId).toBe(recipientId);
  });
});
