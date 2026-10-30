<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/dfd484b5-feab-48d4-a481-52e24d509832

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Job postings and applications fix

The job detail form now requires a real PDF/DOC/DOCX file, uploads it through `/api/upload-resume`, and only reports success after the application is saved. Admin-created job postings are persisted through `/api/jobs` so they are available to visitors on other browsers/devices. If Supabase is already configured, run the updated `supabase-setup.sql` in Supabase SQL Editor to create `public.sss_jobs` and grant the server role permissions. Keep `.env` server-only and never share the secret key.
