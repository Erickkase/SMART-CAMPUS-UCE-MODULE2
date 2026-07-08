import type { SocioeconomicForm, CreateSocioeconomicFormPayload, UpdateSocioeconomicFormPayload } from '@smart-campus/shared-welfare-api';
import { apiClient } from './client';

export type { SocioeconomicForm, CreateSocioeconomicFormPayload, UpdateSocioeconomicFormPayload };

export async function getSocioeconomicForms(): Promise<SocioeconomicForm[]> {
  const res = await apiClient.get('/api/socioeconomic-forms');
  return res.data;
}

export async function getSocioeconomicFormByStudentId(studentId: string): Promise<SocioeconomicForm> {
  const res = await apiClient.get(`/api/socioeconomic-forms/student/${studentId}`);
  return res.data;
}

export async function createSocioeconomicForm(payload: CreateSocioeconomicFormPayload): Promise<SocioeconomicForm> {
  const res = await apiClient.post('/api/socioeconomic-forms', payload);
  return res.data;
}

export async function updateSocioeconomicForm(id: string, payload: UpdateSocioeconomicFormPayload): Promise<SocioeconomicForm> {
  const res = await apiClient.patch(`/api/socioeconomic-forms/${id}`, payload);
  return res.data;
}

export async function deleteSocioeconomicForm(id: string): Promise<void> {
  await apiClient.delete(`/api/socioeconomic-forms/${id}`);
}
