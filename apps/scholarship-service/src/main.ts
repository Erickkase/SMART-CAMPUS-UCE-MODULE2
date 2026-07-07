import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { MetricsService } from './modules/metrics/metrics.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const metricsService = app.get(MetricsService);
  const corsOrigin = process.env.CORS_ORIGIN ?? '*';

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

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
}

void bootstrap();
