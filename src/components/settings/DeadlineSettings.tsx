import { HabitStatus } from '../../core/streak-engine';

interface DeadlineSettingsProps {
  deadlineDays: number;
  status: HabitStatus;
  onDeadlineChange: (days: number) => void;
}

const STATUS_LABELS: Record<HabitStatus, { label: string; style: string }> = {
  empty: {
    label: 'Ready to Start',
    style: 'bg-slate-700 text-slate-300 border-slate-600',
  },
  due: {
    label: 'Due Today',
    style: 'bg-amber-950/70 text-amber-300 border-amber-800/60',
  },
  completed: {
    label: 'Completed Today',
    style: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60',
  },
  frozen: {
    label: 'Protected by Freeze',
    style: 'bg-cyan-950/70 text-cyan-300 border-cyan-800/60',
  },
  reset: {
    label: 'Streak Reset',
    style: 'bg-rose-950/70 text-rose-300 border-rose-800/60',
  },
};

export default function DeadlineSettings({
  deadlineDays,
  status,
  onDeadlineChange,
}: DeadlineSettingsProps) {
  const currentStatus = STATUS_LABELS[status];

  return (
    <section className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Current Status
        </span>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${currentStatus.style}`}
        >
          {currentStatus.label}
        </span>
      </div>

      <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
        <label
          htmlFor="inactivity-deadline"
          className="text-sm font-medium text-slate-300 cursor-pointer"
        >
          Inactivity Deadline
        </label>
        <select
          id="inactivity-deadline"
          aria-label="Inactivity Deadline"
          value={deadlineDays}
          onChange={(e) => onDeadlineChange(Number(e.target.value))}
          className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
        >
          <option value={1}>Daily (1 Day)</option>
          <option value={2}>2 Days</option>
          <option value={3}>3 Days</option>
          <option value={5}>5 Days</option>
          <option value={7}>Weekly (7 Days)</option>
        </select>
      </div>
    </section>
  );
}
