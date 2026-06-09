import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Server } from 'http';
import { ScholarshipStatus } from '../src/modules/scholarship/domain/enums/scholarship-status.enum';

describe('Scholarship API', () => {
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

  it('POST /scholarships should create a scholarship', async () => {
    const response = await request(httpServer)
      .post('/scholarships')
      .send({
        studentId: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
        scholarshipType: 'ECONOMIC_SUPPORT',
        reason: 'Financial hardship due to family situation',
        status: ScholarshipStatus.PENDING,
      })
      .expect(201);

    expect(response.body).toMatchObject({
      studentId: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
      scholarshipType: 'ECONOMIC_SUPPORT',
      reason: 'Financial hardship due to family situation',
      status: ScholarshipStatus.PENDING,
    });
    expect(response.body.id).toBeDefined();
  });

  it('GET /scholarships should return scholarships', async () => {
    await request(httpServer)
      .post('/scholarships')
      .send({
        studentId: '4d51ffba-3cc1-410d-82d3-92ef2c8a6104',
        scholarshipType: 'ACADEMIC_EXCELLENCE',
        reason: 'Outstanding academic performance',
        status: ScholarshipStatus.PENDING,
      })
      .expect(201);

    const response = await request(httpServer).get('/scholarships').expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('PATCH /scholarships/:id/status should update scholarship status', async () => {
    const createdResponse = await request(httpServer)
      .post('/scholarships')
      .send({
        studentId: 'bd8d7c9e-c4ea-45db-9dd2-88fc734f49e1',
        scholarshipType: 'TRANSPORT_SUPPORT',
        reason: 'Transport expenses support request',
        status: ScholarshipStatus.PENDING,
      })
      .expect(201);

    const createdScholarship = createdResponse.body as { id: string };

    const response = await request(httpServer)
      .patch(`/scholarships/${createdScholarship.id}/status`)
      .send({ status: ScholarshipStatus.APPROVED })
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdScholarship.id,
      status: ScholarshipStatus.APPROVED,
    });
  });
});
