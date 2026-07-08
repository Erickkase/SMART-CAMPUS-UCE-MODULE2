import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Server } from 'http';
import { AppointmentStatus } from '../src/modules/appointment/domain/enums/appointment-status.enum';

describe('Appointment API', () => {
  let app: INestApplication;
  let httpServer: Server;

  beforeAll(async () => {
    Object.assign(process.env, {
      NODE_ENV: 'test',
      DB_ENABLED: 'false',
      AUTH_ENABLED: 'false',
      STUDENT_VALIDATION_ENABLED: 'false',
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

  it('POST /appointments should create an appointment', async () => {
    const response = await request(httpServer)
      .post('/appointments')
      .send({
        studentId: '24affa3b-c16f-432c-9733-56d0392e4f57',
        psychologistId: '9c6ef28c-c551-427f-b8c0-cf8261598513',
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        reason: 'Initial consultation for academic stress',
      })
      .expect(201);

    expect(response.body).toMatchObject({
      studentId: '24affa3b-c16f-432c-9733-56d0392e4f57',
      psychologistId: '9c6ef28c-c551-427f-b8c0-cf8261598513',
      reason: 'Initial consultation for academic stress',
      status: AppointmentStatus.PENDING,
    });
    expect(response.body.id).toBeDefined();
  });

  it('GET /appointments should return appointments', async () => {
    await request(httpServer)
      .post('/appointments')
      .send({
        studentId: '1c07fea8-3a10-4255-ae42-e4adaa771968',
        psychologistId: '9c6ef28c-c551-427f-b8c0-cf8261598513',
        scheduledAt: new Date(Date.now() + 172800000).toISOString(),
        reason: 'Follow-up session',
      })
      .expect(201);

    const response = await request(httpServer).get('/appointments').expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('PATCH /appointments/:id/status should update appointment status', async () => {
    const createdResponse = await request(httpServer)
      .post('/appointments')
      .send({
        studentId: 'c8bef17f-795d-440f-b759-e06e34cd8ad8',
        psychologistId: '9c6ef28c-c551-427f-b8c0-cf8261598513',
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        reason: 'Stress management session',
      })
      .expect(201);

    const createdAppointment = createdResponse.body as { id: string };

    const response = await request(httpServer)
      .patch(`/appointments/${createdAppointment.id}/status`)
      .send({ status: AppointmentStatus.CONFIRMED })
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdAppointment.id,
      status: AppointmentStatus.CONFIRMED,
    });
  });

  it('PATCH /appointments/:id/status should reject invalid transitions', async () => {
    const createdResponse = await request(httpServer)
      .post('/appointments')
      .send({
        studentId: 'b0e3efe8-1298-40ae-9a05-2148136f7e27',
        psychologistId: '9c6ef28c-c551-427f-b8c0-cf8261598513',
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        reason: 'Another session',
      })
      .expect(201);

    const createdAppointment = createdResponse.body as { id: string };

    await request(httpServer)
      .patch(`/appointments/${createdAppointment.id}/status`)
      .send({ status: AppointmentStatus.COMPLETED })
      .expect(400);
  });
});
