"use client";

import { useApp } from '../../context/AppContext';
import { AlertTriangle, Clock, CheckCircle2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function RetardsScreen() {
  const { periodes, navigateTo, currentRole } = useApp();

  const isRH = currentRole === 'ADMIN_RH';

  // Règles de statut :
  // EN_COURS   = avant 3 semaines (J-21 à J-15)
  // EN_RELANCE = avant 2 semaines (J-14 à J-8)
  // EN_RETARD  = avant 1 semaine et critique (J-7 ou dépassé)
  const retards  = periodes.filter(p => p.statut === 'EN_RETARD');
  const relances = periodes.filter(p => p.statut === 'EN_RELANCE');
  const alertes  = periodes.filter(p => p.statut === 'EN_RETARD' || p.statut === 'EN_RELANCE');

  const getStatutConfig = (statut: string) => {
    switch (statut) {
      case 'EN_RETARD':
        return {
          label: 'En retard',
          badgeVariant: 'destructive' as const,
          severity: 'CRITIQUE',
          severityClass: 'bg-red-100 text-red-700 border-red-200',
          rowClass: 'bg-red-50/30'
        };
      case 'EN_RELANCE':
        return {
          label: 'En relance',
          badgeVariant: 'secondary' as const,
          severity: 'MODÉRÉ',
          severityClass: 'bg-amber-50 text-amber-800 border-amber-200',
          rowClass: 'bg-amber-50/20'
        };
      default:
        return {
          label: statut,
          badgeVariant: 'secondary' as const,
          severity: 'NORMAL',
          severityClass: 'bg-zinc-100 text-zinc-600 border-zinc-200',
          rowClass: ''
        };
    }
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-foreground tracking-tight">
            {isRH ? 'Suivi des Retards & Relances' : "Retards d'Évaluation — Mon Équipe"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isRH
              ? 'Évaluations en relance (J-14 — avant 2 semaines) et en retard critique (J-7 — avant 1 semaine / dépassées)'
              : 'Évaluations de vos collaborateurs nécessitant impérativement votre saisie'
            }
          </p>
        </div>
      </div>

      {/* Legend Planning */}
      <Card className="p-4 bg-gradient-to-br from-red-50/50 via-white to-zinc-50 border border-red-100 rounded-2xl shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-zinc-200/80 shadow-2xs">
            <div>
              <span className="font-bold text-zinc-900 block">Avant 3 semaines (J-21)</span>
              <span className="text-[10px] text-muted-foreground">Notification initiale</span>
            </div>
            <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
              En cours
            </Badge>
          </div>
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-zinc-200/80 shadow-2xs">
            <div>
              <span className="font-bold text-zinc-900 block">Avant 2 semaines (J-14)</span>
              <span className="text-[10px] text-muted-foreground">Relance intermédiaire</span>
            </div>
            <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-800 border-amber-200">
              En relance
            </Badge>
          </div>
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-zinc-200/80 shadow-2xs">
            <div>
              <span className="font-bold text-zinc-900 block">Avant 1 semaine (J-7)</span>
              <span className="text-[10px] text-muted-foreground">Alerte critique</span>
            </div>
            <Badge variant="outline" className="text-[10px] bg-rose-50 text-rose-700 border-rose-200">
              En retard
            </Badge>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total alertes */}
        <Card className="group relative overflow-hidden bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-zinc-300">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-linear-to-br from-zinc-100 to-transparent rotate-12 transition-transform duration-500 group-hover:scale-125" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[11px] font-bold uppercase text-zinc-600">Total Alertes Actives</span>
              <div className="w-11 h-11 rounded-xl bg-zinc-100 border border-zinc-200/80 flex items-center justify-center transition-colors duration-300 group-hover:bg-zinc-900">
                <Users className="w-5 h-5 text-zinc-700 transition-colors group-hover:text-white" strokeWidth={2} />
              </div>
            </div>
            <div className="flex items-end gap-3">
              <p className="text-4xl font-black leading-none text-zinc-950">{alertes.length}</p>
              <p className="mb-1 text-[11px] font-medium text-zinc-500">En relance + en retard</p>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 h-1 w-16 rounded-tl-full bg-linear-to-r from-zinc-500 to-zinc-900" />
        </Card>

        {/* En relance (J-14) */}
        <Card className="group relative overflow-hidden bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-orange-200">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-linear-to-br from-orange-100 to-transparent rotate-12 transition-transform duration-500 group-hover:scale-125" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[11px] font-bold uppercase text-zinc-600">En Relance (J-14)</span>
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center transition-colors duration-300 group-hover:bg-orange-600">
                <Clock className="w-5 h-5 text-orange-700 transition-colors group-hover:text-white" strokeWidth={2} />
              </div>
            </div>
            <div className="flex items-end gap-3">
              <p className="text-4xl font-black leading-none text-zinc-950">{relances.length}</p>
              <p className="mb-1 text-[11px] font-medium text-zinc-500">Relance de rappel envoyée</p>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 h-1 w-16 rounded-tl-full bg-linear-to-r from-orange-500 to-zinc-900" />
        </Card>

        {/* En retard critique (J-7) */}
        <Card className="group relative overflow-hidden bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-red-200">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-linear-to-br from-red-50 to-transparent rotate-12 transition-transform duration-500 group-hover:scale-125" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[11px] font-bold uppercase text-zinc-600">En Retard Critique (J-7)</span>
              <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center transition-colors duration-300 group-hover:bg-red-600">
                <AlertTriangle className="w-5 h-5 text-red-600 transition-colors group-hover:text-white" strokeWidth={2} />
              </div>
            </div>
            <div className="flex items-end gap-3">
              <p className="text-4xl font-black leading-none text-red-600">{retards.length}</p>
              <p className="mb-1 text-[11px] font-medium text-zinc-500">Escalade DRH requise</p>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 h-1 w-16 rounded-tl-full bg-linear-to-r from-red-600 to-zinc-900" />
        </Card>
      </div>

      {/* Alertes Table */}
      {alertes.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 text-zinc-700 flex items-center justify-center mx-auto mb-3 border border-zinc-200/80 shadow-2xs">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" strokeWidth={1.75} />
          </div>
          <h3 className="text-sm font-semibold text-foreground tracking-tight">Aucune alerte détectée</h3>
          <p className="text-xs text-muted-foreground mt-1">Tous les formulaires d&apos;évaluation ont été renseignés dans les délais.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Salarié</th>
                  <th className="py-3.5 px-4">Responsable</th>
                  <th className="py-3.5 px-4">Type de Bilan</th>
                  <th className="py-3.5 px-4">Échéance</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4">Sévérité</th>
                  <th className="py-3.5 px-4">Dernier rappel</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-foreground">
                {alertes.map((p) => {
                  const config = getStatutConfig(p.statut);
                  const is3M = p.typePeriode === 'TROIS_MOIS' || p.typePeriode === 'DEUX_MOIS';

                  return (
                    <tr key={p.id} className={`hover:bg-secondary/30 transition-colors ${config.rowClass}`}>
                      <td className="py-3.5 px-4">
                        <span
                          onClick={() => navigateTo('detail-salarie', { salarieId: p.salarieId })}
                          className="font-semibold text-foreground hover:text-primary cursor-pointer block tracking-tight"
                        >
                          {p.salarieNom}
                        </span>
                        <span className="block text-[11px] text-muted-foreground">{p.salariePoste}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-foreground">{p.responsableNom}</span>
                        <span className="block text-[11px] text-muted-foreground">{p.responsableEmail}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="secondary" className="text-[11px] font-normal">
                          {is3M ? 'Période 1 (3 Mois)' : 'Période 2 (6 Mois)'}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        {p.dateEcheance}
                        {p.joursRetard && p.joursRetard > 0 && (
                          <span className="block text-rose-700 font-bold mt-0.5">+{p.joursRetard}j de retard</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={config.badgeVariant}
                          className={`text-[10px] ${p.statut === 'EN_RELANCE' ? 'bg-amber-100 text-amber-800 border-amber-200' : ''}`}
                        >
                          {config.label}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${config.severityClass}`}>
                          {config.severity}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground">
                        {p.dateDernierRappel || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isRH ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigateTo('formulaire-evaluation', { periodeId: p.id })}
                              className="text-xs h-7 cursor-pointer border-border bg-gradient-to-br from-red-500 to-red-900 text-white hover:bg-secondary"
                            >
                              Consulter
                            </Button>
                          ) : (
                            <Button
                              onClick={() => navigateTo('formulaire-evaluation', { periodeId: p.id })}
                              size="sm"
                              className="flex items-center gap-1 cursor-pointer shadow-xs font-medium"
                            >
                              <Clock className="w-3 h-3" strokeWidth={1.75} /> Remplir l&apos;évaluation
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
