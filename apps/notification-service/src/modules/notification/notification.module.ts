import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './application/services/notification.service';
import { NOTIFICATION_REPOSITORY } from './domain/repositories/notification.repository';
import { NotificationInMemoryRepository } from './infrastructure/persistence/in-memory/notification-in-memory.repository';
import { NotificationTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/notification.typeorm-entity';
import { NotificationTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/notification-typeorm.repository';
import { NotificationController } from './presentation/controllers/notification.controller';

const isDbEnabled =
  (process.env.DB_ENABLED ??
    (process.env.NODE_ENV === 'production' ? 'true' : 'false')) === 'true';

const persistenceImports = isDbEnabled
  ? [TypeOrmModule.forFeature([NotificationTypeOrmEntity])]
  : [];

const notificationRepositoryProvider = {
  provide: NOTIFICATION_REPOSITORY,
  useClass: isDbEnabled ? NotificationTypeOrmRepository : NotificationInMemoryRepository,
};

@Module({
  imports: persistenceImports,
  controllers: [NotificationController],
  providers: [NotificationService, notificationRepositoryProvider],
  exports: [NotificationService],
})
export class NotificationModule {}
