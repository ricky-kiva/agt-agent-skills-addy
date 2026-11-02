import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow-sm',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow-sm',
        outline: 'border-border text-foreground',
        emerald:
          'border-emerald-600/50 bg-emerald-950/80 text-emerald-200 shadow-sm',
        amber:
          'border-amber-600/50 bg-amber-950/80 text-amber-200 shadow-sm',
        sky: 'border-sky-600/50 bg-sky-950/80 text-sky-200 shadow-sm',
        rose: 'border-rose-600/50 bg-rose-950/80 text-rose-200 shadow-sm',
        muted:
          'border-slate-700 bg-slate-800/80 text-slate-300 shadow-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';
