import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import envConfiguration from './config/env.configuration';
import { validateEnv } from './config/env.validation';
import { HealthModule } from './modules/health/health.module';
import { ScholarshipTypeOrmEntity } from './modules/scholarship/infrastructure/persistence/typeorm/entities/scholarship.typeorm-entity';
import { ScholarshipModule } from './modules/scholarship/scholarship.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'apps/scholarship-service/.env'],
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
          entities: [ScholarshipTypeOrmEntity],
          manualInitialization: !dbEnabled,
        };
      },
    }),
    ScholarshipModule,
    HealthModule,
  ],
})
export class AppModule {}
