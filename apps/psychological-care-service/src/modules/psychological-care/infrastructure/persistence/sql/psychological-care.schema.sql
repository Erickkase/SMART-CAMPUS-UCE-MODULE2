CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_status_enum') THEN
    CREATE TYPE request_status_enum AS ENUM (
      'REQUESTED',
      'SCHEDULED',
      'IN_PROGRESS',
      'COMPLETED',
      'CANCELLED',
      'REFERRED'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status_enum') THEN
    CREATE TYPE appointment_status_enum AS ENUM (
      'SCHEDULED',
      'COMPLETED',
      'CANCELLED',
      'MISSED'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'care_modality_enum') THEN
    CREATE TYPE care_modality_enum AS ENUM (
      'IN_PERSON',
      'VIRTUAL'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'risk_level_enum') THEN
    CREATE TYPE risk_level_enum AS ENUM (
      'LOW',
      'MEDIUM',
      'HIGH'
    );
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS psychological_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id VARCHAR(100) NOT NULL,
  reason TEXT NOT NULL,
  priority risk_level_enum NOT NULL DEFAULT 'LOW',
  status request_status_enum NOT NULL DEFAULT 'REQUESTED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS psychological_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id VARCHAR(100) NOT NULL,
  psychologist_id VARCHAR(100) NOT NULL,
  appointment_date TIMESTAMPTZ NOT NULL,
  modality care_modality_enum NOT NULL,
  status appointment_status_enum NOT NULL DEFAULT 'SCHEDULED',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS psychological_follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL,
  student_id VARCHAR(100) NOT NULL,
  observations TEXT NOT NULL,
  recommendations TEXT NOT NULL,
  risk_level risk_level_enum NOT NULL DEFAULT 'LOW',
  next_action TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS psychological_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id VARCHAR(100) NOT NULL,
  referred_to VARCHAR(150) NOT NULL,
  reason TEXT NOT NULL,
  status request_status_enum NOT NULL DEFAULT 'REFERRED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_psychological_requests_student_id
  ON psychological_requests (student_id);

CREATE INDEX IF NOT EXISTS idx_psychological_requests_status
  ON psychological_requests (status);

CREATE INDEX IF NOT EXISTS idx_psychological_appointments_student_id
  ON psychological_appointments (student_id);

CREATE INDEX IF NOT EXISTS idx_psychological_appointments_psychologist_id
  ON psychological_appointments (psychologist_id);

CREATE INDEX IF NOT EXISTS idx_psychological_appointments_status
  ON psychological_appointments (status);

CREATE INDEX IF NOT EXISTS idx_psychological_follow_ups_appointment_id
  ON psychological_follow_ups (appointment_id);

CREATE INDEX IF NOT EXISTS idx_psychological_follow_ups_student_id
  ON psychological_follow_ups (student_id);

CREATE INDEX IF NOT EXISTS idx_psychological_referrals_student_id
  ON psychological_referrals (student_id);

CREATE INDEX IF NOT EXISTS idx_psychological_referrals_status
  ON psychological_referrals (status);
