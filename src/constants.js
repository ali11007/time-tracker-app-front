export const APP_ROUTES = {
  dashboard: '/',
  login: '/login',
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const AUTH_STORAGE_KEY = 'time-tracker-auth';
export const AUTH_LOGIN_IDENTIFIER_FIELD =
  import.meta.env.VITE_AUTH_LOGIN_IDENTIFIER_FIELD || 'emailOrUsername';

export const API_PATHS = {
  auth: {
    login: import.meta.env.VITE_AUTH_LOGIN_PATH || '/auth/login',
  },
  entries: '/time-entries',
  entryById: (entryId) => `/time-entries/${entryId}`,
  exports: {
    csv: '/time-entries/export/csv',
    json: '/time-entries/export/json',
  },
};

export const today = () => new Date().toISOString().slice(0, 10);

export const DEFAULT_DRAFT = {
  name: '',
  project: '',
  tags: '',
  date: today(),
  durationMinutes: '30',
};

export const toEntryDraft = (entry) => ({
  name: entry.name || '',
  project: entry.project || '',
  tags: Array.isArray(entry.tags) ? entry.tags.join(', ') : '',
  date: entry.date || today(),
  durationMinutes: String(Math.max(1, Math.round(Number(entry.durationSeconds || 0) / 60))),
  type: entry.type || 'manual',
});
