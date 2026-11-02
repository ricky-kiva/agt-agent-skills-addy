import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MarkDoneButtonProps {
  isCompletedToday: boolean;
  onMarkDone: () => void;
}

export default function MarkDoneButton({
  isCompletedToday,
  onMarkDone,
}: MarkDoneButtonProps) {
  return (
    <section aria-label="Habit Completion Action" className="w-full">
      <Button
        type="button"
        size="lg"
        disabled={isCompletedToday}
        aria-disabled={isCompletedToday}
        onClick={onMarkDone}
        className={cn(
          'w-full h-14 text-base font-semibold tracking-wide transition-all duration-200 shadow-md',
          isCompletedToday
            ? 'bg-slate-800/80 text-slate-400 border border-slate-700/80 cursor-not-allowed shadow-none'
            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40 hover:shadow-emerald-900/40 hover:-translate-y-0.5 active:translate-y-0'
        )}
      >
        {isCompletedToday ? 'Completed Today ✓' : 'Mark Studied Today'}
      </Button>
    </section>
  );
}
