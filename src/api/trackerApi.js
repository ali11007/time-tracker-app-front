import apiClient from './apiClient';
import { API_PATHS } from '../constants';

const sortEntries = (entries) =>
  [...entries].sort((left, right) => {
    const leftStartAt = left.startAt || '';
    const rightStartAt = right.startAt || '';

    return rightStartAt.localeCompare(leftStartAt) || (right.createdAt || '').localeCompare(left.createdAt || '');
  });

export const trackerApi = {
  async listEntries() {
    const { data } = await apiClient.get(API_PATHS.entries);
    return sortEntries(Array.isArray(data) ? data : []);
  },
  async exportEntries(format, filterText = '') {
    const path = API_PATHS.exports[format];

    if (!path) {
      throw new Error(`Unsupported export format: ${format}`);
    }

    return apiClient.get(path, {
      params: filterText.trim() ? { search: filterText.trim() } : undefined,
      responseType: 'blob',
    });
  },
  async createManualEntry(entry) {
    const payload = {
      ...entry,
      tags: Array.isArray(entry.tags) ? entry.tags : [],
      type: 'manual',
    };

    const { data } = await apiClient.post(API_PATHS.manualEntries, payload);
    return data;
  },
  async startTimer(entry) {
    const payload = {
      name: entry.name,
      project: entry.project,
      tags: Array.isArray(entry.tags) ? entry.tags : [],
    };

    const { data } = await apiClient.post(API_PATHS.timerStart, payload);
    return data;
  },
  async stopTimer(entryId) {
    const { data } = await apiClient.post(API_PATHS.timerStop(entryId));
    return data;
  },
  async deleteEntry(entryId) {
    const { data } = await apiClient.delete(API_PATHS.entryById(entryId));
    return data;
  },
  async updateEntry({ entryId, entry }) {
    const payload = {
      ...entry,
      tags: Array.isArray(entry.tags) ? entry.tags : [],
    };

    const { data } = await apiClient.put(API_PATHS.entryById(entryId), payload);
    return data;
  },
};
