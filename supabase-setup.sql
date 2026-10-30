-- FutureJobs: run in Supabase Dashboard > SQL Editor > New query.
-- This schema matches the existing Node/Express server.ts in this project.
-- The server uses the secret service-role key only on the backend.

CREATE TABLE IF NOT EXISTS public.sss_applications (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.sss_applications ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS sss_applications_updated_at_idx
  ON public.sss_applications (updated_at DESC);

-- Create the private CV bucket used by server.ts.
-- 25 MB per file; only PDF/DOC/DOCX allowed by this bucket setting.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'applicant-cvs',
  'applicant-cvs',
  FALSE,
  26214400,
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  public = FALSE,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Intentionally no public policies: the server must access these with its
-- server-only service-role key. Never expose that key in frontend code.


-- Admin-created job postings must be shared with all public visitors, not browser-local only.
CREATE TABLE IF NOT EXISTS public.sss_jobs (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.sss_jobs ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS sss_jobs_updated_at_idx ON public.sss_jobs (updated_at DESC);
GRANT USAGE ON SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.sss_applications TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.sss_jobs TO service_role;
