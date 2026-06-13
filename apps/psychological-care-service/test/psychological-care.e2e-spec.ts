import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'http';
import * as request from 'supertest';
import { AppointmentStatus } from '../src/modules/psychological-care/domain/enums/appointment-status.enum';
import { CareModality } from '../src/modules/psychological-care/domain/enums/care-modality.enum';
import { RequestStatus } from '../src/modules/psychological-care/domain/enums/request-status.enum';
import { RiskLevel } from '../src/modules/psychological-care/domain/enums/risk-level.enum';

describe('Psychological Care API', () => {
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

  it('POST /psychological-care/requests should create a request', async () => {
    const response = await request(httpServer)
      .post('/psychological-care/requests')
      .send({
        studentId: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
        reason: 'Student reports anxiety symptoms before exams',
        priority: RiskLevel.MEDIUM,
        status: RequestStatus.COMPLETED,
      })
      .expect(201);

    expect(response.body).toMatchObject({
      studentId: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
      reason: 'Student reports anxiety symptoms before exams',
      priority: RiskLevel.MEDIUM,
      status: RequestStatus.REQUESTED,
    });
    expect(response.body.id).toBeDefined();
  });

  it('GET /psychological-care/requests should return requests', async () => {
    await request(httpServer)
      .post('/psychological-care/requests')
      .send({
        studentId: '4d51ffba-3cc1-410d-82d3-92ef2c8a6104',
        reason: 'Student requires counseling support',
        priority: RiskLevel.LOW,
        status: RequestStatus.REQUESTED,
      })
      .expect(201);

    const response = await request(httpServer)
      .get('/psychological-care/requests')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('POST /psychological-care/appointments should create an appointment', async () => {
    const response = await request(httpServer)
      .post('/psychological-care/appointments')
      .send({
        studentId: '9d232967-baba-4232-963c-64c69d4256bb',
        psychologistId: '76b6eb1f-2395-4b24-9d0b-7d02143b13ef',
        appointmentDate: '2026-06-15T14:30:00.000Z',
        modality: CareModality.IN_PERSON,
        status: AppointmentStatus.CANCELLED,
        notes: 'First session scheduled after student welfare intake.',
      })
      .expect(201);

    expect(response.body).toMatchObject({
      studentId: '9d232967-baba-4232-963c-64c69d4256bb',
      psychologistId: '76b6eb1f-2395-4b24-9d0b-7d02143b13ef',
      modality: CareModality.IN_PERSON,
      status: AppointmentStatus.SCHEDULED,
      notes: 'First session scheduled after student welfare intake.',
    });
    expect(response.body.id).toBeDefined();
  });

  it('PATCH /psychological-care/appointments/:id/status should update appointment status', async () => {
    const createdResponse = await request(httpServer)
      .post('/psychological-care/appointments')
      .send({
        studentId: 'bd8d7c9e-c4ea-45db-9dd2-88fc734f49e1',
        psychologistId: '76b6eb1f-2395-4b24-9d0b-7d02143b13ef',
        appointmentDate: '2026-06-20T16:00:00.000Z',
        modality: CareModality.VIRTUAL,
        status: AppointmentStatus.SCHEDULED,
        notes: 'Virtual follow-up appointment.',
      })
      .expect(201);

    const createdAppointment = createdResponse.body as { id: string };

    const response = await request(httpServer)
      .patch(`/psychological-care/appointments/${createdAppointment.id}/status`)
      .send({ status: AppointmentStatus.COMPLETED })
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdAppointment.id,
      status: AppointmentStatus.COMPLETED,
    });
  });
});
