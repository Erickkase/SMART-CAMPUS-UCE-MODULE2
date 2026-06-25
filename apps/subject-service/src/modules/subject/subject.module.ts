import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectService } from './application/services/subject.service';
import { SUBJECT_REPOSITORY } from './domain/repositories/subject.repository';
import { SubjectInMemoryRepository } from './infrastructure/persistence/in-memory/repositories/subject-in-memory.repository';
import { SubjectTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/subject.typeorm-entity';
import { SubjectTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/subject-typeorm.repository';
import { SubjectController } from './presentation/controllers/subject.controller';

const isDbEnabled =
  (process.env.DB_ENABLED ??
    (process.env.NODE_ENV === 'production' ? 'true' : 'false')) === 'true';

const persistenceImports = isDbEnabled
  ? [TypeOrmModule.forFeature([SubjectTypeOrmEntity])]
  : [];

const subjectRepositoryProvider = {
  provide: SUBJECT_REPOSITORY,
  useClass: isDbEnabled ? SubjectTypeOrmRepository : SubjectInMemoryRepository,
};

@Module({
  imports: persistenceImports,
  controllers: [SubjectController],
  providers: [SubjectService, subjectRepositoryProvider],
  exports: [SubjectService],
})
export class SubjectModule {}
