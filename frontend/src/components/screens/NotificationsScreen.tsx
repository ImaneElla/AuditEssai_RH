"use client";

import React from 'react';
import { useApp, ScreenId } from '../../context/AppContext';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function NotificationsScreen() {
  const { notifications, navigateTo, markAllNotificationsAsRead, currentRole } = useApp();

  const visible = notifications.filter(
    (n) => n.cibleRole === 'TOUS' || n.cibleRole === currentRole
  );

  return (
    <div className="space-y-5 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-foreground tracking-tight">
            Centre de Notifications &amp; Alertes
          </h2>
          <p className="text-xs text-muted-foreground">
            Historique des alertes système, retards et validations
          </p>
        </div>
        {visible.some((n) => !n.estLue) && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllNotificationsAsRead}
            className="shrink-0 cursor-pointer"
          >
            Tout marquer comme lu
          </Button>
        )}
      </div>

      {visible.length === 0 ? (
        <Card className="p-10 text-center border-border">
          <Bell className="w-8 h-8 mx-auto text-muted-foreground mb-3" strokeWidth={1.5} />
          <p className="text-sm text-muted-foreground">Aucune notification</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {visible.map((n) => (
            <Card
              key={n.id}
              className={`p-4 border-border hover:border-zinc-300 transition-colors cursor-pointer ${
                !n.estLue ? 'bg-primary/5' : ''
              }`}
              onClick={() => {
                if (n.lienEcran) {
                  navigateTo(n.lienEcran as ScreenId, {
                    salarieId: n.targetId,
                    periodeId: n.targetId,
                  });
                }
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    n.type === 'RETARD'
                      ? 'bg-destructive/15 text-destructive'
                      : n.type === 'CRON_SYSTEME'
                        ? 'bg-secondary text-foreground'
                        : 'bg-apple-blue-subtle text-apple-blue'
                  }`}
                >
                  {n.type}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {n.dateCreation} · {n.heureCreation}
                </span>
              </div>
              <p className="font-semibold text-foreground text-sm">{n.titre}</p>
              <p className="text-muted-foreground text-xs mt-1">{n.message}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
