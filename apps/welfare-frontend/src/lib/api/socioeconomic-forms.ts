import {
  createSocioeconomicForm as createSocioeconomicFormBase,
  deleteSocioeconomicForm as deleteSocioeconomicFormBase,
  getSocioeconomicFormById as getSocioeconomicFormByIdBase,
  getSocioeconomicFormByStudentId as getSocioeconomicFormByStudentIdBase,
  getSocioeconomicForms as getSocioeconomicFormsBase,
  updateSocioeconomicForm as updateSocioeconomicFormBase,
  type CreateSocioeconomicFormPayload,
  type SocioeconomicForm,
  type UpdateSocioeconomicFormPayload,
} from '@smart-campus/shared-welfare-api';
import { socioeconomicApi } from './http-client';

export type {
  SocioeconomicForm,
  CreateSocioeconomicFormPayload,
  UpdateSocioeconomicFormPayload,
};

export async function getSocioeconomicForms(): Promise<SocioeconomicForm[]> {
  return getSocioeconomicFormsBase(socioeconomicApi);
}

export async function createSocioeconomicForm(
  payload: CreateSocioeconomicFormPayload,
): Promise<SocioeconomicForm> {
  return createSocioeconomicFormBase(socioeconomicApi, payload);
}

export async function getSocioeconomicFormById(
  id: string,
): Promise<SocioeconomicForm> {
  return getSocioeconomicFormByIdBase(socioeconomicApi, id);
}

export async function getSocioeconomicFormByStudentId(
  studentId: string,
): Promise<SocioeconomicForm> {
  return getSocioeconomicFormByStudentIdBase(socioeconomicApi, studentId);
}

export async function updateSocioeconomicForm(
  id: string,
  payload: UpdateSocioeconomicFormPayload,
): Promise<SocioeconomicForm> {
  return updateSocioeconomicFormBase(socioeconomicApi, id, payload);
}

export async function deleteSocioeconomicForm(id: string): Promise<void> {
  return deleteSocioeconomicFormBase(socioeconomicApi, id);
}
