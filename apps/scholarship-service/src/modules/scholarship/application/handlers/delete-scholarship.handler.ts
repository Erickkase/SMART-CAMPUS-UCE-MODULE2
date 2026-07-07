import { Injectable } from '@nestjs/common';
import { ScholarshipService } from '../services/scholarship.service';
import { DeleteScholarshipCommand } from '../commands/delete-scholarship.command';

@Injectable()
export class DeleteScholarshipHandler {
  constructor(private readonly scholarshipService: ScholarshipService) {}

  execute(command: DeleteScholarshipCommand): Promise<void> {
    return this.scholarshipService.deleteScholarship(command.id);
  }
}
