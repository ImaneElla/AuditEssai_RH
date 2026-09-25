'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type MetricTint = 'brand' | 'blue' | 'amber' | 'neutral' | 'danger';

const tintStyles: Record<
  MetricTint,
  { icon: string; value?: string }
> = {
  brand: {
    icon: 'bg-primary/10 text-primary',
  },
  blue: {
    icon: 'bg-[#007AFF]/10 text-[#007AFF]',
  },
  amber: {
    icon: 'bg-[#FF9500]/12 text-[#C93400]',
  },
  neutral: {
    icon: 'bg-zinc-100 text-zinc-600',
  },
  danger: {
    icon: 'bg-rose-500/10 text-rose-600',
    value: 'text-rose-600',
  },
};

export type MetricCardProps = {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ReactNode;
  onClick?: () => void;
  tint?: MetricTint;
  footer?: React.ReactNode;
  className?: string;
};

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  onClick,
  tint = 'brand',
  footer,
  className,
}: MetricCardProps) {
  const styles = tintStyles[tint];

  return (
    <Card
      onClick={onClick}
      className={cn(
        'apple-metric-card group cursor-pointer p-5',
        onClick && 'hover:shadow-md',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]',
            styles.icon
          )}
        >
          {icon}
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100/80 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100">
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
        </div>
      </div>

      <p className="apple-section-label mt-4">{title}</p>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0">
        <span
          className={cn(
            'text-[2rem] font-semibold leading-none tracking-tight text-foreground tabular-nums',
            styles.value
          )}
        >
          {value}
        </span>
        <span className="text-[11px] font-medium text-muted-foreground">{subtitle}</span>
      </div>
      {footer ? <div className="mt-4">{footer}</div> : null}
    </Card>
  );
}
