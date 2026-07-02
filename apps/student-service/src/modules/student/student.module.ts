import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentService } from './application/services/student.service';
import { STUDENT_REPOSITORY } from './domain/repositories/student.repository';
import { StudentInMemoryRepository } from './infrastructure/persistence/in-memory/repositories/student-in-memory.repository';
import { StudentTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/student.typeorm-entity';
import { StudentTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/student-typeorm.repository';
import { StudentController } from './presentation/controllers/student.controller';

const isDbEnabled =
  (process.env.DB_ENABLED ??
    (process.env.NODE_ENV === 'production' ? 'true' : 'false')) === 'true';

const persistenceImports = isDbEnabled
  ? [TypeOrmModule.forFeature([StudentTypeOrmEntity])]
  : [];

const studentRepositoryProvider = {
  provide: STUDENT_REPOSITORY,
  useClass: isDbEnabled ? StudentTypeOrmRepository : StudentInMemoryRepository,
};

@Module({
  imports: persistenceImports,
  controllers: [StudentController],
  providers: [StudentService, studentRepositoryProvider],
  exports: [StudentService],
})
export class StudentModule {}
