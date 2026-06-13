import { scholarshipApi } from './http-client';

export type ScholarshipStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export interface Scholarship {
  id: string;
  studentId: string;
  scholarshipType: string;
  reason: string;
  status: ScholarshipStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScholarshipPayload {
  studentId: string;
  scholarshipType: string;
  reason: string;
  status: ScholarshipStatus;
}

export async function getScholarships(): Promise<Scholarship[]> {
  const response = await scholarshipApi.get<Scholarship[]>('/scholarships');
  return response.data;
}

export async function createScholarship(
  payload: CreateScholarshipPayload,
): Promise<Scholarship> {
  const response = await scholarshipApi.post<Scholarship>('/scholarships', payload);
  return response.data;
}

export async function updateScholarshipStatus(
  id: string,
  status: Extract<ScholarshipStatus, 'APPROVED' | 'REJECTED'>,
): Promise<Scholarship> {
  const response = await scholarshipApi.patch<Scholarship>(
    `/scholarships/${id}/status`,
    { status },
  );
  return response.data;
}

export async function deleteScholarship(id: string): Promise<void> {
  await scholarshipApi.delete(`/scholarships/${id}`);
}
