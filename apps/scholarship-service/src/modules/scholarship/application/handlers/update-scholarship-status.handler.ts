import { Injectable } from '@nestjs/common';
import { Scholarship } from '../../domain/entities/scholarship.entity';
import { ScholarshipService } from '../services/scholarship.service';
import { UpdateScholarshipStatusCommand } from '../commands/update-scholarship-status.command';

@Injectable()
export class UpdateScholarshipStatusHandler {
  constructor(private readonly scholarshipService: ScholarshipService) {}

  execute(command: UpdateScholarshipStatusCommand): Promise<Scholarship> {
    return this.scholarshipService.updateScholarshipStatus(
      command.id,
      command.payload,
    );
  }
}
