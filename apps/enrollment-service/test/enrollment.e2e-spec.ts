import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'http';
import * as request from 'supertest';
import { EnrollmentStatus } from '../src/modules/enrollment/domain/enums/enrollment-status.enum';

describe('Enrollment API', () => {
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

  it('POST /enrollments should create an enrollment', async () => {
    const response = await request(httpServer)
      .post('/enrollments')
      .send({
        studentId: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
        subjectId: '86a8aa07-b63d-4b1d-9f87-62be9f6d4182',
        academicPeriod: '2026-1',
        status: EnrollmentStatus.CANCELLED,
      })
      .expect(201);

    expect(response.body).toMatchObject({
      studentId: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
      subjectId: '86a8aa07-b63d-4b1d-9f87-62be9f6d4182',
      academicPeriod: '2026-1',
      status: EnrollmentStatus.ENROLLED,
    });
    expect(response.body.id).toBeDefined();
  });

  it('GET /enrollments should return enrollments', async () => {
    await request(httpServer)
      .post('/enrollments')
      .send({
        studentId: '4d51ffba-3cc1-410d-82d3-92ef2c8a6104',
        subjectId: '28c20d2d-d3b0-4c0c-b9b0-051e04b09264',
        academicPeriod: '2026-1',
        status: EnrollmentStatus.ENROLLED,
      })
      .expect(201);

    const response = await request(httpServer).get('/enrollments').expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('PATCH /enrollments/:id should update an enrollment', async () => {
    const createdResponse = await request(httpServer)
      .post('/enrollments')
      .send({
        studentId: 'bd8d7c9e-c4ea-45db-9dd2-88fc734f49e1',
        subjectId: '5e9f688e-2dfa-4f5f-a4b1-879be891930b',
        academicPeriod: '2026-1',
        status: EnrollmentStatus.ENROLLED,
      })
      .expect(201);

    const createdEnrollment = createdResponse.body as { id: string };

    const response = await request(httpServer)
      .patch(`/enrollments/${createdEnrollment.id}`)
      .send({ status: EnrollmentStatus.DROPPED })
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdEnrollment.id,
      status: EnrollmentStatus.DROPPED,
    });
  });
});
