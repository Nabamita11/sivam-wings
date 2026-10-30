# White screen fix

The blank screen was caused by `App.tsx` reading `isSecureAdminOpen` in a `useEffect` dependency array before the state variable had been initialized. The state declarations have been moved above the effect.

## Run locally
1. Keep your existing `.env` private; copy it into this project folder if needed.
2. In VS Code terminal run `npm install`.
3. Run `npm run dev`.
4. Open `http://localhost:3000/` (not `http://0.0.0.0:3000/`).

The build could not be completed in the preparation environment, so please report any remaining terminal or browser-console errors.
