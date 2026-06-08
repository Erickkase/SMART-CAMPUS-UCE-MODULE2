import { Injectable } from '@nestjs/common';
import { SocioeconomicForm } from '../../../../domain/entities/socioeconomic-form.entity';
import {
  SocioeconomicFormRepository,
  UpdateSocioeconomicFormData,
} from '../../../../domain/repositories/socioeconomic-form.repository';

@Injectable()
export class SocioeconomicFormInMemoryRepository
  implements SocioeconomicFormRepository
{
  private readonly forms = new Map<string, SocioeconomicForm>();

  async create(form: SocioeconomicForm): Promise<SocioeconomicForm> {
    this.forms.set(form.id, form);
    return form;
  }

  async findAll(): Promise<SocioeconomicForm[]> {
    return Array.from(this.forms.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  async findById(id: string): Promise<SocioeconomicForm | null> {
    return this.forms.get(id) ?? null;
  }

  async findByStudentId(studentId: string): Promise<SocioeconomicForm | null> {
    return (
      Array.from(this.forms.values()).find((form) => form.studentId === studentId) ??
      null
    );
  }

  async update(
    id: string,
    data: UpdateSocioeconomicFormData,
  ): Promise<SocioeconomicForm | null> {
    const existing = this.forms.get(id);
    if (!existing) {
      return null;
    }

    if (data.familyIncome !== undefined) {
      existing.familyIncome = data.familyIncome;
    }
    if (data.housingType !== undefined) {
      existing.housingType = data.housingType;
    }
    if (data.familyMembers !== undefined) {
      existing.familyMembers = data.familyMembers;
    }
    if (data.employmentStatus !== undefined) {
      existing.employmentStatus = data.employmentStatus;
    }
    if (data.vulnerabilityFactors !== undefined) {
      existing.vulnerabilityFactors = data.vulnerabilityFactors;
    }
    if (data.observations !== undefined) {
      existing.observations = data.observations;
    }
    existing.updatedAt = new Date();

    this.forms.set(id, existing);
    return existing;
  }

  async delete(id: string): Promise<boolean> {
    return this.forms.delete(id);
  }
}
