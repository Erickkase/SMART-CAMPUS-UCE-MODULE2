export interface SocioeconomicForm {
  id: string;
  studentId: string;
  familyIncome: number;
  housingType: string;
  familyMembers: number;
  employmentStatus: string;
  vulnerabilityFactors: string;
  observations: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSocioeconomicFormPayload {
  studentId: string;
  familyIncome: number;
  housingType: string;
  familyMembers: number;
  employmentStatus: string;
  vulnerabilityFactors: string;
  observations: string;
}

export type UpdateSocioeconomicFormPayload = Partial<
  Omit<CreateSocioeconomicFormPayload, 'studentId'>
>;
