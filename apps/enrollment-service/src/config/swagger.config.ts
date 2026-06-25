import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('SMART CAMPUS UCE - Enrollment Service')
    .setDescription(
      'Academic Management Module - Enrollment Management Microservice',
    )
    .setVersion('1.0.0')
    .addTag('Enrollments')
    .addTag('Health')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}
