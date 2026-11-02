import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface FreezeBankProps {
  freezes: number;
  freezeProgress: number;
}

export default function FreezeBank({
  freezes,
  freezeProgress,
}: FreezeBankProps) {
  const isFull = freezes >= 2;

  return (
    <section aria-label="Streak Freeze Bank" className="w-full">
      <Card className="border border-border/80 bg-card/80 shadow-sm backdrop-blur-sm">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-slate-100">Freeze Bank</h2>
                <Badge
                  variant={isFull ? 'sky' : freezes > 0 ? 'emerald' : 'muted'}
                  className="text-[10px] px-2 py-0"
                >
                  {isFull ? 'Max Capacity' : freezes > 0 ? 'Protected' : 'Unprotected'}
                </Badge>
              </div>
              <div className="text-xs text-slate-300 font-medium">
                {freezes} / 2 freezes available
              </div>
            </div>

            <div
              className="flex items-center gap-2 select-none"
              aria-label="Freeze slots"
              role="group"
            >
              <span
                role="img"
                aria-label={`Freeze slot 1: ${freezes >= 1 ? 'active' : 'empty'}`}
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-xl border text-xl transition-all duration-200',
                  freezes >= 1
                    ? 'border-sky-500/40 bg-sky-950/40 opacity-100 shadow-[0_0_12px_rgba(56,189,248,0.2)] scale-105'
                    : 'border-slate-800 bg-slate-900/50 opacity-30 grayscale'
                )}
              >
                🧊
              </span>
              <span
                role="img"
                aria-label={`Freeze slot 2: ${freezes >= 2 ? 'active' : 'empty'}`}
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-xl border text-xl transition-all duration-200',
                  freezes >= 2
                    ? 'border-sky-500/40 bg-sky-950/40 opacity-100 shadow-[0_0_12px_rgba(56,189,248,0.2)] scale-105'
                    : 'border-slate-800 bg-slate-900/50 opacity-30 grayscale'
                )}
              >
                🧊
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-border/60">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-400">Next Freeze Progress</span>
              <span className={cn(isFull ? 'text-sky-300' : 'text-amber-300')}>
                {isFull ? 'Bank full' : `${freezeProgress}/3 days to next freeze`}
              </span>
            </div>

            {!isFull && (
              <Progress
                value={freezeProgress}
                max={3}
                indicatorClassName="bg-amber-500"
                className="h-1.5 bg-slate-800"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
