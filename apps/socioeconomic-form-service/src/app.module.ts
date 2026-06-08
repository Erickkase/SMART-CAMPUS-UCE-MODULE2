import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import envConfiguration from './config/env.configuration';
import { validateEnv } from './config/env.validation';
import { HealthModule } from './modules/health/health.module';
import { SocioeconomicFormModule } from './modules/socioeconomic-form/socioeconomic-form.module';

const isMongoEnabled =
  (process.env.MONGO_ENABLED ??
    (process.env.NODE_ENV === 'production' ? 'true' : 'false')) === 'true';

const persistenceModules = isMongoEnabled
  ? [
      MongooseModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          uri: configService.get<string>('mongoUri'),
        }),
      }),
    ]
  : [];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'apps/socioeconomic-form-service/.env'],
      load: [envConfiguration],
      validate: validateEnv,
    }),
    ...persistenceModules,
    SocioeconomicFormModule,
    HealthModule,
  ],
})
export class AppModule {}
