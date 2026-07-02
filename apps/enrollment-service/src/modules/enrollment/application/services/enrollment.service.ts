import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateEnrollmentDto } from '../dtos/create-enrollment.dto';
import { UpdateEnrollmentDto } from '../dtos/update-enrollment.dto';
import { Enrollment } from '../../domain/entities/enrollment.entity';
import { EnrollmentStatus } from '../../domain/enums/enrollment-status.enum';
import {
  ENROLLMENT_REPOSITORY,
  EnrollmentRepository,
  UpdateEnrollmentData,
} from '../../domain/repositories/enrollment.repository';

@Injectable()
export class EnrollmentService {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepository: EnrollmentRepository,
  ) {}

  async createEnrollment(
    createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<Enrollment> {
    const now = new Date();
    const enrollment = new Enrollment(
      randomUUID(),
      createEnrollmentDto.studentId,
      createEnrollmentDto.subjectId,
      createEnrollmentDto.academicPeriod,
      EnrollmentStatus.ENROLLED,
      now,
      now,
    );

    return this.enrollmentRepository.create(enrollment);
  }

  async getEnrollments(): Promise<Enrollment[]> {
    return this.enrollmentRepository.findAll();
  }

  async getEnrollmentById(id: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findById(id);

    if (!enrollment) {
      throw new NotFoundException(`Enrollment with id ${id} was not found`);
    }

    return enrollment;
  }

  async getEnrollmentsByStudentId(studentId: string): Promise<Enrollment[]> {
    const enrollments = await this.enrollmentRepository.findByStudentId(studentId);

    if (enrollments.length === 0) {
      throw new NotFoundException(`Enrollments for student ${studentId} were not found`);
    }

    return enrollments;
  }

  async getEnrollmentsBySubjectId(subjectId: string): Promise<Enrollment[]> {
    const enrollments = await this.enrollmentRepository.findBySubjectId(subjectId);

    if (enrollments.length === 0) {
      throw new NotFoundException(`Enrollments for subject ${subjectId} were not found`);
    }

    return enrollments;
  }

  async updateEnrollment(
    id: string,
    updateEnrollmentDto: UpdateEnrollmentDto,
  ): Promise<Enrollment> {
    await this.getEnrollmentById(id);

    const updateData: UpdateEnrollmentData = {
      academicPeriod: updateEnrollmentDto.academicPeriod,
      status: updateEnrollmentDto.status,
    };

    const updatedEnrollment = await this.enrollmentRepository.update(id, updateData);

    if (!updatedEnrollment) {
      throw new NotFoundException(`Enrollment with id ${id} was not found`);
    }

    return updatedEnrollment;
  }

  async deleteEnrollment(id: string): Promise<void> {
    await this.getEnrollmentById(id);

    const deleted = await this.enrollmentRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Enrollment with id ${id} was not found`);
    }
  }
}
