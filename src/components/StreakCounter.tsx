import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StreakCounterProps {
  streak: number;
}

export default function StreakCounter({ streak }: StreakCounterProps) {
  const isZero = streak === 0;

  return (
    <section aria-label="Streak Counter" className="w-full">
      <Card
        className={cn(
          'relative overflow-hidden text-center transition-all duration-300 border',
          isZero
            ? 'border-border/60 bg-card/60'
            : 'border-amber-500/30 bg-gradient-to-b from-amber-500/[0.04] to-card shadow-amber-950/10 shadow-lg'
        )}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-3">
            <span
              role="img"
              aria-label="Streak status"
              className={cn(
                'text-4xl select-none transition-transform duration-300 inline-block',
                !isZero && 'scale-110 drop-shadow-[0_2px_8px_rgba(245,158,11,0.35)]'
              )}
            >
              {isZero ? '✨' : '🔥'}
            </span>
            <span className="text-6xl font-black text-amber-400 tracking-tight font-mono tabular-nums">
              {streak}
            </span>
          </div>

          <div className="text-sm font-semibold text-slate-300 mt-2 uppercase tracking-wider">
            {isZero ? 'Start your streak today!' : 'Day Streak'}
          </div>

          <div className="mt-3 flex justify-center">
            <Badge
              variant={isZero ? 'muted' : 'amber'}
              className="text-[11px] font-medium tracking-wide"
            >
              {isZero ? 'Ready to begin' : streak >= 7 ? 'On Fire 🔥' : 'Streak Active'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
