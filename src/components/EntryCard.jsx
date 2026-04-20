import { useEffect, useState } from 'react';
import { toEntryDraft } from '../constants';
import { combineDateAndTimeToIso } from '../utils/dateTime';
import { formatDuration } from '../utils/formatDuration';

const fieldClassName =
  'mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100';

const labelClassName = 'block text-sm font-medium text-slate-700';

function EntryCard({ entry, onUpdate, onDelete, isUpdating, isDeleting }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(() => toEntryDraft(entry));

  useEffect(() => {
    setDraft(toEntryDraft(entry));
  }, [entry]);

  const tags = Array.isArray(entry.tags) ? entry.tags : [];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
  };

  const handleCancel = () => {
    setDraft(toEntryDraft(entry));
    setIsEditing(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    await onUpdate({
      entryId: entry.id,
      entry: {
        name: draft.name.trim(),
        project: draft.project.trim(),
        tags: draft.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        startAt: combineDateAndTimeToIso(draft.startDate, draft.startTime),
        endAt: entry.isActive ? null : combineDateAndTimeToIso(draft.endDate, draft.endTime),
        type: draft.type,
      },
    });

    setIsEditing(false);
  };

  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-slate-950">{entry.name}</h3>
          <p className="text-sm text-slate-600">{entry.project}</p>
          <p className="text-sm text-slate-500">
            {entry.startAt ? new Date(entry.startAt).toLocaleString() : 'No start time'}
            {entry.endAt ? ` - ${new Date(entry.endAt).toLocaleString()}` : ' - Active timer'}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <strong className="text-2xl font-semibold text-slate-950">
            {formatDuration(entry.durationSeconds)}
          </strong>
          <button
            className="inline-flex items-center rounded-xl px-3 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => setIsEditing((current) => !current)}
            type="button"
            disabled={isUpdating || isDeleting || entry.isActive}
            title={entry.isActive ? 'Stop the active timer before editing it.' : 'Edit entry'}
          >
            {entry.isActive ? 'Running' : isEditing ? 'Close editor' : 'Edit'}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <span className="rounded-full bg-white px-3 py-1 text-slate-700 ring-1 ring-slate-200">
          {entry.date}
        </span>
        <span className={`rounded-full px-3 py-1 font-medium ${entry.isActive ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'}`}>
          {entry.isActive ? 'active timer' : entry.type}
        </span>
        {tags.map((tag) => (
          <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-800" key={tag}>
            #{tag}
          </span>
        ))}
      </div>

      {isEditing ? (
        <form className="mt-4 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4" onSubmit={handleSave}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClassName}>
              Name
              <input
                className={fieldClassName}
                name="name"
                value={draft.name}
                onChange={handleChange}
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
                required
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <label className={labelClassName}>
              Start date
              <input
                className={fieldClassName}
                name="startDate"
                type="date"
                value={draft.startDate}
                onChange={handleChange}
              />
            </label>
            <label className={labelClassName}>
              Start time
              <input
                className={fieldClassName}
                name="startTime"
                type="time"
                value={draft.startTime}
                onChange={handleChange}
              />
            </label>
            <label className={labelClassName}>
              End date
              <input
                className={fieldClassName}
                name="endDate"
                type="date"
                value={draft.endDate}
                onChange={handleChange}
              />
            </label>
            <label className={labelClassName}>
              End time
              <input
                className={fieldClassName}
                name="endTime"
                type="time"
                value={draft.endTime}
                onChange={handleChange}
              />
            </label>
            <label className={labelClassName}>
              Type
              <select
                className={fieldClassName}
                name="type"
                value={draft.type}
                onChange={handleChange}
              >
                <option value="manual">Manual</option>
                <option value="timer">Timer</option>
              </select>
            </label>
            <label className={labelClassName}>
              Tags
              <input
                className={fieldClassName}
                name="tags"
                value={draft.tags}
                onChange={handleChange}
                placeholder="frontend, client"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={isUpdating || !draft.name.trim() || !draft.project.trim()}
            >
              {isUpdating ? 'Saving changes...' : 'Save changes'}
            </button>
            <button
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleCancel}
              type="button"
              disabled={isUpdating}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <button
        className="mt-4 inline-flex items-center rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={() => onDelete(entry.id)}
        type="button"
        disabled={isDeleting || isUpdating}
      >
        Delete entry
      </button>
    </article>
  );
}

export default EntryCard;
