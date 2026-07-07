import { UpdateScholarshipStatusDto } from '../dtos/update-scholarship-status.dto';

export class UpdateScholarshipStatusCommand {
  constructor(
    public readonly id: string,
    public readonly payload: UpdateScholarshipStatusDto,
  ) {}
}
