"use client";

import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, Send, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function RetardsScreen() {
  const { periodes, navigateTo, relancerRetard, relancerTousLesRetards, currentRole } = useApp();

  const isRH = currentRole === 'ADMIN_RH';
  const retards = periodes.filter(p => p.statut === 'EN_RETARD');
  const retardsModeres = retards.filter(p => (p.joursRetard || 0) <= 4);
  const retardsCritiques = retards.filter(p => (p.joursRetard || 0) > 4);

  return (
    <div className="space-y-5 font-sans">
      {/* Apple Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-foreground tracking-tight">
            {isRH ? 'Suivi des Retards (> 2 Jours Ouvrés)' : 'Retards d’Évaluation — Mon Équipe'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isRH 
              ? 'Supervision globale des évaluations non renseignées après l’alerte automatique de 09:00'
              : 'Évaluations de vos collaborateurs affectés nécessitant impérativement votre saisie'
            }
          </p>
        </div>
        {isRH && retards.length > 0 && (
          <Button 
            onClick={() => relancerTousLesRetards()} 
            size="default"
            className="flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" strokeWidth={1.75} />
            <span>Relancer tous les Responsables ({retards.length})</span>
          </Button>
        )}
      </div>

      {/* Apple SF Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border-border hover:border-zinc-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Retards Actifs</span>
            <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-700 border border-zinc-200/80 flex items-center justify-center shadow-2xs">
              <AlertTriangle className="w-4 h-4" strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2 tracking-tight">{retards.length}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Non répondus après 48h</p>
        </Card>

        <Card className="p-5 border-border hover:border-zinc-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Retards Modérés (+2 à +4j)</span>
            <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-700 border border-zinc-200/80 flex items-center justify-center shadow-2xs">
              <Clock className="w-4 h-4" strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2 tracking-tight">{retardsModeres.length}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Relance de rappel envoyée</p>
        </Card>

        <Card className="p-5 border-border hover:border-zinc-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Retards Critiques (&gt; 5j)</span>
            <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-700 border border-zinc-200/80 flex items-center justify-center shadow-2xs">
              <AlertTriangle className="w-4 h-4 text-rose-600" strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2 tracking-tight">{retardsCritiques.length}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Escalade DRH requise</p>
        </Card>
      </div>

      {/* Retards Table */}
      {retards.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 text-zinc-700 flex items-center justify-center mx-auto mb-3 border border-zinc-200/80 shadow-2xs">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" strokeWidth={1.75} />
          </div>
          <h3 className="text-sm font-semibold text-foreground tracking-tight">Aucun retard détecté</h3>
          <p className="text-xs text-muted-foreground mt-1">Tous les formulaires d&apos;évaluation ont été renseignés dans les délais.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Salarié</th>
                  <th className="py-3.5 px-4">Responsable N+1</th>
                  <th className="py-3.5 px-4">Type de Bilan</th>
                  <th className="py-3.5 px-4">Date d&apos;envoi</th>
                  <th className="py-3.5 px-4">Retard</th>
                  <th className="py-3.5 px-4">Sévérité</th>
                  <th className="py-3.5 px-4">Dernier rappel</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-foreground">
                {retards.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <span onClick={() => navigateTo('detail-salarie', { salarieId: p.salarieId })} className="font-semibold text-foreground hover:text-primary cursor-pointer block tracking-tight">
                        {p.salarieNom}
                      </span>
                      <span className="block text-[11px] text-muted-foreground">{p.salariePoste}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-foreground">{p.responsableNom}</span>
                      <span className="block text-[11px] text-muted-foreground">{p.responsableEmail}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge 
                        variant="secondary"
                        className="text-[11px] font-normal"
                      >
                        {p.typePeriode === 'DEUX_MOIS' ? '2 Mois' : '5 Mois'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {p.dateDeclenchementEmail}<br />
                      <span className="text-muted-foreground">à {p.heureDeclenchement}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-base font-bold text-rose-700 tracking-tight">+{p.joursRetard}j</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge 
                        variant={(p.joursRetard || 0) > 4 ? 'destructive' : 'secondary'}
                        className="text-[10px]"
                      >
                        {(p.joursRetard || 0) > 4 ? 'CRITIQUE' : 'MODÉRÉ'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground">
                      {p.dateDernierRappel || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isRH ? (
                          <>
                            <Button 
                              onClick={() => relancerRetard(p.id)} 
                              size="sm"
                              className="flex items-center gap-1 cursor-pointer shadow-xs"
                            >
                              <Send className="w-3 h-3" strokeWidth={1.75} /> Relancer
                            </Button>
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => navigateTo('formulaire-evaluation', { periodeId: p.id })} 
                              className="cursor-pointer"
                            >
                              Consulter
                            </Button>
                          </>
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
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
