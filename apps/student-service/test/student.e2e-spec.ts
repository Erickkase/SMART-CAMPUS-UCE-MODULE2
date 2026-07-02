import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'http';
import * as request from 'supertest';

describe('Student API', () => {
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

  it('POST /students should create a student', async () => {
    const response = await request(httpServer)
      .post('/students')
      .send({
        identification: '1750000001',
        firstName: 'Ana',
        lastName: 'Perez',
        email: 'ana.perez@uce.edu.ec',
        academicProgram: 'Computer Science',
        isActive: true,
      })
      .expect(201);

    expect(response.body).toMatchObject({
      identification: '1750000001',
      firstName: 'Ana',
      lastName: 'Perez',
      email: 'ana.perez@uce.edu.ec',
      academicProgram: 'Computer Science',
      isActive: true,
    });
    expect(response.body.id).toBeDefined();
  });

  it('GET /students should return students', async () => {
    await request(httpServer)
      .post('/students')
      .send({
        identification: '1750000002',
        firstName: 'Luis',
        lastName: 'Mora',
        email: 'luis.mora@uce.edu.ec',
        academicProgram: 'Software Engineering',
        isActive: true,
      })
      .expect(201);

    const response = await request(httpServer).get('/students').expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('PATCH /students/:id should update a student', async () => {
    const createdResponse = await request(httpServer)
      .post('/students')
      .send({
        identification: '1750000003',
        firstName: 'Maria',
        lastName: 'Lopez',
        email: 'maria.lopez@uce.edu.ec',
        academicProgram: 'Information Systems',
        isActive: true,
      })
      .expect(201);

    const createdStudent = createdResponse.body as { id: string };

    const response = await request(httpServer)
      .patch(`/students/${createdStudent.id}`)
      .send({ firstName: 'Maria Jose' })
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdStudent.id,
      firstName: 'Maria Jose',
    });
  });
});
