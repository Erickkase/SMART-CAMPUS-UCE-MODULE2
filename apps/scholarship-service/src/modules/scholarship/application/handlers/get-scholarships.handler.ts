import { Injectable } from '@nestjs/common';
import { Scholarship } from '../../domain/entities/scholarship.entity';
import { GetScholarshipsQuery } from '../queries/get-scholarships.query';
import { ScholarshipService } from '../services/scholarship.service';

@Injectable()
export class GetScholarshipsHandler {
  constructor(private readonly scholarshipService: ScholarshipService) {}

  execute(_query: GetScholarshipsQuery): Promise<Scholarship[]> {
    return this.scholarshipService.getScholarships();
  }
}
