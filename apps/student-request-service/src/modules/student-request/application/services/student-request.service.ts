import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { StudentRequest } from '../../domain/entities/student-request.entity';
import { StudentRequestStatus } from '../../domain/enums/student-request-status.enum';
import { STUDENT_REQUEST_REPOSITORY, StudentRequestRepository, UpdateStudentRequestData } from '../../domain/repositories/student-request.repository';
import { CreateStudentRequestDto } from '../dtos/create-student-request.dto';
import { UpdateStudentRequestDto } from '../dtos/update-student-request.dto';

@Injectable()
export class StudentRequestService {
  constructor(
    @Inject(STUDENT_REQUEST_REPOSITORY)
    private readonly studentRequestRepository: StudentRequestRepository,
  ) {}

  async createStudentRequest(createDto: CreateStudentRequestDto): Promise<StudentRequest> {
    const now = new Date();
    const studentRequest = new StudentRequest(
      randomUUID(),
      createDto.studentId,
      createDto.requestType,
      createDto.title,
      createDto.description,
      createDto.priority,
      StudentRequestStatus.PENDING,
      now,
      now,
    );

    return this.studentRequestRepository.create(studentRequest);
  }

  async getStudentRequests(): Promise<StudentRequest[]> {
    return this.studentRequestRepository.findAll();
  }

  async getStudentRequestById(id: string): Promise<StudentRequest> {
    const studentRequest = await this.studentRequestRepository.findById(id);
    if (!studentRequest) {
      throw new NotFoundException(`Student request with id ${id} was not found`);
    }

    return studentRequest;
  }

  async getStudentRequestsByStudentId(studentId: string): Promise<StudentRequest[]> {
    return this.studentRequestRepository.findByStudentId(studentId);
  }

  async updateStudentRequest(id: string, updateDto: UpdateStudentRequestDto): Promise<StudentRequest> {
    await this.getStudentRequestById(id);

    const updateData: UpdateStudentRequestData = {
      studentId: updateDto.studentId,
      requestType: updateDto.requestType,
      title: updateDto.title,
      description: updateDto.description,
      priority: updateDto.priority,
    };

    const updated = await this.studentRequestRepository.update(id, updateData);
    if (!updated) {
      throw new NotFoundException(`Student request with id ${id} was not found`);
    }

    return updated;
  }

  async updateStudentRequestStatus(id: string, status: StudentRequestStatus): Promise<StudentRequest> {
    await this.getStudentRequestById(id);

    const updated = await this.studentRequestRepository.updateStatus(id, status);
    if (!updated) {
      throw new NotFoundException(`Student request with id ${id} was not found`);
    }

    return updated;
  }

  async deleteStudentRequest(id: string): Promise<void> {
    await this.getStudentRequestById(id);

    const deleted = await this.studentRequestRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Student request with id ${id} was not found`);
    }
  }
}
