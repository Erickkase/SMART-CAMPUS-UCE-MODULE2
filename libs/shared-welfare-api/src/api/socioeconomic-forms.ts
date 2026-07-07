import { AxiosInstance } from 'axios';
import {
  CreateSocioeconomicFormPayload,
  SocioeconomicForm,
  UpdateSocioeconomicFormPayload,
} from '../types/socioeconomic-forms';

export async function getSocioeconomicForms(
  client: AxiosInstance,
): Promise<SocioeconomicForm[]> {
  const response = await client.get<SocioeconomicForm[]>('/socioeconomic-forms');
  return response.data;
}

export async function createSocioeconomicForm(
  client: AxiosInstance,
  payload: CreateSocioeconomicFormPayload,
): Promise<SocioeconomicForm> {
  const response = await client.post<SocioeconomicForm>(
    '/socioeconomic-forms',
    payload,
  );
  return response.data;
}

export async function getSocioeconomicFormById(
  client: AxiosInstance,
  id: string,
): Promise<SocioeconomicForm> {
  const response = await client.get<SocioeconomicForm>(
    `/socioeconomic-forms/${id}`,
  );
  return response.data;
}

export async function getSocioeconomicFormByStudentId(
  client: AxiosInstance,
  studentId: string,
): Promise<SocioeconomicForm> {
  const response = await client.get<SocioeconomicForm>(
    `/socioeconomic-forms/student/${studentId}`,
  );
  return response.data;
}

export async function updateSocioeconomicForm(
  client: AxiosInstance,
  id: string,
  payload: UpdateSocioeconomicFormPayload,
): Promise<SocioeconomicForm> {
  const response = await client.patch<SocioeconomicForm>(
    `/socioeconomic-forms/${id}`,
    payload,
  );
  return response.data;
}

export async function deleteSocioeconomicForm(
  client: AxiosInstance,
  id: string,
): Promise<void> {
  await client.delete(`/socioeconomic-forms/${id}`);
}
