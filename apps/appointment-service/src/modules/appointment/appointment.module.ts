import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APPOINTMENT_REPOSITORY } from './domain/repositories/appointment.repository';
import { AppointmentService } from './application/services/appointment.service';
import { AppointmentTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/appointment.typeorm-entity';
import { AppointmentInMemoryRepository } from './infrastructure/persistence/in-memory/repositories/appointment-in-memory.repository';
import { AppointmentTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/appointment-typeorm.repository';
import { StudentServiceClient } from './infrastructure/clients/student-service.client';
import { AppointmentController } from './presentation/controllers/appointment.controller';

const isDbEnabled =
  (process.env.DB_ENABLED ??
    (process.env.NODE_ENV === 'production' ? 'true' : 'false')) === 'true';

const persistenceImports = isDbEnabled
  ? [TypeOrmModule.forFeature([AppointmentTypeOrmEntity])]
  : [];

const appointmentRepositoryProvider = {
  provide: APPOINTMENT_REPOSITORY,
  useClass: isDbEnabled
    ? AppointmentTypeOrmRepository
    : AppointmentInMemoryRepository,
};

@Module({
  imports: persistenceImports,
  controllers: [AppointmentController],
  providers: [AppointmentService, appointmentRepositoryProvider, StudentServiceClient],
  exports: [AppointmentService],
})
export class AppointmentModule {}
