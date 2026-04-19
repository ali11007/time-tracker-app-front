# Time Tracker App Frontend

A React + Vite frontend for a time tracking app that talks to a backend API.

## Features

- Manual or live-timer time entries
- Fields for task name, project, tags, and date
- API-based fetching, creation, and deletion for tracked items
- API-based fetching, creation, updating, and deletion for tracked items
- CSV and JSON export for the currently filtered list
- Tailwind-driven UI components instead of custom-only styling

## API configuration

Set the backend base URL with `VITE_API_BASE_URL`. If it is not set, the app uses:

```bash
http://localhost:3000/api
```

The frontend defines the main API paths in `src/constants.js`:

- `GET /time-entries`
- `POST /time-entries`
- `DELETE /time-entries/:id`
- `PUT /time-entries/:id`
- `GET /time-entries/export/csv`
- `GET /time-entries/export/json`

## Run

```bash
npm run dev
```

## Notes

- Export calls the backend export endpoints first and falls back to client-side generation if those routes are unavailable.
