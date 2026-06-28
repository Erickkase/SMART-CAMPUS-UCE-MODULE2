import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateScholarshipDto } from '../dtos/create-scholarship.dto';
import { UpdateScholarshipDto } from '../dtos/update-scholarship.dto';
import { UpdateScholarshipStatusDto } from '../dtos/update-scholarship-status.dto';
import { Scholarship } from '../../domain/entities/scholarship.entity';
import {
  SCHOLARSHIP_REPOSITORY,
  ScholarshipRepository,
  UpdateScholarshipData,
} from '../../domain/repositories/scholarship.repository';
import { ScholarshipStatus } from '../../domain/enums/scholarship-status.enum';
import { ScholarshipMqttPublisherService } from '../../infrastructure/messaging/scholarship-mqtt-publisher.service';

@Injectable()
export class ScholarshipService {
  constructor(
    @Inject(SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: ScholarshipRepository,
    private readonly scholarshipMqttPublisher: ScholarshipMqttPublisherService,
  ) {}

  async createScholarship(
    createScholarshipDto: CreateScholarshipDto,
  ): Promise<Scholarship> {
    const now = new Date();

    const scholarship = new Scholarship(
      randomUUID(),
      createScholarshipDto.studentId,
      createScholarshipDto.scholarshipType,
      createScholarshipDto.reason,
      ScholarshipStatus.PENDING,
      now,
      now,
    );

    const createdScholarship = await this.scholarshipRepository.create(scholarship);
    await this.scholarshipMqttPublisher.publishScholarshipCreated(createdScholarship);
    return createdScholarship;
  }

  async getScholarships(): Promise<Scholarship[]> {
    return this.scholarshipRepository.findAll();
  }

  async getScholarshipById(id: string): Promise<Scholarship> {
    const scholarship = await this.scholarshipRepository.findById(id);

    if (!scholarship) {
      throw new NotFoundException(`Scholarship with id ${id} was not found`);
    }

    return scholarship;
  }

  async updateScholarship(
    id: string,
    updateScholarshipDto: UpdateScholarshipDto,
  ): Promise<Scholarship> {
    await this.getScholarshipById(id);

    const updateData: UpdateScholarshipData = {
      studentId: updateScholarshipDto.studentId,
      scholarshipType: updateScholarshipDto.scholarshipType,
      reason: updateScholarshipDto.reason,
    };

    const updatedScholarship = await this.scholarshipRepository.update(
      id,
      updateData,
    );

    if (!updatedScholarship) {
      throw new NotFoundException(`Scholarship with id ${id} was not found`);
    }

    return updatedScholarship;
  }

  async updateScholarshipStatus(
    id: string,
    updateScholarshipStatusDto: UpdateScholarshipStatusDto,
  ): Promise<Scholarship> {
    const scholarship = await this.getScholarshipById(id);
    const { status } = updateScholarshipStatusDto;

    const allowedTargetStatuses = [
      ScholarshipStatus.APPROVED,
      ScholarshipStatus.REJECTED,
    ];

    if (!allowedTargetStatuses.includes(status)) {
      throw new BadRequestException(
        'Status update only allows APPROVED or REJECTED',
      );
    }

    if (
      scholarship.status === ScholarshipStatus.APPROVED ||
      scholarship.status === ScholarshipStatus.REJECTED
    ) {
      throw new BadRequestException(
        `Cannot change status from ${scholarship.status}`,
      );
    }

    const updatedScholarship = await this.scholarshipRepository.updateStatus(
      id,
      status,
    );

    if (!updatedScholarship) {
      throw new NotFoundException(`Scholarship with id ${id} was not found`);
    }

    await this.scholarshipMqttPublisher.publishScholarshipStatusUpdated(
      updatedScholarship,
    );

    return updatedScholarship;
  }

  async deleteScholarship(id: string): Promise<void> {
    await this.getScholarshipById(id);

    const deleted = await this.scholarshipRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Scholarship with id ${id} was not found`);
    }
  }
}
