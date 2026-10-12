# Task 3 Work Log — CareerTrack
Developer: Sonu Kumar Badal
Internship: YuvaIntern — Full Stack Developer Fresher

## Plan
Build a useful dashboard that helps a student track job and internship applications.

## Architecture decisions
- Kept HTML, CSS, and JavaScript separate.
- Represented each application as an object with a unique ID and consistent fields.
- Used localStorage so the project runs without backend credentials.
- Organized the code into small functions for loading, saving, rendering, validation, filtering, CRUD actions, and export.

## Implemented
- Responsive dashboard and summary cards.
- Add/edit/delete operations.
- Search and dropdown filters.
- Required-field and job-link validation.
- Delete confirmation and CSV export.
- README and manual test checklist.

## Manual verification checklist
- [ ] Add a valid application.
- [ ] Verify required-field validation.
- [ ] Edit a record.
- [ ] Delete a record after confirmation.
- [ ] Test search and filters.
- [ ] Export CSV.
- [ ] Refresh and check persistence.
- [ ] Inspect mobile layout and browser console.

## Limitation
This version stores data in the current browser only; a backend API and PostgreSQL database can be future enhancements.
