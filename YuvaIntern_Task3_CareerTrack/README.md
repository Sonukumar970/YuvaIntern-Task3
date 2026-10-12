# CareerTrack — YuvaIntern Task 3
A responsive job and internship application tracker.

## Features
- Add, edit, and delete applications
- Track company, role, type, status, applied date, follow-up date, job link, and notes
- Dashboard statistics for totals, in-progress applications, interviews, and offers
- Search and filter by status and type
- Save data in browser localStorage
- Export records to CSV
- Required-field and URL validation; delete confirmation
- Responsive interface and reduced-motion support

## Technology and architecture
HTML5 structures the page, CSS3 provides styling and responsive layouts, and vanilla JavaScript handles CRUD operations, filtering, validation, rendering, and CSV export. Browser localStorage persists data. The project is split into index.html, style.css, and script.js.

## Run locally
Extract the ZIP and open index.html in a modern browser, or use VS Code Live Server.

## Manual test checklist
1. Add an application and try submitting empty required fields.
2. Edit a record and delete one after confirming.
3. Search by company or role and test both filters.
4. Export records to CSV.
5. Refresh and verify records remain saved.
6. Check desktop/mobile layouts and browser console.

## Limitation / future scope
Data is stored only in the current browser. A future version could use authentication, a REST API, and PostgreSQL for multi-device access.
