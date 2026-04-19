import axios from 'axios';
import { API_BASE_URL } from '../constants';

export const UNAUTHORIZED_EVENT = 'auth:unauthorized';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let authToken = null;

export const setApiAuthToken = (token) => {
  authToken = token || null;
};

const notifyUnauthorized = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
};

apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && !error.config?.skipAuthRedirect) {
      notifyUnauthorized();
    }

    return Promise.reject(error);
  },
);

export default apiClient;
