import { HabitStatus } from '../../core/streak-engine';

interface DeadlineSettingsProps {
  deadlineDays: number;
  status: HabitStatus;
  onDeadlineChange: (days: number) => void;
}

const STATUS_LABELS: Record<HabitStatus, { label: string; style: string }> = {
  empty: {
    label: 'Ready to Start',
    style: 'bg-slate-700/80 text-slate-100 border-slate-500',
  },
  due: {
    label: 'Due Today',
    style: 'bg-amber-950 text-amber-200 border-amber-600',
  },
  completed: {
    label: 'Completed Today',
    style: 'bg-emerald-950 text-emerald-200 border-emerald-600',
  },
  frozen: {
    label: 'Protected by Freeze',
    style: 'bg-sky-950 text-sky-200 border-sky-600',
  },
  reset: {
    label: 'Streak Reset',
    style: 'bg-rose-950 text-rose-200 border-rose-600',
  },
};

export default function DeadlineSettings({
  deadlineDays,
  status,
  onDeadlineChange,
}: DeadlineSettingsProps) {
  const currentStatus = STATUS_LABELS[status] ?? STATUS_LABELS.empty;

  return (
    <section
      aria-label="Tracker Settings and Status"
      className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-sm space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Current Status
        </span>
        <span
          role="status"
          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${currentStatus.style}`}
        >
          {currentStatus.label}
        </span>
      </div>

      <div className="pt-3 border-t border-slate-700/80 space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="inactivity-deadline"
            className="text-sm font-medium text-slate-200 cursor-pointer"
          >
            Inactivity Deadline
          </label>
          <select
            id="inactivity-deadline"
            aria-label="Inactivity Deadline"
            aria-describedby="deadline-hint"
            value={deadlineDays}
            onChange={(e) => onDeadlineChange(Number(e.target.value))}
            className="bg-slate-900 border border-slate-700 text-slate-100 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:border-emerald-400 cursor-pointer transition-colors"
          >
            <option value={1}>Daily (1 Day)</option>
            <option value={2}>2 Days</option>
            <option value={3}>3 Days</option>
            <option value={5}>5 Days</option>
            <option value={7}>Weekly (7 Days)</option>
          </select>
        </div>
        <p id="deadline-hint" className="text-xs text-slate-400">
          Allowed idle gap between study days before consuming a freeze.
        </p>
      </div>
    </section>
  );
}
