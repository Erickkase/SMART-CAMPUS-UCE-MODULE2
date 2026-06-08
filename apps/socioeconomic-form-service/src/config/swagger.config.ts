import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('SMART CAMPUS UCE - Socioeconomic Form Service')
    .setDescription(
      'Student Welfare and Support Module - Socioeconomic Form Management Microservice',
    )
    .setVersion('1.0.0')
    .addTag('Socioeconomic Forms')
    .addTag('Health')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}
