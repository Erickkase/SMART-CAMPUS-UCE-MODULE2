import {
  createSocioeconomicForm,
  deleteSocioeconomicForm,
  getSocioeconomicFormById,
  getSocioeconomicForms,
  updateSocioeconomicForm,
  type CreateSocioeconomicFormPayload,
  type SocioeconomicForm,
  type UpdateSocioeconomicFormPayload,
} from '@smart-campus/shared-welfare-api';
import { welfareApi } from './welfare-client';

export type {
  SocioeconomicForm,
  CreateSocioeconomicFormPayload,
  UpdateSocioeconomicFormPayload,
};

export async function getSocioeconomicFormsList(): Promise<SocioeconomicForm[]> {
  return getSocioeconomicForms(welfareApi);
}

export async function createSocioeconomicFormRequest(
  payload: CreateSocioeconomicFormPayload,
): Promise<SocioeconomicForm> {
  return createSocioeconomicForm(welfareApi, payload);
}

export async function getSocioeconomicFormDetail(
  id: string,
): Promise<SocioeconomicForm> {
  return getSocioeconomicFormById(welfareApi, id);
}

export async function updateSocioeconomicFormRequest(
  id: string,
  payload: UpdateSocioeconomicFormPayload,
): Promise<SocioeconomicForm> {
  return updateSocioeconomicForm(welfareApi, id, payload);
}

export async function removeSocioeconomicForm(id: string): Promise<void> {
  return deleteSocioeconomicForm(welfareApi, id);
}
