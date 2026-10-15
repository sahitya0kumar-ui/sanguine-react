# 🩸 Sanguine — React + Vite

Smart blood-donation portal, ported from the original HTML/CSS/vanilla-JS version to **React 18 + Vite**.
All data persists in the browser via `localStorage` (no backend).

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist (uses HashRouter + relative base, so it works on any static host)
```

Demo login: `demo@sanguine.app` / `demo1234` (or use the "Fill demo credentials" button).

## What's interactive
- **Auth** – sign up / log in / log out, forgot-password flow, password-strength meter.
- **Donor profile** – register, edit your profile, log a donation (history + counts update).
- **Find Donor** – live filters by group, city, availability.
- **Request Blood** – post requests, live feed, mark fulfilled.
- **Blood Banks** – search + filter by available group.
- **Camps** – register / cancel with live seat counts.
- **Compatibility** – click/keyboard-select a group to see matches.
- **Eligibility** – quick eligibility checker.
- **FAQ** (search + accordion), **Gallery** (tag filter), **Contact** (saved to localStorage).
- **Dashboard** – live counters, bar chart, donut, availability toggle, remove requests, reset demo data.
- Dark mode, toasts, scroll-reveal, responsive nav — all preserved from the original CSS.

## Structure
```
src/
├─ lib/        storage.js (localStorage layer + seeding) · hooks.js (useStored, useForm, useReveal) · validation.js
├─ components/ Shell.jsx (Header/Footer/Toaster/Loader) · ui.jsx (Field, Picker, Counter, Reveal…)
├─ pages/      one component per page
├─ styles/     original CSS files, reused as-is
├─ context.jsx app state (user, dark mode, toasts)
└─ App.jsx · main.jsx
```
localStorage keys: `bc_donors`, `bc_requests`, `bc_camps`, `bc_banks`, `bc_users`, `bc_current_user`, `bc_prefs`, `bc_my_camps`, `bc_messages`.
Passwords are stored in plain text — demo only, never do this in production.
