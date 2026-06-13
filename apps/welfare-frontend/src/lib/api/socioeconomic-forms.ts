import { socioeconomicApi } from './http-client';

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

export async function getSocioeconomicForms(): Promise<SocioeconomicForm[]> {
  const response = await socioeconomicApi.get<SocioeconomicForm[]>(
    '/socioeconomic-forms',
  );
  return response.data;
}

export async function createSocioeconomicForm(
  payload: CreateSocioeconomicFormPayload,
): Promise<SocioeconomicForm> {
  const response = await socioeconomicApi.post<SocioeconomicForm>(
    '/socioeconomic-forms',
    payload,
  );
  return response.data;
}

export async function getSocioeconomicFormById(
  id: string,
): Promise<SocioeconomicForm> {
  const response = await socioeconomicApi.get<SocioeconomicForm>(
    `/socioeconomic-forms/${id}`,
  );
  return response.data;
}

export async function getSocioeconomicFormByStudentId(
  studentId: string,
): Promise<SocioeconomicForm> {
  const response = await socioeconomicApi.get<SocioeconomicForm>(
    `/socioeconomic-forms/student/${studentId}`,
  );
  return response.data;
}

export async function updateSocioeconomicForm(
  id: string,
  payload: UpdateSocioeconomicFormPayload,
): Promise<SocioeconomicForm> {
  const response = await socioeconomicApi.patch<SocioeconomicForm>(
    `/socioeconomic-forms/${id}`,
    payload,
  );
  return response.data;
}

export async function deleteSocioeconomicForm(id: string): Promise<void> {
  await socioeconomicApi.delete(`/socioeconomic-forms/${id}`);
}
