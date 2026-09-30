"use client";

import React from 'react';
import { useApp, ScreenId } from '../../context/AppContext';
import { Bell, Clock, Cog, CheckCircle2, ChevronRight } from 'lucide-react';

const TYPE_STYLES: Record<
  string,
  { label: string; icon: React.ElementType; tile: string }
> = {
  RETARD: {
    label: 'Retard',
    icon: Clock,
    tile: 'bg-destructive/10 text-destructive',
  },
  CRON_SYSTEME: {
    label: 'Système',
    icon: Cog,
    tile: 'bg-secondary text-muted-foreground',
  },
};

const DEFAULT_STYLE = {
  label: 'Validation',
  icon: CheckCircle2,
  tile: 'bg-apple-blue-subtle text-apple-blue',
};

export default function NotificationsScreen() {
  const { notifications, navigateTo, markAllNotificationsAsRead, currentRole } = useApp();

  const visible = notifications.filter(
    (n) => n.cibleRole === 'TOUS' || n.cibleRole === currentRole
  );
  const unreadCount = visible.filter((n) => !n.estLue).length;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 font-sans antialiased">
      {/* Header */}
      <header className="flex items-end justify-between gap-4 px-1">
        <div>
          <h2 className="text-2xl md:text-[28px] font-semibold tracking-tight text-foreground">
            Notifications
          </h2>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {unreadCount > 0
              ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}`
              : 'Tout est à jour'}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllNotificationsAsRead}
            className="shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium text-apple-red transition-colors hover:bg-apple-red-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apple-red/40 cursor-pointer"
          >
            Tout marquer comme lu
          </button>
        )}
      </header>

      {/* Empty state */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-border/60 bg-card px-6 py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <Bell className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
          </div>
          <p className="text-[15px] font-medium text-foreground">Aucune notification</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Les alertes et validations apparaîtront ici.
          </p>
        </div>
      ) : (
        /* Grouped list */
        <ul className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          {visible.map((n, i) => {
            const style = TYPE_STYLES[n.type] ?? DEFAULT_STYLE;
            const Icon = style.icon;
            const clickable = Boolean(n.lienEcran);

            return (
              <li
                key={n.id}
                className={i > 0 ? 'border-t border-border/60' : ''}
              >
                <button
                  type="button"
                  disabled={!clickable}
                  onClick={() => {
                    if (n.lienEcran) {
                      navigateTo(n.lienEcran as ScreenId, {
                        salarieId: n.targetId,
                        periodeId: n.targetId,
                      });
                    }
                  }}
                  className={`group flex w-full items-start gap-3.5 px-4 py-3.5 text-left transition-colors focus-visible:outline-none focus-visible:bg-secondary/60 ${
                    clickable ? 'cursor-pointer hover:bg-secondary/50 active:bg-secondary' : 'cursor-default'
                  }`}
                >
                  {/* Icon tile */}
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${style.tile}`}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </span>

                  {/* Content */}
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-3">
                      <span
                        className={`truncate text-[15px] leading-snug text-foreground ${
                          n.estLue ? 'font-medium' : 'font-semibold'
                        }`}
                      >
                        {n.titre}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                        {n.dateCreation} {n.heureCreation}
                      </span>
                    </span>

                    <span className="mt-0.5 block text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
                      {n.message}
                    </span>

                    <span className="mt-1.5 block text-xs font-medium text-muted-foreground/80">
                      {style.label}
                    </span>
                  </span>

                  {/* Trailing: unread dot + chevron */}
                  <span className="flex h-9 shrink-0 items-center gap-2">
                    {!n.estLue && (
                      <span
                        aria-label="Non lue"
                        className="h-2 w-2 rounded-full bg-apple-red"
                      />
                    )}
                    {clickable && (
                      <ChevronRight
                        className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5"
                        strokeWidth={2}
                      />
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}