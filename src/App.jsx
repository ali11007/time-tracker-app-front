import { useState } from 'react';
import TrackerForm from './components/TrackerForm';
import TimerPanel from './components/TimerPanel';
import EntryList from './components/EntryList';
import ExportBar from './components/ExportBar';
import { useEntries } from './hooks/useEntries';
import { useTimer } from './hooks/useTimer';
import { formatDuration } from './utils/formatDuration';
import { API_BASE_URL } from './constants';
import { useAuth } from './context/AuthContext';

const formatUserLabel = (user) => {
  if (!user) {
    return 'Signed in';
  }

  return (
    user.name ||
    user.username ||
    user.email ||
    [user.firstName, user.lastName].filter(Boolean).join(' ') ||
    'Signed in'
  );
};

const readActionError = (error) =>
  error?.response?.data?.message || error?.message || 'The request failed. Please try again.';

function App() {
  const [entryMode, setEntryMode] = useState('manual');
  const [filterText, setFilterText] = useState('');
  const [actionError, setActionError] = useState('');
  const { currentUser, logout } = useAuth();
  const {
    entries,
    activeEntry,
    totalTrackedSeconds,
    isLoading,
    isError,
    error,
    createEntry,
    startTimer,
    stopTimer,
    updateEntry,
    deleteEntry,
    isCreating,
    isStartingTimer,
    isStoppingTimer,
    isUpdating,
    isDeleting,
  } = useEntries(filterText);
  const timer = useTimer(activeEntry);

  const handleCreateManual = async (payload) => {
    setActionError('');

    try {
      await createEntry(payload);
    } catch (requestError) {
      setActionError(readActionError(requestError));
    }
  };

  const handleStartTimer = async (payload) => {
    setActionError('');

    try {
      const entry = await startTimer(payload);
      timer.start(entry);
      setEntryMode('timer');
    } catch (requestError) {
      setActionError(readActionError(requestError));
    }
  };

  const handleStopTimer = async () => {
    if (!timer.activeTimer?.id) {
      return;
    }

    setActionError('');

    try {
      const stoppedEntry = await stopTimer(timer.activeTimer.id);
      timer.stop(stoppedEntry);
    } catch (requestError) {
      setActionError(readActionError(requestError));
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_30%),linear-gradient(180deg,_#fff9ef_0%,_#f4f7fb_50%,_#eef4ff_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur xl:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
                  API-connected tracker
                </p>
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-medium text-white">
                  {formatUserLabel(currentUser)}
                </span>
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  Track manual work, live timers, and exports from one workspace.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  Manual entries now capture real start and end timestamps, while timer entries start on the backend, survive reloads, and stop by entry id.
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 lg:max-w-xl">
              <div className="flex justify-end">
                <button
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  type="button"
                  onClick={logout}
                >
                  Log out
                </button>
              </div>
              <div className="grid min-w-full gap-3 sm:grid-cols-3">
                <div className="rounded-[1.4rem] bg-slate-950 px-5 py-4 text-white shadow-lg shadow-slate-950/10">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Entries</p>
                  <strong className="mt-3 block text-3xl font-semibold">{entries.length}</strong>
                </div>
                <div className="rounded-[1.4rem] bg-slate-950 px-5 py-4 text-white shadow-lg shadow-slate-950/10">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Tracked</p>
                  <strong className="mt-3 block text-3xl font-semibold">
                    {formatDuration(totalTrackedSeconds)}
                  </strong>
                </div>
                <div className="rounded-[1.4rem] border border-sky-100 bg-sky-50 px-5 py-4 text-slate-900">
                  <p className="text-xs uppercase tracking-[0.2em] text-sky-700">Base URL</p>
                  <strong className="mt-3 block truncate text-sm font-semibold sm:text-base">
                    {API_BASE_URL}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <TimerPanel
          isRunning={timer.isRunning}
          elapsedSeconds={timer.elapsedSeconds}
          timerName={timer.activeTimer?.name}
          timerProject={timer.activeTimer?.project}
          startedAt={timer.activeTimer?.startAt}
        />

        {isError ? (
          <section className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 shadow-sm">
            Could not load entries from the API. {error?.message || 'Check the backend server and base URL.'}
          </section>
        ) : null}

        {actionError ? (
          <section className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 shadow-sm">
            {actionError}
          </section>
        ) : null}

        <section className="grid gap-6 xl:grid-cols-[minmax(340px,400px)_1fr]">
          <TrackerForm
            entryMode={entryMode}
            onModeChange={setEntryMode}
            onSubmitManual={handleCreateManual}
            onStartTimer={handleStartTimer}
            onStopTimer={handleStopTimer}
            isTimerRunning={timer.isRunning}
            isCreating={isCreating}
            isStartingTimer={isStartingTimer}
            isStoppingTimer={isStoppingTimer}
            activeTimer={timer.activeTimer}
          />

          <section className="rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6">
            <ExportBar
              entries={entries}
              filterText={filterText}
              onFilterChange={setFilterText}
              isLoading={isLoading}
            />
            <EntryList
              entries={entries}
              isLoading={isLoading}
              onUpdate={updateEntry}
              onDelete={deleteEntry}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
            />
          </section>
        </section>
      </div>
    </main>
  );
}

export default App;
