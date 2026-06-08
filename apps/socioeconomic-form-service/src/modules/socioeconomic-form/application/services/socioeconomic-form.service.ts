import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SocioeconomicForm } from '../../domain/entities/socioeconomic-form.entity';
import {
  SOCIOECONOMIC_FORM_REPOSITORY,
  SocioeconomicFormRepository,
  UpdateSocioeconomicFormData,
} from '../../domain/repositories/socioeconomic-form.repository';
import { CreateSocioeconomicFormDto } from '../dtos/create-socioeconomic-form.dto';
import { UpdateSocioeconomicFormDto } from '../dtos/update-socioeconomic-form.dto';

@Injectable()
export class SocioeconomicFormService {
  constructor(
    @Inject(SOCIOECONOMIC_FORM_REPOSITORY)
    private readonly socioeconomicFormRepository: SocioeconomicFormRepository,
  ) {}

  async createSocioeconomicForm(
    createDto: CreateSocioeconomicFormDto,
  ): Promise<SocioeconomicForm> {
    const now = new Date();

    const form = new SocioeconomicForm(
      randomUUID(),
      createDto.studentId,
      createDto.familyIncome,
      createDto.housingType,
      createDto.familyMembers,
      createDto.employmentStatus,
      createDto.vulnerabilityFactors,
      createDto.observations,
      now,
      now,
    );

    return this.socioeconomicFormRepository.create(form);
  }

  async getSocioeconomicForms(): Promise<SocioeconomicForm[]> {
    return this.socioeconomicFormRepository.findAll();
  }

  async getSocioeconomicFormById(id: string): Promise<SocioeconomicForm> {
    const form = await this.socioeconomicFormRepository.findById(id);
    if (!form) {
      throw new NotFoundException(`Socioeconomic form with id ${id} was not found`);
    }

    return form;
  }

  async getSocioeconomicFormByStudentId(
    studentId: string,
  ): Promise<SocioeconomicForm> {
    const form = await this.socioeconomicFormRepository.findByStudentId(studentId);
    if (!form) {
      throw new NotFoundException(
        `Socioeconomic form for student ${studentId} was not found`,
      );
    }

    return form;
  }

  async updateSocioeconomicForm(
    id: string,
    updateDto: UpdateSocioeconomicFormDto,
  ): Promise<SocioeconomicForm> {
    await this.getSocioeconomicFormById(id);

    const updateData: UpdateSocioeconomicFormData = {
      familyIncome: updateDto.familyIncome,
      housingType: updateDto.housingType,
      familyMembers: updateDto.familyMembers,
      employmentStatus: updateDto.employmentStatus,
      vulnerabilityFactors: updateDto.vulnerabilityFactors,
      observations: updateDto.observations,
    };

    const updatedForm = await this.socioeconomicFormRepository.update(id, updateData);
    if (!updatedForm) {
      throw new NotFoundException(`Socioeconomic form with id ${id} was not found`);
    }

    return updatedForm;
  }

  async deleteSocioeconomicForm(id: string): Promise<void> {
    await this.getSocioeconomicFormById(id);

    const deleted = await this.socioeconomicFormRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Socioeconomic form with id ${id} was not found`);
    }
  }
}
