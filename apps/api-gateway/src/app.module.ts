import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import envConfiguration from './config/env.configuration';
import { validateEnv } from './config/env.validation';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { HealthController } from './modules/health/health.controller';
import { ProxyController } from './modules/proxy/proxy.controller';
import { ProxyService } from './modules/proxy/proxy.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'apps/api-gateway/.env'],
      load: [envConfiguration],
      validate: validateEnv,
    }),
  ],
  controllers: [HealthController, ProxyController],
  providers: [ProxyService, JwtAuthGuard],
})
export class AppModule {}
