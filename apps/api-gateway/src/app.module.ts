import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import envConfiguration from './config/env.configuration';
import { validateEnv } from './config/env.validation';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { HealthController } from './modules/health/health.controller';
import { ProxyController } from './modules/proxy/proxy.controller';
import { ProxyService } from './modules/proxy/proxy.service';

const rateLimitTtl = Number(process.env.RATE_LIMIT_TTL ?? 60000);
const rateLimitLimit = Number(process.env.RATE_LIMIT_LIMIT ?? 30);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'apps/api-gateway/.env'],
      load: [envConfiguration],
      validate: validateEnv,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: rateLimitTtl,
        limit: rateLimitLimit,
      },
    ]),
  ],
  controllers: [HealthController, ProxyController],
  providers: [
    ProxyService,
    JwtAuthGuard,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
