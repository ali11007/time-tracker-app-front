import { useMemo, useState } from 'react';

const inputClassName =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100';

function EditableRow({ item, kind, onSave, onDelete, isSaving, isDeleting }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(item.name);

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      await onSave(item.id, draftName.trim());
      setIsEditing(false);
    } catch (_error) {
      // The parent surfaces the request error banner.
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
      {isEditing ? (
        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSave}>
          <input
            className={inputClassName}
            value={draftName}
            onChange={(event) => setDraftName(event.target.value)}
            disabled={isSaving}
          />
          <div className="flex gap-2">
            <button
              className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={isSaving || !draftName.trim()}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
              type="button"
              onClick={() => {
                setDraftName(item.name);
                setIsEditing(false);
              }}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">{item.name}</p>
            <p className="text-xs text-slate-500">{kind}</p>
          </div>
          <div className="flex gap-2">
            <button
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              type="button"
              onClick={() => setIsEditing(true)}
              disabled={isSaving || isDeleting}
            >
              Rename
            </button>
            <button
              className="inline-flex items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              onClick={async () => {
                try {
                  await onDelete(item.id);
                } catch (_error) {
                  // The parent surfaces the request error banner.
                }
              }}
              disabled={isSaving || isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function LibrarySection({
  title,
  subtitle,
  items,
  createLabel,
  createPlaceholder,
  kind,
  onCreate,
  onUpdate,
  onDelete,
  isCreating,
  isSaving,
  isDeleting,
}) {
  const [draftName, setDraftName] = useState('');
  const visibleItems = useMemo(() => items || [], [items]);

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      await onCreate({ name: draftName.trim() });
      setDraftName('');
    } catch (_error) {
      // The parent surfaces the request error banner.
    }
  };

  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
          {visibleItems.length} saved
        </span>
      </div>

      <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={handleCreate}>
        <input
          className={inputClassName}
          value={draftName}
          onChange={(event) => setDraftName(event.target.value)}
          placeholder={createPlaceholder}
          disabled={isCreating}
        />
        <button
          className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isCreating || !draftName.trim()}
        >
          {isCreating ? 'Saving...' : createLabel}
        </button>
      </form>

      <div className="mt-4 grid gap-3">
        {visibleItems.length ? (
          visibleItems.map((item) => (
            <EditableRow
              key={item.id}
              item={item}
              kind={kind}
              onSave={(itemId, name) => onUpdate({ [`${kind}Id`]: itemId, [kind]: { name } })}
              onDelete={onDelete}
              isSaving={isSaving}
              isDeleting={isDeleting}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            Nothing saved yet.
          </div>
        )}
      </div>
    </section>
  );
}

function WorkspaceLibrary(props) {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <LibrarySection
        title="Projects"
        subtitle="Curate the list your team can track against."
        items={props.projects}
        createLabel="Add project"
        createPlaceholder="Add a project people can select"
        kind="project"
        onCreate={props.onCreateProject}
        onUpdate={props.onUpdateProject}
        onDelete={props.onDeleteProject}
        isCreating={props.isCreatingProject}
        isSaving={props.isUpdatingProject}
        isDeleting={props.isDeletingProject}
      />
      <LibrarySection
        title="Tags"
        subtitle="Keep a shared vocabulary for areas of work."
        items={props.tags}
        createLabel="Add tag"
        createPlaceholder="Add a reusable tag"
        kind="tag"
        onCreate={props.onCreateTag}
        onUpdate={props.onUpdateTag}
        onDelete={props.onDeleteTag}
        isCreating={props.isCreatingTag}
        isSaving={props.isUpdatingTag}
        isDeleting={props.isDeletingTag}
      />
    </section>
  );
}

export default WorkspaceLibrary;
