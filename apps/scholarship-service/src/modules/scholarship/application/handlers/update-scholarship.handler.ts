import { Injectable } from '@nestjs/common';
import { Scholarship } from '../../domain/entities/scholarship.entity';
import { ScholarshipService } from '../services/scholarship.service';
import { UpdateScholarshipCommand } from '../commands/update-scholarship.command';

@Injectable()
export class UpdateScholarshipHandler {
  constructor(private readonly scholarshipService: ScholarshipService) {}

  execute(command: UpdateScholarshipCommand): Promise<Scholarship> {
    return this.scholarshipService.updateScholarship(command.id, command.payload);
  }
}
