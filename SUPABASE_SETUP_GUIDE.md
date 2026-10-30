# Sivam Wings — Supabase connection guide

This project includes a Node/Express backend prepared to store applicant records in Supabase Postgres and CV files in a private Supabase Storage bucket.

## 1. Configure your existing Supabase project

You have already created the project and ran a diagnostic query. In Supabase > SQL Editor > New query, open `supabase-setup.sql` from this project, copy its full contents into the editor, and click Run. It creates the table the current server actually uses (`public.sss_applications`) and ensures the private `applicant-cvs` bucket exists. Your earlier `public.applicants` table can remain; this app's current backend uses `sss_applications`.

## 2. Add credentials to your local project

1. In Supabase, open Project Settings > API (the menu wording may vary).
2. Copy the Project URL.
3. Copy the **secret/service-role key** for server use only. Do not share it in chat or commit it to GitHub.
4. In the root project folder, copy `.env.example` to a new file named `.env`.
5. Edit `.env` to set:

```dotenv
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SECRET_SERVICE_ROLE_KEY
SUPABASE_STORAGE_BUCKET=applicant-cvs
PORT=3000
NODE_ENV=development
```

Replace the first two values with your real values. Keep `.env` private. Never put the secret key into a `VITE_` variable or frontend code.

## 3. Install and run in VS Code

Open Terminal in the project root and run:

```powershell
npm install
npm run dev
```

Open `http://localhost:3000/api/health` in a browser. It should report `Supabase private storage + database`. If it says `local fallback`, check that `.env` is in the same root folder as `package.json`, and that the URL and secret key are correct. Restart `npm run dev` after editing `.env`.

## 4. Verify end-to-end

Submit one test application using a dummy name/email and a harmless test CV. Confirm the application appears in the admin portal and in Supabase Storage. Test viewing/downloading the CV and deleting the test application. Do not use real applicant data until you have verified the flow.

## Important limitations and security

- The project code's API endpoints currently do not implement full admin authentication. **Do not deploy this server publicly with the service-role key until the admin/API routes are protected by real server-side authentication.** The service-role key bypasses Row Level Security.
- The server uses `sss_applications` to store each application's full JSON payload. The separate `applicants` table created earlier is not used by this current code.
- CV uploads are limited to 25 MB each and only PDF, DOC, and DOCX are accepted. Total storage/bandwidth depend on your Supabase plan; there is no unlimited storage.
- The server's local fallback is not durable storage on serverless hosting.
- This setup has not been tested against your private Supabase project because its credentials are not available here. Verify with a dummy application before launch.
