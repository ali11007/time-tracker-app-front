import { useState } from 'react';
import { trackerApi } from '../api/trackerApi';
import { downloadApiExport, exportCsv, exportJson } from '../utils/exportHelpers';

function ExportBar({ entries, filterText, onFilterChange, isLoading, isAdmin = false }) {
  const hasEntries = entries.length > 0;
  const canExport = isAdmin || hasEntries;
  const [exportingFormat, setExportingFormat] = useState('');

  const handleExport = async (format) => {
    const fallbackExport = format === 'json' ? exportJson : exportCsv;

    setExportingFormat(format);

    try {
      const response = await trackerApi.exportEntries(format, filterText);
      downloadApiExport(response, format);
    } catch (error) {
      // Keep exports available if the backend route is still missing or fails.
      fallbackExport(entries);
    } finally {
      setExportingFormat('');
    }
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">Entries</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">Filter and export tracked time</h2>
        {isAdmin ? (
          <p className="mt-2 text-sm text-slate-500">Exports include matching entries from all users.</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
        <input
          className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 sm:min-w-[260px]"
          placeholder={isAdmin ? 'Filter by task, user, project, tag, or date' : 'Filter by task, project, tag, or date'}
          value={filterText}
          onChange={(event) => onFilterChange(event.target.value)}
        />
        <button
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          onClick={() => handleExport('json')}
          disabled={!canExport || isLoading || Boolean(exportingFormat)}
        >
          {exportingFormat === 'json' ? 'Exporting JSON...' : 'Export JSON'}
        </button>
        <button
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          onClick={() => handleExport('csv')}
          disabled={!canExport || isLoading || Boolean(exportingFormat)}
        >
          {exportingFormat === 'csv' ? 'Exporting CSV...' : 'Export CSV'}
        </button>
      </div>
    </div>
  );
}

export default ExportBar;
