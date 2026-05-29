CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'scholarship_status_enum') THEN
    CREATE TYPE scholarship_status_enum AS ENUM (
      'PENDING',
      'UNDER_REVIEW',
      'APPROVED',
      'REJECTED'
    );
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id VARCHAR(100) NOT NULL,
  scholarship_type VARCHAR(100) NOT NULL,
  reason TEXT NOT NULL,
  status scholarship_status_enum NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scholarships_student_id
  ON scholarships (student_id);

CREATE INDEX IF NOT EXISTS idx_scholarships_status
  ON scholarships (status);
