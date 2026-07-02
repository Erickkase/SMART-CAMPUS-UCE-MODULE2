import { gatewayApi } from './http-client';

export type EnrollmentStatus = 'ENROLLED' | 'DROPPED' | 'COMPLETED' | 'CANCELLED';

export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  academicLevel: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  identification: string;
  firstName: string;
  lastName: string;
  email: string;
  academicProgram: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  subjectId: string;
  academicPeriod: string;
  status: EnrollmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubjectPayload {
  code: string;
  name: string;
  credits: number;
  academicLevel: number;
  isActive: boolean;
}

export interface CreateStudentPayload {
  identification: string;
  firstName: string;
  lastName: string;
  email: string;
  academicProgram: string;
  isActive: boolean;
}

export async function getStudents(): Promise<Student[]> {
  const response = await gatewayApi.get<Student[]>('/api/students');
  return response.data;
}

export async function createStudent(payload: CreateStudentPayload): Promise<Student> {
  const response = await gatewayApi.post<Student>('/api/students', payload);
  return response.data;
}

export async function deleteStudent(id: string): Promise<void> {
  await gatewayApi.delete(`/api/students/${id}`);
}

export interface CreateEnrollmentPayload {
  studentId: string;
  subjectId: string;
  academicPeriod: string;
  status: EnrollmentStatus;
}

export async function getSubjects(): Promise<Subject[]> {
  const response = await gatewayApi.get<Subject[]>('/api/subjects');
  return response.data;
}

export async function createSubject(payload: CreateSubjectPayload): Promise<Subject> {
  const response = await gatewayApi.post<Subject>('/api/subjects', payload);
  return response.data;
}

export async function deleteSubject(id: string): Promise<void> {
  await gatewayApi.delete(`/api/subjects/${id}`);
}

export async function getEnrollments(): Promise<Enrollment[]> {
  const response = await gatewayApi.get<Enrollment[]>('/api/enrollments');
  return response.data;
}

export async function createEnrollment(
  payload: CreateEnrollmentPayload,
): Promise<Enrollment> {
  const response = await gatewayApi.post<Enrollment>('/api/enrollments', payload);
  return response.data;
}

export async function updateEnrollmentStatus(
  id: string,
  status: EnrollmentStatus,
): Promise<Enrollment> {
  const response = await gatewayApi.patch<Enrollment>(`/api/enrollments/${id}`, {
    status,
  });
  return response.data;
}

export async function deleteEnrollment(id: string): Promise<void> {
  await gatewayApi.delete(`/api/enrollments/${id}`);
}
