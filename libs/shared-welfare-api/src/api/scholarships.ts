import { AxiosInstance } from 'axios';
import {
  CreateScholarshipPayload,
  Scholarship,
  UpdateScholarshipStatusPayload,
} from '../types/scholarships';

export async function getScholarships(
  client: AxiosInstance,
): Promise<Scholarship[]> {
  const response = await client.get<Scholarship[]>('/scholarships');
  return response.data;
}

export async function getScholarshipById(
  client: AxiosInstance,
  id: string,
): Promise<Scholarship> {
  const response = await client.get<Scholarship>(`/scholarships/${id}`);
  return response.data;
}

export async function createScholarship(
  client: AxiosInstance,
  payload: CreateScholarshipPayload,
): Promise<Scholarship> {
  const response = await client.post<Scholarship>('/scholarships', payload);
  return response.data;
}

export async function updateScholarshipStatus(
  client: AxiosInstance,
  id: string,
  status: UpdateScholarshipStatusPayload,
): Promise<Scholarship> {
  const response = await client.patch<Scholarship>(
    `/scholarships/${id}/status`,
    { status },
  );
  return response.data;
}

export async function deleteScholarship(
  client: AxiosInstance,
  id: string,
): Promise<void> {
  await client.delete(`/scholarships/${id}`);
}
