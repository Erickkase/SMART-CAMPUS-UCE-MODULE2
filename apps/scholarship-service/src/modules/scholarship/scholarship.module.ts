import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SCHOLARSHIP_REPOSITORY } from './domain/repositories/scholarship.repository';
import { SCHOLARSHIP_OUTBOX_REPOSITORY } from './domain/repositories/scholarship-outbox.repository';
import { CreateScholarshipHandler } from './application/handlers/create-scholarship.handler';
import { DeleteScholarshipHandler } from './application/handlers/delete-scholarship.handler';
import { GetScholarshipByIdHandler } from './application/handlers/get-scholarship-by-id.handler';
import { GetScholarshipsHandler } from './application/handlers/get-scholarships.handler';
import { ScholarshipService } from './application/services/scholarship.service';
import { UpdateScholarshipHandler } from './application/handlers/update-scholarship.handler';
import { UpdateScholarshipStatusHandler } from './application/handlers/update-scholarship-status.handler';
import { ScholarshipTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/scholarship.typeorm-entity';
import { ScholarshipInMemoryRepository } from './infrastructure/persistence/in-memory/repositories/scholarship-in-memory.repository';
import { ScholarshipMqttPublisherService } from './infrastructure/messaging/scholarship-mqtt-publisher.service';
import { ScholarshipKafkaProducerService } from './infrastructure/messaging/scholarship-kafka-producer.service';
import { ScholarshipRabbitMqPublisherService } from './infrastructure/messaging/scholarship-rabbitmq-publisher.service';
import { ScholarshipOutboxInMemoryRepository } from './infrastructure/persistence/in-memory/repositories/scholarship-outbox-in-memory.repository';
import { ScholarshipCacheService } from './infrastructure/cache/scholarship-cache.service';
import { ScholarshipOutboxTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/scholarship-outbox.typeorm-entity';
import { ScholarshipOutboxTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/scholarship-outbox-typeorm.repository';
import { ScholarshipTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/scholarship-typeorm.repository';
import { ScholarshipOutboxDispatcherService } from './infrastructure/outbox/scholarship-outbox-dispatcher.service';
import { ScholarshipController } from './presentation/controllers/scholarship.controller';

const isDbEnabled =
  (process.env.DB_ENABLED ??
    (process.env.NODE_ENV === 'production' ? 'true' : 'false')) === 'true';

const persistenceImports = isDbEnabled
  ? [
      TypeOrmModule.forFeature([
        ScholarshipTypeOrmEntity,
        ScholarshipOutboxTypeOrmEntity,
      ]),
    ]
  : [];

const scholarshipRepositoryProvider = {
  provide: SCHOLARSHIP_REPOSITORY,
  useClass: isDbEnabled
    ? ScholarshipTypeOrmRepository
    : ScholarshipInMemoryRepository,
};

const scholarshipOutboxRepositoryProvider = {
  provide: SCHOLARSHIP_OUTBOX_REPOSITORY,
  useClass: isDbEnabled
    ? ScholarshipOutboxTypeOrmRepository
    : ScholarshipOutboxInMemoryRepository,
};

@Module({
  imports: persistenceImports,
  controllers: [ScholarshipController],
  providers: [
    ScholarshipService,
    ScholarshipCacheService,
    ScholarshipMqttPublisherService,
    ScholarshipKafkaProducerService,
    ScholarshipRabbitMqPublisherService,
    ScholarshipOutboxDispatcherService,
    CreateScholarshipHandler,
    GetScholarshipsHandler,
    GetScholarshipByIdHandler,
    UpdateScholarshipHandler,
    UpdateScholarshipStatusHandler,
    DeleteScholarshipHandler,
    scholarshipRepositoryProvider,
    scholarshipOutboxRepositoryProvider,
  ],
  exports: [ScholarshipService],
})
export class ScholarshipModule {}
