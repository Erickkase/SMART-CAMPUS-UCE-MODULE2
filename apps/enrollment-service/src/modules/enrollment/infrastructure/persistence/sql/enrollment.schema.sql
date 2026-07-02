CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enrollment_status_enum') THEN
    CREATE TYPE enrollment_status_enum AS ENUM (
      'ENROLLED',
      'DROPPED',
      'COMPLETED',
      'CANCELLED'
    );
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  subject_id UUID NOT NULL,
  academic_period VARCHAR(20) NOT NULL,
  status enrollment_status_enum NOT NULL DEFAULT 'ENROLLED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enrollments_student_id
  ON enrollments (student_id);

CREATE INDEX IF NOT EXISTS idx_enrollments_subject_id
  ON enrollments (subject_id);

CREATE INDEX IF NOT EXISTS idx_enrollments_status
  ON enrollments (status);
