import { Injectable } from '@nestjs/common';
import { Scholarship } from '../../domain/entities/scholarship.entity';
import { GetScholarshipByIdQuery } from '../queries/get-scholarship-by-id.query';
import { ScholarshipService } from '../services/scholarship.service';

@Injectable()
export class GetScholarshipByIdHandler {
  constructor(private readonly scholarshipService: ScholarshipService) {}

  execute(query: GetScholarshipByIdQuery): Promise<Scholarship> {
    return this.scholarshipService.getScholarshipById(query.id);
  }
}
