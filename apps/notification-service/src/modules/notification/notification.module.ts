import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './application/services/notification.service';
import { OutboxProcessorService } from './application/services/outbox-processor.service';
import { NOTIFICATION_REPOSITORY } from './domain/repositories/notification.repository';
import { OUTBOX_REPOSITORY } from './domain/repositories/outbox.repository';
import { NotificationInMemoryRepository } from './infrastructure/persistence/in-memory/notification-in-memory.repository';
import { OutboxInMemoryRepository } from './infrastructure/persistence/in-memory/outbox-in-memory.repository';
import { NotificationTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/notification.typeorm-entity';
import { OutboxEventTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/outbox-event.typeorm-entity';
import { NotificationTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/notification-typeorm.repository';
import { OutboxTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/outbox-typeorm.repository';
import { NotificationController } from './presentation/controllers/notification.controller';

const isDbEnabled =
  (process.env.DB_ENABLED ??
    (process.env.NODE_ENV === 'production' ? 'true' : 'false')) === 'true';

const persistenceImports = isDbEnabled
  ? [TypeOrmModule.forFeature([NotificationTypeOrmEntity, OutboxEventTypeOrmEntity])]
  : [];

const notificationRepositoryProvider = {
  provide: NOTIFICATION_REPOSITORY,
  useClass: isDbEnabled ? NotificationTypeOrmRepository : NotificationInMemoryRepository,
};

const outboxRepositoryProvider = {
  provide: OUTBOX_REPOSITORY,
  useClass: isDbEnabled ? OutboxTypeOrmRepository : OutboxInMemoryRepository,
};

@Module({
  imports: persistenceImports,
  controllers: [NotificationController],
  providers: [
    NotificationService,
    OutboxProcessorService,
    notificationRepositoryProvider,
    outboxRepositoryProvider,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
