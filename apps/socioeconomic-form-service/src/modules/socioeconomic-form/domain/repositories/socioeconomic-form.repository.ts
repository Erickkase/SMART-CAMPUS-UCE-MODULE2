import { SocioeconomicForm } from '../entities/socioeconomic-form.entity';

export const SOCIOECONOMIC_FORM_REPOSITORY = 'SOCIOECONOMIC_FORM_REPOSITORY';

export interface UpdateSocioeconomicFormData {
  familyIncome?: number;
  housingType?: string;
  familyMembers?: number;
  employmentStatus?: string;
  vulnerabilityFactors?: string;
  observations?: string;
}

export interface SocioeconomicFormRepository {
  create(form: SocioeconomicForm): Promise<SocioeconomicForm>;
  findAll(): Promise<SocioeconomicForm[]>;
  findById(id: string): Promise<SocioeconomicForm | null>;
  findByStudentId(studentId: string): Promise<SocioeconomicForm | null>;
  update(
    id: string,
    data: UpdateSocioeconomicFormData,
  ): Promise<SocioeconomicForm | null>;
  delete(id: string): Promise<boolean>;
}
