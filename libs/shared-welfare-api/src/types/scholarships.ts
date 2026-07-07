export type ScholarshipStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED';

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

export type UpdateScholarshipStatusPayload = Extract<
  ScholarshipStatus,
  'APPROVED' | 'REJECTED'
>;
