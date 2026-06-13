import { Provider } from '@nestjs/common';
import { PSYCHOLOGICAL_APPOINTMENT_REPOSITORY } from '../../../../domain/repositories/psychological-appointment.repository';
import { PSYCHOLOGICAL_FOLLOW_UP_REPOSITORY } from '../../../../domain/repositories/psychological-follow-up.repository';
import { PSYCHOLOGICAL_REFERRAL_REPOSITORY } from '../../../../domain/repositories/psychological-referral.repository';
import { PSYCHOLOGICAL_REQUEST_REPOSITORY } from '../../../../domain/repositories/psychological-request.repository';
import { PsychologicalAppointmentTypeOrmRepository } from './psychological-appointment-typeorm.repository';
import { PsychologicalFollowUpTypeOrmRepository } from './psychological-follow-up-typeorm.repository';
import { PsychologicalReferralTypeOrmRepository } from './psychological-referral-typeorm.repository';
import { PsychologicalRequestTypeOrmRepository } from './psychological-request-typeorm.repository';

export const psychologicalRepositoryProviders: Provider[] = [
  {
    provide: PSYCHOLOGICAL_REQUEST_REPOSITORY,
    useClass: PsychologicalRequestTypeOrmRepository,
  },
  {
    provide: PSYCHOLOGICAL_APPOINTMENT_REPOSITORY,
    useClass: PsychologicalAppointmentTypeOrmRepository,
  },
  {
    provide: PSYCHOLOGICAL_FOLLOW_UP_REPOSITORY,
    useClass: PsychologicalFollowUpTypeOrmRepository,
  },
  {
    provide: PSYCHOLOGICAL_REFERRAL_REPOSITORY,
    useClass: PsychologicalReferralTypeOrmRepository,
  },
];
