import { useState } from 'react';
import { DEFAULT_DRAFT, today } from '../constants';

const fieldClassName =
  'mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100';

const labelClassName = 'block text-sm font-medium text-slate-700';

function TrackerForm({
  entryMode,
  onModeChange,
  onSubmitManual,
  onStartTimer,
  onStopTimer,
  isTimerRunning,
  isCreating,
}) {
  const [draft, setDraft] = useState(DEFAULT_DRAFT);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
  };

  const resetDraft = () => {
    setDraft({ ...DEFAULT_DRAFT, date: today() });
  };

  const handleManualSubmit = async (event) => {
    event.preventDefault();

    await onSubmitManual({
      name: draft.name.trim(),
      project: draft.project.trim(),
      tags: draft.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      date: draft.date,
      durationSeconds: Math.max(60, Number(draft.durationMinutes || 0) * 60),
      type: 'manual',
    });

    resetDraft();
  };

  const handleStartTimer = () => {
    onStartTimer(draft);
  };

  const handleStopTimer = async () => {
    await onStopTimer();
    resetDraft();
  };

  const canSubmit = draft.name.trim() && draft.project.trim();

  return (
    <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
            New entry
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Capture manual work or a live timer</h2>
        </div>

        <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1">
          <button
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              entryMode === 'manual'
                ? 'bg-slate-950 text-white shadow'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => onModeChange('manual')}
            type="button"
          >
            Manual
          </button>
          <button
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              entryMode === 'timer'
                ? 'bg-slate-950 text-white shadow'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => onModeChange('timer')}
            type="button"
          >
            Timer
          </button>
        </div>
      </div>

      <form className="grid gap-4" onSubmit={handleManualSubmit}>
        <label className={labelClassName}>
          Name
          <input
            className={fieldClassName}
            name="name"
            value={draft.name}
            onChange={handleChange}
            placeholder="What are you working on?"
            required
          />
        </label>

        <label className={labelClassName}>
          Project
          <input
            className={fieldClassName}
            name="project"
            value={draft.project}
            onChange={handleChange}
            placeholder="Project name"
            required
          />
        </label>

        <label className={labelClassName}>
          Tags (comma-separated)
          <input
            className={fieldClassName}
            name="tags"
            value={draft.tags}
            onChange={handleChange}
            placeholder="e.g. frontend, client, export"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClassName}>
            Date
            <input
              className={fieldClassName}
              name="date"
              type="date"
              value={draft.date}
              onChange={handleChange}
            />
          </label>

          {entryMode === 'manual' ? (
            <label className={labelClassName}>
              Duration (minutes)
              <input
                className={fieldClassName}
                name="durationMinutes"
                type="number"
                min="1"
                value={draft.durationMinutes}
                onChange={handleChange}
              />
            </label>
          ) : (
            <div className="rounded-2xl border border-dashed border-sky-200 bg-sky-50/70 px-4 py-3 text-sm text-sky-800">
              Timer entries use the live start/stop duration and submit the same metadata.
            </div>
          )}
        </div>

        {entryMode === 'manual' ? (
          <button
            className="mt-2 inline-flex items-center justify-center rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={!canSubmit || isCreating}
          >
            {isCreating ? 'Saving entry...' : 'Add entry'}
          </button>
        ) : !isTimerRunning ? (
          <button
            className="mt-2 inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            disabled={!canSubmit}
            onClick={handleStartTimer}
          >
            Start timer
          </button>
        ) : (
          <button
            className="mt-2 inline-flex items-center justify-center rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-500"
            type="button"
            onClick={handleStopTimer}
          >
            Stop timer and save
          </button>
        )}
      </form>
    </section>
  );
}

export default TrackerForm;
