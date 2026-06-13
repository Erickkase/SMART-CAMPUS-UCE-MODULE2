import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'http';
import * as request from 'supertest';
import { RequestStatus } from '../src/modules/psychological-care/domain/enums/request-status.enum';
import { RiskLevel } from '../src/modules/psychological-care/domain/enums/risk-level.enum';

describe('Psychological Care API authentication', () => {
  let app: INestApplication;
  let httpServer: Server;
  let jwtService: JwtService;

  beforeAll(async () => {
    Object.assign(process.env, {
      NODE_ENV: 'test',
      AUTH_ENABLED: 'true',
      JWT_SECRET: 'test-secret',
      JWT_ISSUER: 'smart-campus-uce',
      JWT_AUDIENCE: 'psychological-care-service',
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
    jwtService = app.get(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health should remain public', async () => {
    await request(httpServer)
      .get('/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  it('GET /psychological-care/requests should require a bearer token', async () => {
    await request(httpServer).get('/psychological-care/requests').expect(401);
  });

  it('POST /psychological-care/requests should accept a valid bearer token', async () => {
    const token = jwtService.sign({
      sub: '7c3cbe71-0909-4b4c-8e6a-173f3b63b0f5',
      email: 'psychologist@uce.edu.ec',
      roles: ['PSYCHOLOGIST'],
    });

    const response = await request(httpServer)
      .post('/psychological-care/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({
        studentId: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
        reason: 'Student requests psychological care support',
        priority: RiskLevel.MEDIUM,
        status: RequestStatus.COMPLETED,
      })
      .expect(201);

    expect(response.body).toMatchObject({
      studentId: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
      status: RequestStatus.REQUESTED,
    });
  });
});
