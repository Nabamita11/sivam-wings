# Sivam Wings — Applicant Visibility Fix

## What changed
- The application list is fetched from `/api/applications` on startup and again whenever the admin portal is opened.
- The server response is treated as the source of truth; browser local storage remains only a cache.
- If the server cannot load applications, the admin sees a clear warning instead of silently assuming cached data is current.
- After a successful submission, the app uses the application returned by the server when available.

## Install / run
1. Extract this ZIP into a new folder.
2. Copy your existing `.env` into the extracted project folder. Do not share it or upload it publicly.
3. In VS Code, open the project folder and run `npm install`.
4. Start it with `npm run dev`.
5. Open `http://localhost:3000/` (not `http://0.0.0.0:3000/`).
6. Submit a test application with a test resume, then open the admin portal. The application list is refreshed from the server.

## Important
- This project needs the Node/Express server running. Opening the built frontend as a static website will not save/load applications through `/api`.
- Ensure `.env` has the correct `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_STORAGE_BUCKET=applicant-cvs`.
- In Supabase, `public.sss_applications` must have the expected `id` and `payload` columns and the backend's service-role key must be valid. Do not put the service-role key in frontend variables or share it.
- I could not complete a dependency installation/build test in this environment, so please test locally before deploying.
