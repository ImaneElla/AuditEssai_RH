"use client";

import React, { useState } from 'react';
import { useApp, ScreenId } from '../../context/AppContext';
import { Bell, Clock, Cog, CheckCircle2, ChevronRight, CheckCheck, UserCheck, ShieldAlert } from 'lucide-react';

const TYPE_STYLES: Record<
  string,
  { label: string; icon: React.ElementType; tile: string }
> = {
  RETARD: {
    label: 'Retard',
    icon: Clock,
    tile: 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400',
  },
  CRON_SYSTEME: {
    label: 'Système',
    icon: Cog,
    tile: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  },
  EVALUATION: {
    label: 'Évaluation',
    icon: UserCheck,
    tile: 'bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
  },
  VALIDATION: {
    label: 'Validation RH',
    icon: CheckCircle2,
    tile: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
  },
};

const DEFAULT_STYLE = {
  label: 'Alerte',
  icon: ShieldAlert,
  tile: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
};

export default function NotificationsScreen() {
  const {
    notifications,
    navigateTo,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    currentRole
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Include notifications for TOUS, matching currentRole, or without specific role restriction
  const roleNotifications = notifications.filter(
    (n) => !n.cibleRole || n.cibleRole === 'TOUS' || n.cibleRole === currentRole || n.cibleRole === 'ADMIN_RH'
  );

  const visible = filter === 'unread'
    ? roleNotifications.filter(n => !n.estLue)
    : roleNotifications;

  const unreadCount = roleNotifications.filter((n) => !n.estLue).length;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 font-sans antialiased pb-10">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1">
        <div>
          <h2 className="text-2xl md:text-[28px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Centre de Notifications & Alertes
          </h2>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {unreadCount > 0
              ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
              : 'Toutes vos notifications sont à jour.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs Filter */}
          <div className="flex items-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-0.5">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                filter === 'all'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              Toutes ({roleNotifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                filter === 'unread'
                  ? 'bg-white dark:bg-zinc-800 text-red-600 dark:text-red-400 shadow-2xs font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              Non lues ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllNotificationsAsRead}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer shadow-2xs"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Tout marquer comme lu</span>
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 px-6 py-16 text-center shadow-2xs">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500">
            <Bell className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Aucune notification</p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {filter === 'unread'
              ? 'Toutes les notifications ont été lues.'
              : 'Les nouvelles alertes, créations de salariés et validations apparaîtront ici.'}
          </p>
        </div>
      ) : (
        <ul className="overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-2xs divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {visible.map((n) => {
            const style = TYPE_STYLES[n.type] ?? DEFAULT_STYLE;
            const Icon = style.icon;
            const clickable = Boolean(n.lienEcran);

            return (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => {
                    markNotificationAsRead(n.id);
                    if (n.lienEcran) {
                      navigateTo(n.lienEcran as ScreenId, {
                        salarieId: n.targetId,
                        periodeId: n.targetId,
                      });
                    }
                  }}
                  className={`group flex w-full items-start gap-3.5 px-4 py-3.5 text-left transition-colors cursor-pointer ${
                    !n.estLue
                      ? 'bg-red-50/20 dark:bg-red-950/10 hover:bg-red-50/40 dark:hover:bg-red-950/20'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  {/* Icon tile */}
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${style.tile}`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>

                  {/* Content */}
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-3">
                      <span
                        className={`truncate text-xs md:text-sm leading-snug text-zinc-900 dark:text-zinc-100 ${
                          n.estLue ? 'font-medium' : 'font-bold'
                        }`}
                      >
                        {n.titre}
                      </span>
                      <span className="shrink-0 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 tabular-nums">
                        {n.dateCreation} {n.heureCreation}
                      </span>
                    </span>

                    <span className="mt-1 block text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {n.message}
                    </span>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {style.label}
                      </span>
                      {n.priorite === 'HAUTE' || n.priorite === 'URGENTE' ? (
                        <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase">
                          • {n.priorite}
                        </span>
                      ) : null}
                    </div>
                  </span>

                  {/* Trailing: unread dot + chevron */}
                  <span className="flex h-9 shrink-0 items-center gap-2">
                    {!n.estLue && (
                      <span
                        aria-label="Non lue"
                        className="h-2 w-2 rounded-full bg-red-600 ring-4 ring-red-100 dark:ring-red-950/60"
                      />
                    )}
                    {clickable && (
                      <ChevronRight
                        className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-0.5"
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