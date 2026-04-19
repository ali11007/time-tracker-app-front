import EntryCard from './EntryCard';

function EntryList({ entries, isLoading, onUpdate, onDelete, isUpdating, isDeleting }) {
  return (
    <div className="mt-6 grid gap-4">
      {isLoading ? <p className="text-sm text-slate-500">Loading entries from the API...</p> : null}

      {entries.map((entry) => (
        <EntryCard
          key={entry.id}
          entry={entry}
          onUpdate={onUpdate}
          onDelete={onDelete}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />
      ))}

      {!isLoading && entries.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          No entries match your current filter.
        </p>
      ) : null}
    </div>
  );
}

export default EntryList;
