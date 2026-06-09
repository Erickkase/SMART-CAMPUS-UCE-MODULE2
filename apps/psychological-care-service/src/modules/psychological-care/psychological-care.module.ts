import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config as loadEnv } from 'dotenv';
import { PsychologicalCareService } from './application/services/psychological-care.service';
import { PSYCHOLOGICAL_APPOINTMENT_REPOSITORY } from './domain/repositories/psychological-appointment.repository';
import { PSYCHOLOGICAL_FOLLOW_UP_REPOSITORY } from './domain/repositories/psychological-follow-up.repository';
import { PSYCHOLOGICAL_REFERRAL_REPOSITORY } from './domain/repositories/psychological-referral.repository';
import { PSYCHOLOGICAL_REQUEST_REPOSITORY } from './domain/repositories/psychological-request.repository';
import { PsychologicalAppointmentInMemoryRepository } from './infrastructure/persistence/in-memory/repositories/psychological-appointment-in-memory.repository';
import { PsychologicalFollowUpInMemoryRepository } from './infrastructure/persistence/in-memory/repositories/psychological-follow-up-in-memory.repository';
import { PsychologicalReferralInMemoryRepository } from './infrastructure/persistence/in-memory/repositories/psychological-referral-in-memory.repository';
import { PsychologicalRequestInMemoryRepository } from './infrastructure/persistence/in-memory/repositories/psychological-request-in-memory.repository';
import { PsychologicalAppointmentTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/psychological-appointment.typeorm-entity';
import { PsychologicalFollowUpTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/psychological-follow-up.typeorm-entity';
import { PsychologicalReferralTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/psychological-referral.typeorm-entity';
import { PsychologicalRequestTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/psychological-request.typeorm-entity';
import { PsychologicalAppointmentTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/psychological-appointment-typeorm.repository';
import { PsychologicalFollowUpTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/psychological-follow-up-typeorm.repository';
import { PsychologicalReferralTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/psychological-referral-typeorm.repository';
import { PsychologicalRequestTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/psychological-request-typeorm.repository';
import { PsychologicalCareController } from './presentation/controllers/psychological-care.controller';

loadEnv({ path: 'apps/psychological-care-service/.env', quiet: true });
loadEnv({ quiet: true });

const isDbEnabled =
  (process.env.DB_ENABLED ??
    (process.env.NODE_ENV === 'production' ? 'true' : 'false')) === 'true';

const persistenceImports = isDbEnabled
  ? [
      TypeOrmModule.forFeature([
        PsychologicalRequestTypeOrmEntity,
        PsychologicalAppointmentTypeOrmEntity,
        PsychologicalFollowUpTypeOrmEntity,
        PsychologicalReferralTypeOrmEntity,
      ]),
    ]
  : [];

const psychologicalRequestRepositoryProvider = {
  provide: PSYCHOLOGICAL_REQUEST_REPOSITORY,
  useClass: isDbEnabled
    ? PsychologicalRequestTypeOrmRepository
    : PsychologicalRequestInMemoryRepository,
};

const psychologicalAppointmentRepositoryProvider = {
  provide: PSYCHOLOGICAL_APPOINTMENT_REPOSITORY,
  useClass: isDbEnabled
    ? PsychologicalAppointmentTypeOrmRepository
    : PsychologicalAppointmentInMemoryRepository,
};

const psychologicalFollowUpRepositoryProvider = {
  provide: PSYCHOLOGICAL_FOLLOW_UP_REPOSITORY,
  useClass: isDbEnabled
    ? PsychologicalFollowUpTypeOrmRepository
    : PsychologicalFollowUpInMemoryRepository,
};

const psychologicalReferralRepositoryProvider = {
  provide: PSYCHOLOGICAL_REFERRAL_REPOSITORY,
  useClass: isDbEnabled
    ? PsychologicalReferralTypeOrmRepository
    : PsychologicalReferralInMemoryRepository,
};

@Module({
  imports: persistenceImports,
  controllers: [PsychologicalCareController],
  providers: [
    PsychologicalCareService,
    psychologicalRequestRepositoryProvider,
    psychologicalAppointmentRepositoryProvider,
    psychologicalFollowUpRepositoryProvider,
    psychologicalReferralRepositoryProvider,
  ],
  exports: [PsychologicalCareService],
})
export class PsychologicalCareModule {}
