# Sivam Wings — Inquiry and Email Alert Edit/Delete Fix

## What this update adds
- Edit company/contact details, email, phone, service, headcount, timeline, message, and status for each Client Staffing & HR Quote Request.
- Delete an individual inquiry after confirmation.
- Delete one email alert or clear the entire email outbox after confirmation.
- Inquiry changes and email-outbox changes are saved in this browser's local storage.

## Install
1. Stop the existing development server with Ctrl+C.
2. Extract this ZIP into a new folder.
3. Copy your private `.env` file from the current project into this folder. Do not share or upload `.env`.
4. Open the folder in VS Code and run `npm install` then `npm run dev`.
5. Open `http://localhost:3000/` and go to the admin portal.

## Important data note
The inquiry cards and email outbox in this version are stored in browser local storage, not in Supabase. Changes persist in the same browser/profile but are not shared with other devices. Deleting an email alert removes only the outbox log; it cannot recall an email already sent. Do not use this local-only admin implementation as a public multi-user CRM without server-side authentication and database-backed inquiry/notification endpoints.
