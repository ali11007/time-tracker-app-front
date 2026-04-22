import { useState } from 'react';
import TrackerForm from './components/TrackerForm';
import TimerPanel from './components/TimerPanel';
import EntryList from './components/EntryList';
import ExportBar from './components/ExportBar';
import WorkspaceLibrary from './components/WorkspaceLibrary';
import { useEntries } from './hooks/useEntries';
import { useTimer } from './hooks/useTimer';
import { useWorkspaceCatalog } from './hooks/useWorkspaceCatalog';
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
  const {
    projects,
    tags,
    createProject,
    updateProject,
    deleteProject,
    createTag,
    updateTag,
    deleteTag,
    isLoadingProjects,
    isLoadingTags,
    isCreatingProject,
    isUpdatingProject,
    isDeletingProject,
    isCreatingTag,
    isUpdatingTag,
    isDeletingTag,
  } = useWorkspaceCatalog();
  const timer = useTimer(activeEntry);

  const withActionError = async (callback) => {
    setActionError('');

    try {
      return await callback();
    } catch (requestError) {
      setActionError(readActionError(requestError));
      throw requestError;
    }
  };

  const handleCreateManual = (payload) => withActionError(() => createEntry(payload));

  const handleStartTimer = async (payload) => {
    const entry = await withActionError(() => startTimer(payload));
    timer.start(entry);
    setEntryMode('timer');
  };

  const handleStopTimer = async () => {
    if (!timer.activeTimer?.id) {
      return;
    }

    const stoppedEntry = await withActionError(() => stopTimer(timer.activeTimer.id));
    timer.stop(stoppedEntry);
  };

  const handleDeleteEntry = (entryId) => {
    setActionError('');
    deleteEntry(entryId, {
      onError: (requestError) => setActionError(readActionError(requestError)),
    });
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
                  Track time against curated projects, shared tags, and exports from one workspace.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  Entries now use a saved project library, while tags can be picked from your shared catalog or created naturally as you log work.
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
              <div className="grid min-w-full gap-3 sm:grid-cols-4">
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
                <div className="rounded-[1.4rem] border border-emerald-100 bg-emerald-50 px-5 py-4 text-slate-900">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Projects</p>
                  <strong className="mt-3 block text-3xl font-semibold">
                    {isLoadingProjects ? '...' : projects.length}
                  </strong>
                </div>
                <div className="rounded-[1.4rem] border border-sky-100 bg-sky-50 px-5 py-4 text-slate-900">
                  <p className="text-xs uppercase tracking-[0.2em] text-sky-700">Tags</p>
                  <strong className="mt-3 block text-3xl font-semibold">
                    {isLoadingTags ? '...' : tags.length}
                  </strong>
                </div>
              </div>
              <div className="rounded-[1.4rem] border border-slate-200 bg-white px-5 py-4 text-slate-900">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Base URL</p>
                <strong className="mt-3 block truncate text-sm font-semibold sm:text-base">
                  {API_BASE_URL}
                </strong>
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

        <section className="grid gap-6 xl:grid-cols-[minmax(360px,420px)_1fr]">
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
            projects={projects}
            tags={tags}
            onCreateProject={(payload) => withActionError(() => createProject(payload))}
            isCreatingProject={isCreatingProject}
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
              onDelete={handleDeleteEntry}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
              projects={projects}
              tags={tags}
              onCreateProject={(payload) => withActionError(() => createProject(payload))}
              isCreatingProject={isCreatingProject}
            />
          </section>
        </section>

        <WorkspaceLibrary
          projects={projects}
          tags={tags}
          onCreateProject={(payload) => withActionError(() => createProject(payload))}
          onUpdateProject={(payload) => withActionError(() => updateProject(payload))}
          onDeleteProject={(projectId) => withActionError(() => deleteProject(projectId))}
          onCreateTag={(payload) => withActionError(() => createTag(payload))}
          onUpdateTag={(payload) => withActionError(() => updateTag(payload))}
          onDeleteTag={(tagId) => withActionError(() => deleteTag(tagId))}
          isCreatingProject={isCreatingProject}
          isUpdatingProject={isUpdatingProject}
          isDeletingProject={isDeletingProject}
          isCreatingTag={isCreatingTag}
          isUpdatingTag={isUpdatingTag}
          isDeletingTag={isDeletingTag}
        />
      </div>
    </main>
  );
}

export default App;
