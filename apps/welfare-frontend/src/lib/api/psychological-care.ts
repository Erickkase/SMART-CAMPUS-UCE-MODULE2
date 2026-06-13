import { psychologicalApi } from './http-client';

export type RequestStatus =
  | 'REQUESTED'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFERRED';

export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'MISSED';
export type CareModality = 'IN_PERSON' | 'VIRTUAL';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface PsychologicalRequest {
  id: string;
  studentId: string;
  reason: string;
  priority: RiskLevel;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PsychologicalAppointment {
  id: string;
  studentId: string;
  psychologistId: string;
  appointmentDate: string;
  modality: CareModality;
  status: AppointmentStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePsychologicalRequestPayload {
  studentId: string;
  reason: string;
  priority: RiskLevel;
  status: RequestStatus;
}

export interface CreatePsychologicalAppointmentPayload {
  studentId: string;
  psychologistId: string;
  appointmentDate: string;
  modality: CareModality;
  status: AppointmentStatus;
  notes: string;
}

export async function getPsychologicalRequests(): Promise<PsychologicalRequest[]> {
  const response = await psychologicalApi.get<PsychologicalRequest[]>(
    '/psychological-care/requests',
  );
  return response.data;
}

export async function createPsychologicalRequest(
  payload: CreatePsychologicalRequestPayload,
): Promise<PsychologicalRequest> {
  const response = await psychologicalApi.post<PsychologicalRequest>(
    '/psychological-care/requests',
    payload,
  );
  return response.data;
}

export async function getPsychologicalAppointments(): Promise<PsychologicalAppointment[]> {
  const response = await psychologicalApi.get<PsychologicalAppointment[]>(
    '/psychological-care/appointments',
  );
  return response.data;
}

export async function createPsychologicalAppointment(
  payload: CreatePsychologicalAppointmentPayload,
): Promise<PsychologicalAppointment> {
  const response = await psychologicalApi.post<PsychologicalAppointment>(
    '/psychological-care/appointments',
    payload,
  );
  return response.data;
}

export async function updatePsychologicalAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): Promise<PsychologicalAppointment> {
  const response = await psychologicalApi.patch<PsychologicalAppointment>(
    `/psychological-care/appointments/${id}/status`,
    { status },
  );
  return response.data;
}
