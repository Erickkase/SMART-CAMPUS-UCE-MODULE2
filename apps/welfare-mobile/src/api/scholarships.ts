import {
  createScholarship,
  deleteScholarship,
  getScholarships,
  updateScholarshipStatus,
  type CreateScholarshipPayload,
  type Scholarship,
  type UpdateScholarshipStatusPayload,
} from '@smart-campus/shared-welfare-api';
import { welfareApi } from './welfare-client';

export type {
  Scholarship,
  CreateScholarshipPayload,
  UpdateScholarshipStatusPayload,
};

export async function getScholarshipsList(): Promise<Scholarship[]> {
  return getScholarships(welfareApi);
}

export async function createScholarshipRequest(
  payload: CreateScholarshipPayload,
): Promise<Scholarship> {
  return createScholarship(welfareApi, payload);
}

export async function changeScholarshipStatus(
  id: string,
  status: UpdateScholarshipStatusPayload,
): Promise<Scholarship> {
  return updateScholarshipStatus(welfareApi, id, status);
}

export async function removeScholarship(id: string): Promise<void> {
  return deleteScholarship(welfareApi, id);
}
