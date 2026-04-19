import apiClient from './apiClient';
import { API_PATHS, AUTH_LOGIN_IDENTIFIER_FIELD } from '../constants';

const readToken = (payload) =>
  payload?.token ||
  payload?.accessToken ||
  payload?.jwt ||
  payload?.data?.token ||
  payload?.data?.accessToken ||
  null;

const readUser = (payload) => {
  if (payload?.user) {
    return payload.user;
  }

  if (payload?.data?.user) {
    return payload.data.user;
  }

  const candidate = payload?.data;

  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    return null;
  }

  const { token, accessToken, jwt, ...user } = candidate;
  return Object.keys(user).length ? user : null;
};

export const authApi = {
  async login({ identifier, password }) {
    const payload = {
      password,
      [AUTH_LOGIN_IDENTIFIER_FIELD]: identifier,
    };

    const { data } = await apiClient.post(API_PATHS.auth.login, payload, {
      skipAuthRedirect: true,
    });

    const token = readToken(data);
    const user = readUser(data);

    if (!token) {
      throw new Error('The login response did not include a JWT token.');
    }

    return {
      token,
      user,
    };
  },
};
