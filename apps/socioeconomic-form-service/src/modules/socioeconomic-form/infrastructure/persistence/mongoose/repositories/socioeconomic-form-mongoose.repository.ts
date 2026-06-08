import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SocioeconomicForm } from '../../../../domain/entities/socioeconomic-form.entity';
import {
  SocioeconomicFormRepository,
  UpdateSocioeconomicFormData,
} from '../../../../domain/repositories/socioeconomic-form.repository';
import {
  SocioeconomicFormDocument,
  SocioeconomicFormSchema,
} from '../schemas/socioeconomic-form.schema';

@Injectable()
export class SocioeconomicFormMongooseRepository
  implements SocioeconomicFormRepository
{
  constructor(
    @InjectModel(SocioeconomicFormSchema.name)
    private readonly model: Model<SocioeconomicFormDocument>,
  ) {}

  async create(form: SocioeconomicForm): Promise<SocioeconomicForm> {
    const created = await this.model.create({
      _id: form.id,
      studentId: form.studentId,
      familyIncome: form.familyIncome,
      housingType: form.housingType,
      familyMembers: form.familyMembers,
      employmentStatus: form.employmentStatus,
      vulnerabilityFactors: form.vulnerabilityFactors,
      observations: form.observations,
    });

    return this.toDomain(created);
  }

  async findAll(): Promise<SocioeconomicForm[]> {
    const forms = await this.model.find().sort({ createdAt: -1 }).exec();
    return forms.map((form) => this.toDomain(form));
  }

  async findById(id: string): Promise<SocioeconomicForm | null> {
    const form = await this.model.findById(id).exec();
    return form ? this.toDomain(form) : null;
  }

  async findByStudentId(studentId: string): Promise<SocioeconomicForm | null> {
    const form = await this.model.findOne({ studentId }).exec();
    return form ? this.toDomain(form) : null;
  }

  async update(
    id: string,
    data: UpdateSocioeconomicFormData,
  ): Promise<SocioeconomicForm | null> {
    const updated = await this.model
      .findByIdAndUpdate(id, data, { new: true })
      .exec();

    return updated ? this.toDomain(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    return Boolean(deleted);
  }

  private toDomain(document: SocioeconomicFormDocument): SocioeconomicForm {
    return new SocioeconomicForm(
      document._id.toString(),
      document.studentId,
      document.familyIncome,
      document.housingType,
      document.familyMembers,
      document.employmentStatus,
      document.vulnerabilityFactors,
      document.observations,
      document.createdAt,
      document.updatedAt,
    );
  }
}
