import { Card, CardContent } from '@/components/ui/card';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import type { HabitStatus } from '@/core/streak-engine';

interface DeadlineSettingsProps {
  deadlineDays: number;
  status: HabitStatus;
  onDeadlineChange: (days: number) => void;
}

const STATUS_CONFIG: Record<
  HabitStatus,
  { label: string; variant: NonNullable<BadgeProps['variant']> }
> = {
  empty: {
    label: 'Ready to Start',
    variant: 'muted',
  },
  due: {
    label: 'Due Today',
    variant: 'amber',
  },
  completed: {
    label: 'Completed Today',
    variant: 'emerald',
  },
  frozen: {
    label: 'Protected by Freeze',
    variant: 'sky',
  },
  reset: {
    label: 'Streak Reset',
    variant: 'rose',
  },
};

export default function DeadlineSettings({
  deadlineDays,
  status,
  onDeadlineChange,
}: DeadlineSettingsProps) {
  const currentStatus = STATUS_CONFIG[status] ?? STATUS_CONFIG.empty;

  return (
    <section aria-label="Tracker Settings and Status" className="w-full">
      <Card className="border border-border/80 bg-card/80 shadow-sm backdrop-blur-sm">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Current Status
            </span>
            <Badge
              role="status"
              variant={currentStatus.variant}
              className="text-xs font-semibold px-2.5 py-1"
            >
              {currentStatus.label}
            </Badge>
          </div>

          <div className="pt-3 border-t border-border/60 space-y-2">
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
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (Number.isInteger(val) && val >= 1 && val <= 7) {
                    onDeadlineChange(val);
                  }
                }}
                className="bg-secondary/80 border border-border text-foreground text-sm rounded-lg px-3 py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring cursor-pointer transition-colors shadow-sm"
              >
                <option value={1}>Daily (1 Day)</option>
                <option value={2}>2 Days</option>
                <option value={3}>3 Days</option>
                <option value={5}>5 Days</option>
                <option value={7}>Weekly (7 Days)</option>
              </select>
            </div>
            <p id="deadline-hint" className="text-xs text-muted-foreground leading-relaxed">
              Allowed idle gap between study days before consuming a freeze.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
