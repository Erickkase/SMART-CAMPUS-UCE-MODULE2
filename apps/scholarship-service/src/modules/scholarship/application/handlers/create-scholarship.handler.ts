import { Injectable } from '@nestjs/common';
import { Scholarship } from '../../domain/entities/scholarship.entity';
import { ScholarshipService } from '../services/scholarship.service';
import { CreateScholarshipCommand } from '../commands/create-scholarship.command';

@Injectable()
export class CreateScholarshipHandler {
  constructor(private readonly scholarshipService: ScholarshipService) {}

  execute(command: CreateScholarshipCommand): Promise<Scholarship> {
    return this.scholarshipService.createScholarship(command.payload);
  }
}
