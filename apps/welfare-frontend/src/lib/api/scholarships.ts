import {
  createScholarship as createScholarshipBase,
  deleteScholarship as deleteScholarshipBase,
  getScholarships as getScholarshipsBase,
  updateScholarshipStatus as updateScholarshipStatusBase,
  type CreateScholarshipPayload,
  type Scholarship,
  type ScholarshipStatus,
  type UpdateScholarshipStatusPayload,
} from '@smart-campus/shared-welfare-api';
import { scholarshipApi } from './http-client';

export type {
  Scholarship,
  ScholarshipStatus,
  CreateScholarshipPayload,
  UpdateScholarshipStatusPayload,
};

export async function getScholarships(): Promise<Scholarship[]> {
  return getScholarshipsBase(scholarshipApi);
}

export async function createScholarship(
  payload: CreateScholarshipPayload,
): Promise<Scholarship> {
  return createScholarshipBase(scholarshipApi, payload);
}

export async function updateScholarshipStatus(
  id: string,
  status: UpdateScholarshipStatusPayload,
): Promise<Scholarship> {
  return updateScholarshipStatusBase(scholarshipApi, id, status);
}

export async function deleteScholarship(id: string): Promise<void> {
  return deleteScholarshipBase(scholarshipApi, id);
}
