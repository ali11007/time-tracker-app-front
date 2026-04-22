import { useMemo, useState } from 'react';

const inputClassName =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100';

const normalizeTag = (value) => value.trim().toLowerCase();

function TagInput({ label, value, suggestions, onChange, disabled = false }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const normalizedSelected = useMemo(
    () => new Set((value || []).map((tag) => normalizeTag(tag))),
    [value],
  );

  const filteredSuggestions = useMemo(() => {
    const normalizedQuery = normalizeTag(query);

    return (suggestions || []).filter((tag) => {
      if (normalizedSelected.has(normalizeTag(tag.name))) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return tag.name.toLowerCase().includes(normalizedQuery);
    });
  }, [suggestions, query, normalizedSelected]);

  const addTag = (tagName) => {
    const trimmedTag = tagName.trim();
    const normalized = normalizeTag(trimmedTag);

    if (!normalized || normalizedSelected.has(normalized)) {
      setQuery('');
      return;
    }

    onChange([...(value || []), trimmedTag]);
    setQuery('');
    setIsOpen(false);
  };

  const removeTag = (tagName) => {
    const normalized = normalizeTag(tagName);
    onChange((value || []).filter((tag) => normalizeTag(tag) !== normalized));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addTag(query);
    }

    if (event.key === 'Backspace' && !query && value?.length) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Type, enter, or pick saved tags
        </span>
      </div>

      <div className="rounded-[1.6rem] border border-slate-200 bg-white p-3 shadow-sm transition focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-100">
        <div className="mb-3 flex flex-wrap gap-2">
          {(value || []).length ? (
            value.map((tag) => (
              <button
                key={tag}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800 ring-1 ring-emerald-100 transition hover:bg-emerald-100"
                type="button"
                onClick={() => removeTag(tag)}
                disabled={disabled}
              >
                <span>#{tag}</span>
                <span className="text-emerald-600">x</span>
              </button>
            ))
          ) : (
            <p className="text-sm text-slate-400">No tags selected yet.</p>
          )}
        </div>

        <div className="relative">
          <input
            className={inputClassName}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
            onKeyDown={handleKeyDown}
            placeholder="Search tags or create a new one"
            disabled={disabled}
          />

          {query.trim() ? (
            <button
              className="absolute inset-y-0 right-3 my-auto inline-flex h-9 items-center justify-center rounded-full bg-slate-950 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-white"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => addTag(query)}
              type="button"
              disabled={disabled}
            >
              Add
            </button>
          ) : null}

          {isOpen ? (
            <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
              <div className="border-b border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Saved tags
              </div>
              <div className="max-h-56 overflow-y-auto p-2">
                {filteredSuggestions.length ? (
                  filteredSuggestions.slice(0, 8).map((tag) => (
                    <button
                      key={tag.id}
                      className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => addTag(tag.name)}
                      type="button"
                    >
                      <span>{tag.name}</span>
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Pick</span>
                    </button>
                  ))
                ) : query.trim() ? (
                  <button
                    className="w-full rounded-2xl border border-dashed border-sky-200 bg-sky-50 px-4 py-5 text-left text-sm text-sky-800 transition hover:bg-sky-100"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => addTag(query)}
                    type="button"
                  >
                    Save "{query.trim()}" with this entry
                  </button>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                    All saved tags are already selected.
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default TagInput;
