import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'http';
import * as request from 'supertest';
import { StudentRequestPriority } from '../src/modules/student-request/domain/enums/student-request-priority.enum';
import { StudentRequestStatus } from '../src/modules/student-request/domain/enums/student-request-status.enum';

describe('Student Request API', () => {
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
    await request(httpServer).get('/health').expect(200).expect({ status: 'ok' });
  });

  it('POST /student-requests should create a student request', async () => {
    const response = await request(httpServer)
      .post('/student-requests')
      .send({
        studentId: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
        requestType: 'SCHOLARSHIP_REVIEW',
        title: 'Review scholarship decision',
        description: 'Student requests review of the scholarship resolution.',
        priority: StudentRequestPriority.MEDIUM,
        status: StudentRequestStatus.APPROVED,
      })
      .expect(201);

    expect(response.body).toMatchObject({
      studentId: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
      requestType: 'SCHOLARSHIP_REVIEW',
      title: 'Review scholarship decision',
      priority: StudentRequestPriority.MEDIUM,
      status: StudentRequestStatus.PENDING,
    });
  });

  it('GET /student-requests should return requests', async () => {
    const response = await request(httpServer).get('/student-requests').expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
