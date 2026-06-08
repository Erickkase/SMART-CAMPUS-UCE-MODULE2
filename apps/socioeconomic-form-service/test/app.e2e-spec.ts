import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Server } from 'http';

describe('Socioeconomic Form API', () => {
  let app: INestApplication;
  let httpServer: Server;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.MONGO_ENABLED = 'false';

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

  it('POST /socioeconomic-forms should create a form', async () => {
    const response = await request(httpServer)
      .post('/socioeconomic-forms')
      .send({
        studentId: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
        familyIncome: 550,
        housingType: 'RENTED',
        familyMembers: 4,
        employmentStatus: 'UNEMPLOYED',
        vulnerabilityFactors: 'Single-parent household',
        observations: 'Student requires support evaluation',
      })
      .expect(201);

    expect(response.body).toMatchObject({
      studentId: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
      familyIncome: 550,
      housingType: 'RENTED',
    });
    expect(response.body.id).toBeDefined();
  });

  it('GET /socioeconomic-forms should return forms', async () => {
    await request(httpServer)
      .post('/socioeconomic-forms')
      .send({
        studentId: '4d51ffba-3cc1-410d-82d3-92ef2c8a6104',
        familyIncome: 850,
        housingType: 'OWNED',
        familyMembers: 5,
        employmentStatus: 'PART_TIME',
        vulnerabilityFactors: 'Disability condition in household',
        observations: 'Updated socioeconomic observations',
      })
      .expect(201);

    const response = await request(httpServer)
      .get('/socioeconomic-forms')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('PATCH /socioeconomic-forms/:id should update a form', async () => {
    const createdResponse = await request(httpServer)
      .post('/socioeconomic-forms')
      .send({
        studentId: 'bd8d7c9e-c4ea-45db-9dd2-88fc734f49e1',
        familyIncome: 420,
        housingType: 'RENTED',
        familyMembers: 3,
        employmentStatus: 'UNEMPLOYED',
        vulnerabilityFactors: 'Low income household',
        observations: 'Initial socioeconomic evaluation',
      })
      .expect(201);

    const createdForm = createdResponse.body as { id: string };

    const response = await request(httpServer)
      .patch(`/socioeconomic-forms/${createdForm.id}`)
      .send({ familyIncome: 600 })
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdForm.id,
      familyIncome: 600,
    });
  });
});
