import { CreateScholarshipDto } from '../dtos/create-scholarship.dto';

export class CreateScholarshipCommand {
  constructor(public readonly payload: CreateScholarshipDto) {}
}
