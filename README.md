# Universal Form Studio

A mobile-first, vibrant form-design workspace prepared for static GitHub + Vercel deployment. The first real editable template is built from the supplied EZEE VISION CHAMPUA admission-form sample.

## What is included

- **Dashboard:** vibrant purple/lime/coral style, responsive navigation, category search/filtering, profile preferences and PWA install support.
- **Admission Form Designer:** live A4 preview, editable organization name/address/contact, title, logo, footer, colors, font style, page density, photo box, application/date strip and signature/office labels.
- **Universal section and field controls:** add/remove/reorder sections, add/remove/reorder fields, rename labels, edit explanatory section notes, set full/half/third widths, and choose write-in line, date, phone, email, multi-line answer, or checkbox options.
- **Long-form behavior:** live page-count feedback, automatic multi-page A4 pagination, continuation headers, page numbering, and signatures/office-use rows kept with the final page. Sections stay together where possible; content is not miniaturized just to force it onto one page.
- **Print / Save PDF:** browser print dialog with A4 portrait print CSS; choose “Save as PDF” in the print dialog.
- **Design portability:** export a JSON file containing design configuration only; import that design later. Logo images uploaded in the editor are included in an exported design file.
- **PWA:** manifest, install icons, service worker and offline app-shell cache. The service worker caches static app assets and does not intentionally cache document records.

## Run locally

Service workers and PWA installation require HTTPS or localhost; opening `index.html` directly with `file://` is not sufficient.

From this directory, run:

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

## Deploy with GitHub + Vercel

1. Create a GitHub repository and upload the **contents** of this project folder into the repository root.
2. Import that repository into Vercel.
3. Deploy as a static site; no build step or backend is required.
4. Open the HTTPS deployment URL. The PWA install option depends on browser support and installation criteria.

## How the admission form editor works

1. Open the dashboard and select **Admission Form**.
2. Edit the branding or appearance controls. The A4 preview updates immediately.
3. In **Sections & fields**, change headings and labels, adjust field widths/styles, reorder items, and add/remove sections or fields.
4. If the document becomes too dense, select **Compact**. Print CSS lets longer documents continue onto extra pages rather than shrinking everything beyond readability.
5. Select **Print / Save PDF** and choose a printer or **Save as PDF**.
6. Use **Export design** to keep a design-only JSON file. **Import design** loads that file back into the editor. Designs are not saved automatically in the app.

## Privacy / storage model

- No login, signup, backend, database, student record store, billing record store or payment ledger.
- The dashboard's display name/state preference remains in browser `localStorage` for personalization only.
- Admission-form design edits exist in current browser memory only; refreshing/navigating away resets them unless a design file was exported.
- Exported JSON contains editable design configuration, not student answers or payment records.
- Uploaded logos are kept in memory for the current session; they can be included in an exported design file when the user chooses to export.

## Current scope

The admission-form layout is the first sample-based form. Other document categories remain sample-led starting points so that future fees receipts, admit cards, report cards, invoices and custom documents can be designed from the owner's actual references rather than guessed templates.
