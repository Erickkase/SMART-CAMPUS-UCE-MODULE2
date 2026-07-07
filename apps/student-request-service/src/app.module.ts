import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import envConfiguration from './config/env.configuration';
import { validateEnv } from './config/env.validation';
import { HealthModule } from './modules/health/health.module';
import { StudentRequestTypeOrmEntity } from './modules/student-request/infrastructure/persistence/typeorm/entities/student-request.typeorm-entity';
import { StudentRequestModule } from './modules/student-request/student-request.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'apps/student-request-service/.env'],
      load: [envConfiguration],
      validate: validateEnv,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbEnabled = configService.get<boolean>('databaseEnabled') ?? false;

        return {
          type: 'postgres' as const,
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.username'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.name'),
          synchronize: configService.get<boolean>('database.synchronize'),
          logging: configService.get<boolean>('database.logging'),
          autoLoadEntities: true,
          entities: [StudentRequestTypeOrmEntity],
          manualInitialization: !dbEnabled,
        };
      },
    }),
    StudentRequestModule,
    HealthModule,
  ],
})
export class AppModule {}
