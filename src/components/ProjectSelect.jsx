import { useEffect, useMemo, useState } from 'react';

const inputClassName =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100';

function ProjectSelect({
  label,
  selectedProjectId,
  projects,
  onSelect,
  onCreateProject,
  isCreatingProject,
  canCreateProject = false,
  disabled = false,
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [quickName, setQuickName] = useState('');

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) || null,
    [projects, selectedProjectId],
  );

  useEffect(() => {
    if (selectedProject && !isOpen) {
      setQuery(selectedProject.name);
    }

    if (!selectedProject && !isOpen) {
      setQuery('');
    }
  }, [selectedProject, isOpen]);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return projects;
    }

    return projects.filter((project) => project.name.toLowerCase().includes(normalizedQuery));
  }, [projects, query]);

  const handleSelect = (project) => {
    onSelect(project.id);
    setQuery(project.name);
    setIsOpen(false);
  };

  const handleQuickAdd = async (event) => {
    event.preventDefault();
    const name = quickName.trim();

    if (!name) {
      return;
    }

    try {
      const created = await onCreateProject({ name });
      onSelect(created.id);
      setQuery(created.name);
      setQuickName('');
      setIsQuickAdding(false);
      setIsOpen(false);
    } catch (_error) {
      // The parent surfaces the request error banner.
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        {canCreateProject ? (
          <button
            className="text-sm font-semibold text-sky-700 transition hover:text-sky-900 disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            onClick={() => {
              setIsQuickAdding((current) => !current);
              setQuickName(selectedProject?.name || query);
            }}
            disabled={disabled}
          >
            {isQuickAdding ? 'Close quick add' : 'Quick add project'}
          </button>
        ) : (
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Admins add projects
          </span>
        )}
      </div>

      <div className="relative">
        <input
          className={inputClassName}
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(event) => {
            const nextValue = event.target.value;
            setQuery(nextValue);
            setIsOpen(true);

            if (selectedProject && nextValue !== selectedProject.name) {
              onSelect('');
            }
          }}
          onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
          placeholder={projects.length ? 'Search created projects' : 'Ask an admin to add a project'}
          disabled={disabled}
        />

        {selectedProject ? (
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
              Selected
            </span>
          </div>
        ) : null}

        {isOpen ? (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
            <div className="border-b border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Created projects
            </div>
            <div className="max-h-64 overflow-y-auto p-2">
              {filteredProjects.length ? (
                filteredProjects.map((project) => (
                  <button
                    key={project.id}
                    className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm transition ${
                      project.id === selectedProjectId
                        ? 'bg-sky-50 text-sky-900'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelect(project)}
                    type="button"
                  >
                    <span>{project.name}</span>
                    {project.id === selectedProjectId ? (
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Active</span>
                    ) : null}
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                  No saved project matches "{query.trim()}".
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {isQuickAdding && canCreateProject ? (
        <form
          className="grid gap-3 rounded-2xl border border-sky-100 bg-sky-50/80 p-4 sm:grid-cols-[1fr_auto]"
          onSubmit={handleQuickAdd}
        >
          <input
            className={inputClassName}
            value={quickName}
            onChange={(event) => setQuickName(event.target.value)}
            placeholder="New project name"
            disabled={disabled || isCreatingProject}
          />
          <button
            className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={disabled || isCreatingProject || !quickName.trim()}
          >
            {isCreatingProject ? 'Saving...' : 'Create and select'}
          </button>
        </form>
      ) : null}
    </div>
  );
}

export default ProjectSelect;
