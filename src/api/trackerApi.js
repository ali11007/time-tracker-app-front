import apiClient from './apiClient';
import { API_PATHS } from '../constants';

const sortEntries = (entries) =>
  [...entries].sort((left, right) => {
    const leftStartAt = left.startAt || '';
    const rightStartAt = right.startAt || '';

    return rightStartAt.localeCompare(leftStartAt) || (right.createdAt || '').localeCompare(left.createdAt || '');
  });

const sortByName = (items) => [...items].sort((left, right) => (left.name || '').localeCompare(right.name || ''));

export const trackerApi = {
  async listEntries() {
    const { data } = await apiClient.get(API_PATHS.entries);
    return sortEntries(Array.isArray(data) ? data : []);
  },
  async listProjects() {
    const { data } = await apiClient.get(API_PATHS.projects);
    return sortByName(Array.isArray(data) ? data : []);
  },
  async createProject(project) {
    const { data } = await apiClient.post(API_PATHS.projects, project);
    return data;
  },
  async updateProject({ projectId, project }) {
    const { data } = await apiClient.put(API_PATHS.projectById(projectId), project);
    return data;
  },
  async deleteProject(projectId) {
    const { data } = await apiClient.delete(API_PATHS.projectById(projectId));
    return data;
  },
  async listTags() {
    const { data } = await apiClient.get(API_PATHS.tags);
    return sortByName(Array.isArray(data) ? data : []);
  },
  async createTag(tag) {
    const { data } = await apiClient.post(API_PATHS.tags, tag);
    return data;
  },
  async updateTag({ tagId, tag }) {
    const { data } = await apiClient.put(API_PATHS.tagById(tagId), tag);
    return data;
  },
  async deleteTag(tagId) {
    const { data } = await apiClient.delete(API_PATHS.tagById(tagId));
    return data;
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
      projectId: entry.projectId,
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
