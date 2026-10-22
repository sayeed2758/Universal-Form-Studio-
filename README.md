# Universal Form Studio

A mobile-first, vibrant dashboard shell for a future universal form maker. It is a static front-end project prepared for GitHub + Vercel deployment.

## What is included

- Responsive dashboard with working navigation, search, form-category filters, profile preferences, help and sample-guidance dialogs.
- Six initial document categories: Admission Form, Fees Receipt, Admit Card, Report Card, Business Invoice, and Any Bill / Receipt.
- The categories are intentionally **not fake/dummy forms**. Each opens a brief explaining that the actual form template will be built from the sample supplied by the owner.
- Local-only display profile (name and Indian State/UT) to personalize the dashboard.
- PWA manifest, icons, install button, service worker and cached app shell for offline reopening after the first successful visit.
- No sign-in, backend, database, form records, student records or payment records.

## Run locally

This is a static site. The service worker/PWA functionality needs an HTTP server; opening `index.html` as a `file://` URL will not enable installation or service worker caching.

### Option A — VS Code

1. Open this folder in VS Code.
2. Run with a local server extension (for example, Live Server).
3. Open the served `http://localhost:...` address.

### Option B — Python

From this folder, run:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deploy to GitHub + Vercel

1. Create a new GitHub repository.
2. Upload the contents of this project folder (not the ZIP file itself).
3. In Vercel, import that GitHub repository.
4. Configure it as a static frontend / Vite is **not required** for this version; leave the build command and output directory blank/default if prompted, or use Vercel's static deployment defaults.
5. Deploy. Vercel's HTTPS URL enables the PWA install/service-worker features.

If you later add a build tool, update Vercel's build settings accordingly.

## Install behavior

- Chromium-based browsers may show the one-tap install prompt when they consider the PWA installable.
- If the prompt is unavailable, the Install button gives platform-specific manual steps.
- On iPhone/iPad, use Safari's Share menu → Add to Home Screen.
- A service worker can only register from HTTPS or localhost.
- The core app shell is cached after the first successful load. Remote Google Fonts may fall back to system fonts when offline.

## Privacy and data behavior

Only the name and state preferences are stored in this browser using `localStorage` under `ufs_profile_v1`. No profile is sent to a server. Generated documents, payments and other records are not implemented or persisted. Clearing browser storage clears the local profile.

## Next development step

When the owner supplies a sample form, implement that form's editable fields, brand controls and professional A4 print/PDF layout. Keep each form's design purpose-specific rather than forcing every document into the same template.
