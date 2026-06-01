import { Module } from '@nestjs/common';
import { HealthController } from '../scholarship/presentation/controllers/health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
