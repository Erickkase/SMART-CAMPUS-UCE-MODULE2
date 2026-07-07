import { UpdateScholarshipDto } from '../dtos/update-scholarship.dto';

export class UpdateScholarshipCommand {
  constructor(
    public readonly id: string,
    public readonly payload: UpdateScholarshipDto,
  ) {}
}
