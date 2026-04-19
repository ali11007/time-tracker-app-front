import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { APP_ROUTES, API_BASE_URL } from '../constants';
import { useAuth } from '../context/AuthContext';

const getErrorMessage = (error) => {
  const apiMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message;

  return apiMessage || 'Unable to sign in. Please check your credentials and try again.';
};

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggingIn, isAuthenticated } = useAuth();
  const [formState, setFormState] = useState({ identifier: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const redirectTo = useMemo(() => {
    if (typeof location.state?.from === 'string') {
      return location.state.from;
    }

    return location.state?.from?.pathname || APP_ROUTES.dashboard;
  }, [location.state]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    try {
      await login(formState);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  const canSubmit = formState.identifier.trim() && formState.password.trim();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_30%),linear-gradient(180deg,_#fff9ef_0%,_#f4f7fb_50%,_#eef4ff_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-slate-950 px-6 py-10 text-white sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
            Time tracker workspace
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Sign in to access your tracked time, edits, and reports.
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
            The app uses JWT authentication from your backend, keeps the session in local storage,
            and automatically protects the dashboard and time entry actions.
          </p>

          <dl className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Backend API</dt>
              <dd className="mt-3 break-all text-sm font-semibold text-white">{API_BASE_URL}</dd>
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Session flow</dt>
              <dd className="mt-3 text-sm font-semibold text-white">JWT + protected routes</dd>
            </div>
          </dl>
        </div>

        <div className="px-6 py-10 sm:px-8 lg:px-10">
          <div className="max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">Login</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Welcome back</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Use your email or username and password to continue to the dashboard.
            </p>

            <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-slate-700">
                Email or username
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  name="identifier"
                  value={formState.identifier}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="username"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Password
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </label>

              {errorMessage ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {errorMessage}
                </div>
              ) : null}

              <button
                className="mt-2 inline-flex items-center justify-center rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={!canSubmit || isLoggingIn}
              >
                {isLoggingIn ? 'Signing in...' : 'Log in'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
