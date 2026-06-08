import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocioeconomicFormService } from './application/services/socioeconomic-form.service';
import { SOCIOECONOMIC_FORM_REPOSITORY } from './domain/repositories/socioeconomic-form.repository';
import { SocioeconomicFormInMemoryRepository } from './infrastructure/persistence/in-memory/repositories/socioeconomic-form-in-memory.repository';
import { SocioeconomicFormMongooseRepository } from './infrastructure/persistence/mongoose/repositories/socioeconomic-form-mongoose.repository';
import {
  SocioeconomicFormMongooseSchema,
  SocioeconomicFormSchema,
} from './infrastructure/persistence/mongoose/schemas/socioeconomic-form.schema';
import { SocioeconomicFormController } from './presentation/controllers/socioeconomic-form.controller';

const isMongoEnabled =
  (process.env.MONGO_ENABLED ??
    (process.env.NODE_ENV === 'production' ? 'true' : 'false')) === 'true';

const persistenceImports = isMongoEnabled
  ? [
      MongooseModule.forFeature([
        {
          name: SocioeconomicFormSchema.name,
          schema: SocioeconomicFormMongooseSchema,
        },
      ]),
    ]
  : [];

const socioeconomicFormRepositoryProvider = {
  provide: SOCIOECONOMIC_FORM_REPOSITORY,
  useClass: isMongoEnabled
    ? SocioeconomicFormMongooseRepository
    : SocioeconomicFormInMemoryRepository,
};

@Module({
  imports: persistenceImports,
  controllers: [SocioeconomicFormController],
  providers: [SocioeconomicFormService, socioeconomicFormRepositoryProvider],
  exports: [SocioeconomicFormService],
})
export class SocioeconomicFormModule {}
