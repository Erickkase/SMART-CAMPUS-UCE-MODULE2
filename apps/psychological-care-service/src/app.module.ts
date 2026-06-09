import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import envConfiguration from './config/env.configuration';
import { validateEnv } from './config/env.validation';
import { HealthModule } from './modules/health/health.module';
import { PsychologicalAppointmentTypeOrmEntity } from './modules/psychological-care/infrastructure/persistence/typeorm/entities/psychological-appointment.typeorm-entity';
import { PsychologicalFollowUpTypeOrmEntity } from './modules/psychological-care/infrastructure/persistence/typeorm/entities/psychological-follow-up.typeorm-entity';
import { PsychologicalReferralTypeOrmEntity } from './modules/psychological-care/infrastructure/persistence/typeorm/entities/psychological-referral.typeorm-entity';
import { PsychologicalRequestTypeOrmEntity } from './modules/psychological-care/infrastructure/persistence/typeorm/entities/psychological-request.typeorm-entity';
import { PsychologicalCareModule } from './modules/psychological-care/psychological-care.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'apps/psychological-care-service/.env'],
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
          entities: [
            PsychologicalRequestTypeOrmEntity,
            PsychologicalAppointmentTypeOrmEntity,
            PsychologicalFollowUpTypeOrmEntity,
            PsychologicalReferralTypeOrmEntity,
          ],
          manualInitialization: !dbEnabled,
        };
      },
    }),
    PsychologicalCareModule,
    HealthModule,
  ],
})
export class AppModule {}
