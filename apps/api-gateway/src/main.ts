import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { MetricsService } from './modules/metrics/metrics.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const metricsService = app.get(MetricsService);
  const corsOrigin = configService.get<string>('corsOrigin') ?? '*';

  app.enableCors({
    origin: corsOrigin === '*' ? true : corsOrigin.split(','),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use((request: Request, response: Response, next: NextFunction) => {
    response.on('finish', () => {
      const route = request.route?.path ?? request.path ?? 'unknown';
      metricsService.recordHttpRequest(request.method, route, response.statusCode);
    });

    next();
  });

  setupSwagger(app);

  const port = configService.get<number>('port') ?? 8080;
  await app.listen(port);
}

void bootstrap();
