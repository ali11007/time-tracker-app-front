import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { setApiAuthToken, UNAUTHORIZED_EVENT } from '../api/apiClient';
import { APP_ROUTES, AUTH_STORAGE_KEY } from '../constants';

const AuthContext = createContext(null);

const readStoredAuth = () => {
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return { token: null, user: null };
    }

    const parsed = JSON.parse(raw);
    return {
      token: parsed?.token || null,
      user: parsed?.user || null,
    };
  } catch {
    return { token: null, user: null };
  }
};

const persistAuth = ({ token, user }) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (!token) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      token,
      user,
    }),
  );
};

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState(() => readStoredAuth());
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    setApiAuthToken(authState.token);
    persistAuth(authState);
  }, [authState]);

  const clearAuth = useCallback(
    ({ redirect = true } = {}) => {
      setAuthState({ token: null, user: null });
      setApiAuthToken(null);
      queryClient.clear();

      if (redirect && location.pathname !== APP_ROUTES.login) {
        navigate(APP_ROUTES.login, {
          replace: true,
          state: { from: location.pathname },
        });
      }
    },
    [location.pathname, navigate, queryClient],
  );

  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuth();
    };

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [clearAuth]);

  const login = useCallback(async ({ identifier, password }) => {
    setIsLoggingIn(true);

    try {
      const session = await authApi.login({ identifier, password });
      setAuthState(session);
      return session;
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  const value = useMemo(
    () => ({
      currentUser: authState.user,
      token: authState.token,
      isAuthenticated: Boolean(authState.token),
      isLoggingIn,
      login,
      logout,
      clearAuth,
    }),
    [authState.token, authState.user, clearAuth, isLoggingIn, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
};
