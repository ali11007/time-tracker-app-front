import { currentTime, splitIsoToLocalParts, todayDate } from './utils/dateTime';

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
  manualEntries: '/time-entries/manual',
  timerStart: '/time-entries/timer/start',
  timerStop: (entryId) => `/time-entries/${entryId}/stop`,
  entryById: (entryId) => `/time-entries/${entryId}`,
  projects: '/projects',
  projectById: (projectId) => `/projects/${projectId}`,
  tags: '/tags',
  tagById: (tagId) => `/tags/${tagId}`,
  exports: {
    csv: '/time-entries/export/csv',
    json: '/time-entries/export/json',
  },
};

export const today = todayDate;

export const DEFAULT_DRAFT = {
  name: '',
  projectId: '',
  tags: [],
  startDate: todayDate(),
  startTime: currentTime(),
  endDate: todayDate(),
  endTime: currentTime(),
};

export const toEntryDraft = (entry) => {
  const start = splitIsoToLocalParts(entry.startAt);
  const end = splitIsoToLocalParts(entry.endAt || entry.startAt);

  return {
    name: entry.name || '',
    projectId: entry.projectId || '',
    tags: Array.isArray(entry.tags) ? entry.tags : [],
    startDate: start.date,
    startTime: start.time,
    endDate: end.date,
    endTime: end.time,
    type: entry.type || 'manual',
  };
};
