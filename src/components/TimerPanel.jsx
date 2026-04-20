import { formatDuration } from '../utils/formatDuration';

function TimerPanel({ isRunning, elapsedSeconds, timerName, timerProject, startedAt }) {
  if (!isRunning) return null;

  return (
    <section className="flex flex-col gap-4 rounded-[1.6rem] border border-emerald-200 bg-emerald-50 px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
          Timer running
        </p>
        <strong className="mt-2 block text-2xl font-semibold text-slate-950">
          {timerName || 'Untitled task'}
        </strong>
        <p className="mt-1 text-sm text-emerald-900/80">
          {timerProject || 'No project'}{startedAt ? ` - started ${new Date(startedAt).toLocaleString()}` : ''}
        </p>
      </div>
      <strong className="text-3xl font-semibold tabular-nums text-emerald-800">
        {formatDuration(elapsedSeconds)}
      </strong>
    </section>
  );
}

export default TimerPanel;
