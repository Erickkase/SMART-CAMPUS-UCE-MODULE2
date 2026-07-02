import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentService } from './application/services/enrollment.service';
import { ENROLLMENT_REPOSITORY } from './domain/repositories/enrollment.repository';
import { EnrollmentInMemoryRepository } from './infrastructure/persistence/in-memory/repositories/enrollment-in-memory.repository';
import { EnrollmentTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/enrollment.typeorm-entity';
import { EnrollmentTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/enrollment-typeorm.repository';
import { EnrollmentController } from './presentation/controllers/enrollment.controller';

const isDbEnabled =
  (process.env.DB_ENABLED ??
    (process.env.NODE_ENV === 'production' ? 'true' : 'false')) === 'true';

const persistenceImports = isDbEnabled
  ? [TypeOrmModule.forFeature([EnrollmentTypeOrmEntity])]
  : [];

const enrollmentRepositoryProvider = {
  provide: ENROLLMENT_REPOSITORY,
  useClass: isDbEnabled ? EnrollmentTypeOrmRepository : EnrollmentInMemoryRepository,
};

@Module({
  imports: persistenceImports,
  controllers: [EnrollmentController],
  providers: [EnrollmentService, enrollmentRepositoryProvider],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
