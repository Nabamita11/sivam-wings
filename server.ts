import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import multer from 'multer';
import dotenv from 'dotenv';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

dotenv.config();
const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;
const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'applicant-cvs';
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase: SupabaseClient | null = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));
  const dataDirectory = path.resolve(process.cwd(), 'data');
  const resumeDirectory = path.resolve(process.cwd(), 'uploads', 'resumes');
  fs.mkdirSync(dataDirectory, { recursive: true });
  fs.mkdirSync(resumeDirectory, { recursive: true });
  const localApplicationsFile = path.join(dataDirectory, 'applications.json');
  const localJobsFile = path.join(dataDirectory, 'jobs.json');
  const readLocalJobs = (): any[] => {
    try { return JSON.parse(fs.readFileSync(localJobsFile, 'utf8')); } catch { return []; }
  };
  const writeLocalJobs = (items: any[]) => fs.writeFileSync(localJobsFile, JSON.stringify(items, null, 2));
  const allowedExtensions = new Set(['.pdf', '.doc', '.docx']);
  const resumeUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 25 * 1024 * 1024 },
    fileFilter: (_req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      if (!allowedExtensions.has(extension)) return callback(new Error('Only PDF, DOC, and DOCX resumes are accepted. Maximum file size is 25 MB.'));
      callback(null, true);
    },
  });

  const readLocalApplications = (): any[] => {
    try { return JSON.parse(fs.readFileSync(localApplicationsFile, 'utf8')); } catch { return []; }
  };
  const writeLocalApplications = (items: any[]) => fs.writeFileSync(localApplicationsFile, JSON.stringify(items, null, 2));
  const safeFilename = (name: string) => {
    const filename = path.basename(name || '');
    return filename && filename === name && /^[a-zA-Z0-9_.-]+$/.test(filename) && allowedExtensions.has(path.extname(filename).toLowerCase()) ? filename : null;
  };

  // Job postings are stored server-side so candidates on other browsers/devices see admin-published jobs.
  app.get('/api/jobs', async (_req, res) => {
    try {
      if (supabase) {
        const { data, error } = await supabase.from('sss_jobs').select('payload').order('updated_at', { ascending: false });
        if (error) throw error;
        return res.json({ jobs: (data || []).map((row: any) => row.payload) });
      }
      return res.json({ jobs: readLocalJobs() });
    } catch (error) {
      console.error('Could not load jobs:', error);
      return res.status(500).json({ error: 'Could not load job postings.' });
    }
  });

  app.post('/api/jobs', async (req, res) => {
    const job = req.body;
    if (!job?.id || !job?.title) return res.status(400).json({ error: 'Job ID and title are required.' });
    try {
      if (supabase) {
        const { error } = await supabase.from('sss_jobs').upsert({ id: String(job.id), payload: job, updated_at: new Date().toISOString() });
        if (error) throw error;
      } else {
        const all = readLocalJobs().filter((item: any) => String(item.id) !== String(job.id));
        all.unshift(job); writeLocalJobs(all);
      }
      return res.json({ success: true, job });
    } catch (error) {
      console.error('Could not save job:', error);
      return res.status(500).json({ error: 'Could not publish job. Check Supabase permissions and setup.' });
    }
  });

  app.patch('/api/jobs/:id', async (req, res) => {
    const id = String(req.params.id || '');
    try {
      if (supabase) {
        const { data, error } = await supabase.from('sss_jobs').select('payload').eq('id', id).maybeSingle();
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Job not found.' });
        const updated = { ...data.payload, ...req.body };
        const { error: saveError } = await supabase.from('sss_jobs').update({ payload: updated, updated_at: new Date().toISOString() }).eq('id', id);
        if (saveError) throw saveError;
        return res.json({ success: true, job: updated });
      }
      const all = readLocalJobs();
      const index = all.findIndex((item: any) => String(item.id) === id);
      if (index < 0) return res.status(404).json({ error: 'Job not found.' });
      all[index] = { ...all[index], ...req.body }; writeLocalJobs(all);
      return res.json({ success: true, job: all[index] });
    } catch (error) {
      console.error('Could not update job:', error);
      return res.status(500).json({ error: 'Could not update job posting.' });
    }
  });

  app.delete('/api/jobs/:id', async (req, res) => {
    const id = String(req.params.id || '');
    try {
      if (supabase) {
        const { error, count } = await supabase.from('sss_jobs').delete({ count: 'exact' }).eq('id', id);
        if (error) throw error;
        if (count === 0) return res.status(404).json({ error: 'Job not found.' });
      } else {
        const all = readLocalJobs();
        const next = all.filter((item: any) => String(item.id) !== id);
        if (next.length === all.length) return res.status(404).json({ error: 'Job not found.' });
        writeLocalJobs(next);
      }
      return res.json({ success: true });
    } catch (error) {
      console.error('Could not delete job:', error);
      return res.status(500).json({ error: 'Could not delete job posting.' });
    }
  });

  // Uploads go to a private Supabase bucket when configured. Local disk is a development fallback only.
  app.post('/api/upload-resume', (req, res) => {
    resumeUpload.single('resume')(req, res, async (error) => {
      if (error) return res.status(400).json({ error: error.message || 'Resume upload failed.' });
      if (!req.file) return res.status(400).json({ error: 'Please select a resume file.' });
      const extension = path.extname(req.file.originalname).toLowerCase();
      const safeOriginalName = path.basename(req.file.originalname, extension).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80) || 'resume';
      const storageName = `${crypto.randomUUID()}__${safeOriginalName}${extension}`;
      try {
        if (supabase) {
          const { error: uploadError } = await supabase.storage.from(bucket).upload(storageName, req.file.buffer, { contentType: req.file.mimetype || 'application/octet-stream', upsert: false });
          if (uploadError) throw uploadError;
        } else {
          fs.writeFileSync(path.join(resumeDirectory, storageName), req.file.buffer);
        }
        res.json({ success: true, storageName, originalName: req.file.originalname, size: req.file.size, storage: supabase ? 'supabase' : 'local-fallback' });
      } catch (uploadError) {
        console.error('Resume upload failed:', uploadError);
        res.status(500).json({ error: 'Could not save resume. Check Supabase settings, bucket, and storage quota.' });
      }
    });
  });

  app.get('/api/resumes/:filename', async (req, res) => {
    const filename = safeFilename(req.params.filename);
    if (!filename || !filename.includes('__')) return res.status(400).send('Invalid resume filename.');
    try {
      if (supabase) {
        const { data, error } = await supabase.storage.from(bucket).createSignedUrl(filename, 60);
        if (error || !data?.signedUrl) return res.status(404).send('Resume not found in private storage.');
        return res.redirect(data.signedUrl);
      }
      const fullPath = path.join(resumeDirectory, filename);
      if (!fs.existsSync(fullPath)) return res.status(404).send('Resume file not found on this server.');
      return res.download(fullPath, filename.split('__').slice(1).join('__'));
    } catch (error) {
      console.error('Resume download failed:', error);
      return res.status(500).send('Could not retrieve resume.');
    }
  });

  app.get('/api/applications', async (_req, res) => {
    try {
      if (supabase) {
        const { data, error } = await supabase.from('sss_applications').select('payload').order('updated_at', { ascending: false });
        if (error) throw error;
        return res.json({ applications: (data || []).map((row: any) => row.payload) });
      }
      return res.json({ applications: readLocalApplications() });
    } catch (error) {
      console.error('Could not load applications:', error);
      return res.status(500).json({ error: 'Could not load applications from permanent storage.' });
    }
  });

  app.post('/api/applications', async (req, res) => {
    const application = req.body;
    if (!application?.id || !application?.candidateName || !application?.resumeStorageName) return res.status(400).json({ error: 'Application details or resume are missing.' });
    try {
      if (supabase) {
        const { error } = await supabase.from('sss_applications').upsert({ id: String(application.id), payload: application, updated_at: new Date().toISOString() });
        if (error) throw error;
      } else {
        const all = readLocalApplications().filter((item) => item.id !== application.id);
        all.unshift(application); writeLocalApplications(all);
      }
      return res.json({ success: true, application });
    } catch (error) {
      console.error('Could not save application:', error);
      return res.status(500).json({ error: 'Could not save applicant details to permanent storage.' });
    }
  });

  app.patch('/api/applications/:id', async (req, res) => {
    try {
      const id = req.params.id;
      let application: any;
      if (supabase) {
        const { data, error } = await supabase.from('sss_applications').select('payload').eq('id', id).maybeSingle();
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Application not found.' });
        application = { ...data.payload, ...req.body };
        const { error: updateError } = await supabase.from('sss_applications').update({ payload: application, updated_at: new Date().toISOString() }).eq('id', id);
        if (updateError) throw updateError;
      } else {
        const all = readLocalApplications();
        const index = all.findIndex((item) => item.id === id);
        if (index < 0) return res.status(404).json({ error: 'Application not found.' });
        application = { ...all[index], ...req.body }; all[index] = application; writeLocalApplications(all);
      }
      return res.json({ success: true, application });
    } catch (error) {
      console.error('Could not update application:', error);
      return res.status(500).json({ error: 'Could not update applicant record.' });
    }
  });

  app.delete('/api/applications/:id', async (req, res) => {
    const id = String(req.params.id || '');
    if (!id) return res.status(400).json({ error: 'Application ID is required.' });

    try {
      let application: any;
      if (supabase) {
        const { data, error } = await supabase
          .from('sss_applications')
          .select('payload')
          .eq('id', id)
          .maybeSingle();
        if (error) throw error;
        application = data?.payload;

        if (!application) {
          return res.status(404).json({ error: 'Application not found in the database.' });
        }

        // Delete the database record first so a missing CV file cannot block
        // deleting the applicant record.
        const { error: deleteError, count } = await supabase
          .from('sss_applications')
          .delete({ count: 'exact' })
          .eq('id', id);
        if (deleteError) throw deleteError;
        if (count === 0) {
          return res.status(404).json({ error: 'Application was not deleted because no matching record was found.' });
        }
      } else {
        const all = readLocalApplications();
        application = all.find((item) => String(item.id) === id);
        if (!application) return res.status(404).json({ error: 'Application not found.' });
        writeLocalApplications(all.filter((item) => String(item.id) !== id));
      }

      // CV cleanup is best-effort: missing/already-deleted files must not
      // cause a valid applicant deletion to appear to fail.
      const filename = safeFilename(application.resumeStorageName || '');
      let resumeCleanupWarning: string | undefined;
      if (filename && filename.includes('__')) {
        try {
          if (supabase) {
            const { error } = await supabase.storage.from(bucket).remove([filename]);
            if (error) throw error;
          } else {
            const fullPath = path.join(resumeDirectory, filename);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
          }
        } catch (storageError) {
          resumeCleanupWarning = 'Application was deleted, but the resume file could not be removed automatically. Please check Supabase Storage.';
          console.error('Application deleted but resume cleanup failed:', storageError);
        }
      }

      return res.json({ success: true, deleted: true, ...(resumeCleanupWarning ? { warning: resumeCleanupWarning } : {}) });
    } catch (error) {
      console.error('Could not delete application:', error);
      return res.status(500).json({ error: 'Could not delete applicant record. Check the server terminal and Supabase connection.' });
    }
  });

  app.delete('/api/resumes/:filename', async (req, res) => {
    const filename = safeFilename(req.params.filename);
    if (!filename || !filename.includes('__')) return res.status(400).json({ error: 'Invalid resume filename.' });
    try {
      if (supabase) {
        const { error } = await supabase.storage.from(bucket).remove([filename]);
        if (error) throw error;
      } else {
        const fullPath = path.join(resumeDirectory, filename);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }
      return res.json({ success: true, deleted: true });
    } catch (error) {
      console.error('Could not delete resume file:', error);
      return res.status(500).json({ error: 'Could not delete resume file from storage.' });
    }
  });

  app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'Sivam Wings Backend API', storage: supabase ? 'Supabase private storage + database' : 'local fallback (not permanent on serverless hosting)', timestamp: new Date().toISOString() }));
  app.post('/api/notify-owner', (req, res) => {
    const { application, notification, targetEmail } = req.body;
    const recipient = targetEmail || 'vinay@sivamwings.com';
    console.log(`[Sivam Wings] Application notification: ${application?.candidateName || 'N/A'} | ${application?.jobTitle || 'N/A'} | ${recipient} | ${notification?.id || `EML-${Date.now()}`}`);
    res.json({ success: true, message: `Notification logged for ${recipient}`, recipient, timestamp: new Date().toISOString(), delivered: false });
  });
  app.get('/api/notifications', (_req, res) => res.json({ status: 'active', recipient: 'vinay@sivamwings.com', system: 'Sivam Wings notification logging' }));

  if (!supabase) console.warn('Supabase is not configured. Using local fallback storage. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env for permanent online storage.');
  if (!isProduction) {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(path.resolve(distPath, 'index.html')));
  }
  app.listen(PORT, '0.0.0.0', () => console.log(`Sivam Wings listening on http://0.0.0.0:${PORT}`));
}

startServer().catch((err) => { console.error('Fatal error starting server:', err); process.exit(1); });
