import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SCHOLARSHIP_REPOSITORY } from './domain/repositories/scholarship.repository';
import { ScholarshipService } from './application/services/scholarship.service';
import { ScholarshipTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/scholarship.typeorm-entity';
import { ScholarshipInMemoryRepository } from './infrastructure/persistence/in-memory/repositories/scholarship-in-memory.repository';
import { ScholarshipTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/scholarship-typeorm.repository';
import { ScholarshipController } from './presentation/controllers/scholarship.controller';

const isDbEnabled =
  (process.env.DB_ENABLED ??
    (process.env.NODE_ENV === 'production' ? 'true' : 'false')) === 'true';

const persistenceImports = isDbEnabled
  ? [TypeOrmModule.forFeature([ScholarshipTypeOrmEntity])]
  : [];

const scholarshipRepositoryProvider = {
  provide: SCHOLARSHIP_REPOSITORY,
  useClass: isDbEnabled
    ? ScholarshipTypeOrmRepository
    : ScholarshipInMemoryRepository,
};

@Module({
  imports: persistenceImports,
  controllers: [ScholarshipController],
  providers: [ScholarshipService, scholarshipRepositoryProvider],
  exports: [ScholarshipService],
})
export class ScholarshipModule {}
