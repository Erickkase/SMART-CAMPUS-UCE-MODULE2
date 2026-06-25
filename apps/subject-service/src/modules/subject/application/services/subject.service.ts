import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateSubjectDto } from '../dtos/create-subject.dto';
import { UpdateSubjectDto } from '../dtos/update-subject.dto';
import { Subject } from '../../domain/entities/subject.entity';
import {
  SUBJECT_REPOSITORY,
  SubjectRepository,
  UpdateSubjectData,
} from '../../domain/repositories/subject.repository';

@Injectable()
export class SubjectService {
  constructor(
    @Inject(SUBJECT_REPOSITORY)
    private readonly subjectRepository: SubjectRepository,
  ) {}

  async createSubject(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const now = new Date();
    const subject = new Subject(
      randomUUID(),
      createSubjectDto.code,
      createSubjectDto.name,
      createSubjectDto.credits,
      createSubjectDto.academicLevel,
      createSubjectDto.isActive,
      now,
      now,
    );

    return this.subjectRepository.create(subject);
  }

  async getSubjects(): Promise<Subject[]> {
    return this.subjectRepository.findAll();
  }

  async getSubjectById(id: string): Promise<Subject> {
    const subject = await this.subjectRepository.findById(id);

    if (!subject) {
      throw new NotFoundException(`Subject with id ${id} was not found`);
    }

    return subject;
  }

  async updateSubject(id: string, updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    await this.getSubjectById(id);

    const updateData: UpdateSubjectData = {
      code: updateSubjectDto.code,
      name: updateSubjectDto.name,
      credits: updateSubjectDto.credits,
      academicLevel: updateSubjectDto.academicLevel,
      isActive: updateSubjectDto.isActive,
    };

    const updatedSubject = await this.subjectRepository.update(id, updateData);

    if (!updatedSubject) {
      throw new NotFoundException(`Subject with id ${id} was not found`);
    }

    return updatedSubject;
  }

  async deleteSubject(id: string): Promise<void> {
    await this.getSubjectById(id);

    const deleted = await this.subjectRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Subject with id ${id} was not found`);
    }
  }
}
