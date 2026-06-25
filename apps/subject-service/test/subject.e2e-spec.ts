import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'http';
import * as request from 'supertest';

describe('Subject API', () => {
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

  it('POST /subjects should create a subject', async () => {
    const response = await request(httpServer)
      .post('/subjects')
      .send({
        code: 'CS-101',
        name: 'Introduction to Computer Science',
        credits: 4,
        academicLevel: 1,
        isActive: true,
      })
      .expect(201);

    expect(response.body).toMatchObject({
      code: 'CS-101',
      name: 'Introduction to Computer Science',
      credits: 4,
      academicLevel: 1,
      isActive: true,
    });
    expect(response.body.id).toBeDefined();
  });

  it('GET /subjects should return subjects', async () => {
    await request(httpServer)
      .post('/subjects')
      .send({
        code: 'MATH-101',
        name: 'Calculus I',
        credits: 5,
        academicLevel: 1,
        isActive: true,
      })
      .expect(201);

    const response = await request(httpServer).get('/subjects').expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('PATCH /subjects/:id should update a subject', async () => {
    const createdResponse = await request(httpServer)
      .post('/subjects')
      .send({
        code: 'PHY-101',
        name: 'Physics I',
        credits: 4,
        academicLevel: 1,
        isActive: true,
      })
      .expect(201);

    const createdSubject = createdResponse.body as { id: string };

    const response = await request(httpServer)
      .patch(`/subjects/${createdSubject.id}`)
      .send({ name: 'General Physics I' })
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdSubject.id,
      name: 'General Physics I',
    });
  });
});
