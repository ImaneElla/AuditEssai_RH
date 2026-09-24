"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, 
  Send, 
  ShieldCheck, 
  Star,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function PeriodesScreen() {
  const { periodes, navigateTo, relancerRetard, validerDecisionRH, currentRole } = useApp();

  const isRH = currentRole === 'ADMIN_RH';
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatut, setFilterStatut] = useState<string>('ALL');

  const filtered = periodes.filter(p => {
    const matchType = filterType === 'ALL' || p.typePeriode === filterType;
    const matchStatut = filterStatut === 'ALL' || p.statut === filterStatut;
    return matchType && matchStatut;
  });

  const statutLabel = (s: string) => {
    switch (s) {
      case 'PLANIFIEE': return 'Planifiée';
      case 'EMAIL_ENVOYE': return 'Mail envoyé';
      case 'EN_ATTENTE': return 'En attente';
      case 'EN_RETARD': return 'En retard';
      case 'COMPLETEE': return 'Complétée';
      case 'VALIDEE_RH': return 'Validée RH';
      default: return s;
    }
  };

  const getStatutBadgeVariant = (s: string): 'destructive' | 'appleGreen' | 'secondary' => {
    switch (s) {
      case 'PLANIFIEE': return 'secondary';
      case 'EMAIL_ENVOYE': return 'secondary';
      case 'EN_ATTENTE': return 'secondary';
      case 'EN_RETARD': return 'destructive';
      case 'COMPLETEE': return 'appleGreen';
      case 'VALIDEE_RH': return 'appleGreen';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-5 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-foreground tracking-tight">
            {isRH ? 'Jalons d’Évaluation (Supervision Globale)' : 'Évaluations à Réaliser — Mon Équipe'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isRH
              ? `${filtered.length} jalon${filtered.length > 1 ? 's' : ''} — Bilans intermédiaires (2 mois) et décisionnels (5 mois)`
              : `Équipe Gestion de Patrimoine • ${filtered.length} évaluation${filtered.length > 1 ? 's associées' : ' associée'}`
            }
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 flex flex-wrap items-center gap-3">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="text-xs bg-secondary/50 border border-border rounded-xl px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
        >
          <option value="ALL">Tous les jalons</option>
          <option value="DEUX_MOIS">Bilan 2 Mois (Intermédiaire)</option>
          <option value="CINQ_MOIS">Bilan 5 Mois (Décision Finale)</option>
        </select>

        <select
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value)}
          className="text-xs bg-secondary/50 border border-border rounded-xl px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="PLANIFIEE">Planifiée</option>
          <option value="EMAIL_ENVOYE">Mail 09h envoyé</option>
          <option value="EN_ATTENTE">Formulaire en attente</option>
          <option value="EN_RETARD">En retard (&gt;2j)</option>
          <option value="COMPLETEE">Complétée</option>
          <option value="VALIDEE_RH">Validée RH</option>
        </select>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Salarié</th>
                <th className="py-3.5 px-4">Responsable N+1</th>
                <th className="py-3.5 px-4">Direction</th>
                <th className="py-3.5 px-4">Échéance</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4">Note</th>
                <th className="py-3.5 px-4">Décision</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-muted-foreground">
                    Aucun jalon ne correspond aux filtres sélectionnés.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className={`hover:bg-secondary/40 transition-colors ${p.statut === 'EN_RETARD' ? 'bg-zinc-50/70' : ''}`}>
                    <td className="py-3 px-4">
                      <Badge 
                        variant="secondary"
                        className="text-[11px] font-normal"
                      >
                        {p.typePeriode === 'DEUX_MOIS' ? '2 Mois' : '5 Mois'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span 
                        onClick={() => navigateTo('detail-salarie', { salarieId: p.salarieId })}
                        className="font-semibold text-foreground hover:text-primary cursor-pointer block tracking-tight"
                      >
                        {p.salarieNom}
                      </span>
                      <span className="block text-[11px] text-muted-foreground">{p.salariePoste}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">{p.responsableNom}</td>
                    <td className="py-3 px-4 text-muted-foreground">{p.directionName}</td>
                    <td className="py-3 px-4 font-mono text-[11px]">{p.dateEcheance}</td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatutBadgeVariant(p.statut)} className="inline-flex items-center gap-1 text-[11px]">
                        {p.statut === 'EN_RETARD' && <AlertTriangle className="w-3 h-3" strokeWidth={2} />}
                        {p.statut === 'VALIDEE_RH' && <ShieldCheck className="w-3 h-3" strokeWidth={2} />}
                        {statutLabel(p.statut)}
                      </Badge>
                      {p.joursRetard && p.joursRetard > 0 && (
                        <span className="block text-[10px] text-rose-700 font-medium mt-0.5">+{p.joursRetard}j de retard</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {p.noteGlobale ? (
                        <span className="flex items-center gap-1 font-semibold text-foreground">
                          <Star className="w-3.5 h-3.5 text-zinc-500 fill-zinc-400" strokeWidth={1.5} />
                          {p.noteGlobale}/5
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {p.decisionFinale && p.decisionFinale !== 'EN_ATTENTE' ? (
                        <Badge 
                          variant={
                            p.decisionFinale === 'CONFIRMATION' ? 'appleGreen' :
                            p.decisionFinale === 'RENOUVELLEMENT' ? 'appleOrange' :
                            'destructive'
                          }
                          className="text-[11px]"
                        >
                          {p.decisionFinale}
                        </Badge>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">En attente</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isRH ? (
                          <>
                            {p.statut === 'EN_RETARD' && (
                              <Button
                                size="sm"
                                onClick={() => relancerRetard(p.id)}
                                className="text-[11px] cursor-pointer flex items-center gap-1 shadow-xs"
                              >
                                <Send className="w-3 h-3" strokeWidth={1.75} /> Relancer
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigateTo('formulaire-evaluation', { periodeId: p.id })}
                              className="text-[11px] cursor-pointer"
                            >
                              Consulter
                            </Button>
                            {p.statut === 'COMPLETEE' && (
                              <Button
                                size="sm"
                                onClick={() => validerDecisionRH(p.id, p.decisionFinale || 'CONFIRMATION', p.motifDecision || 'Décision validée.')}
                                className="text-[11px] cursor-pointer flex items-center gap-1 shadow-xs"
                              >
                                <ShieldCheck className="w-3 h-3" strokeWidth={1.75} /> Valider RH
                              </Button>
                            )}
                          </>
                        ) : (
                          <>
                            {(p.statut === 'COMPLETEE' || p.statut === 'VALIDEE_RH') ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigateTo('formulaire-evaluation', { periodeId: p.id })}
                                className="text-[11px] cursor-pointer"
                              >
                                Consulter
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => navigateTo('formulaire-evaluation', { periodeId: p.id })}
                                className="text-[11px] cursor-pointer flex items-center gap-1"
                              >
                                <FileText className="w-3 h-3" strokeWidth={1.75} /> Remplir l&apos;évaluation
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
