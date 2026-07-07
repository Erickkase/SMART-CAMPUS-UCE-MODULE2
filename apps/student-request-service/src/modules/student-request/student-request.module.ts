import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentRequestService } from './application/services/student-request.service';
import { STUDENT_REQUEST_REPOSITORY } from './domain/repositories/student-request.repository';
import { StudentRequestInMemoryRepository } from './infrastructure/persistence/in-memory/repositories/student-request-in-memory.repository';
import { StudentRequestTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/student-request.typeorm-entity';
import { StudentRequestTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/student-request-typeorm.repository';
import { StudentRequestController } from './presentation/controllers/student-request.controller';

const isDbEnabled =
  (process.env.DB_ENABLED ?? (process.env.NODE_ENV === 'production' ? 'true' : 'false')) === 'true';

const persistenceImports = isDbEnabled ? [TypeOrmModule.forFeature([StudentRequestTypeOrmEntity])] : [];

const studentRequestRepositoryProvider = {
  provide: STUDENT_REQUEST_REPOSITORY,
  useClass: isDbEnabled ? StudentRequestTypeOrmRepository : StudentRequestInMemoryRepository,
};

@Module({
  imports: persistenceImports,
  controllers: [StudentRequestController],
  providers: [StudentRequestService, studentRequestRepositoryProvider],
  exports: [StudentRequestService],
})
export class StudentRequestModule {}
