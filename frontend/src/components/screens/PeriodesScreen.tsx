"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  CalendarDays,
  ChevronRight,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function PeriodesScreen() {
  const { periodes = [], navigateTo, validerDecisionRH, currentRole } = useApp();

  const isRH = currentRole === 'ADMIN_RH';
  const [search, setSearch] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatut, setFilterStatut] = useState<string>('ALL');

  const normalize = (v?: string | null) =>
    (v ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const query = normalize(search.trim());

  const filtered = periodes.filter(p => {
    const matchType = filterType === 'ALL' || p.typePeriode === filterType;
    const matchStatut = filterStatut === 'ALL' || p.statut === filterStatut;
    const matchSearch =
      query === '' ||
      normalize(p.salarieNom).includes(query) ||
      normalize(p.salariePoste).includes(query) ||
      normalize(p.responsableNom).includes(query) ||
      normalize(p.directionName).includes(query);
    return matchType && matchStatut && matchSearch;
  });

  const totalPeriodes = periodes.length;
  const enAttenteCount = periodes.filter(p => p.statut === 'EN_ATTENTE' || p.statut === 'EMAIL_ENVOYE').length;
  const enRetardCount = periodes.filter(p => p.statut === 'EN_RETARD').length;
  const completeesCount = periodes.filter(p => p.statut === 'COMPLETEE' || p.statut === 'VALIDEE_RH').length;

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

  const formatDate = (d?: string | null) => {
    if (!d) return '—';
    const date = new Date(d);
    return isNaN(date.getTime()) ? d : date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            {isRH ? 'Periode d’Évaluation (Supervision Globale)' : 'Évaluations à Réaliser — Mon Équipe'}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isRH
              ? `${filtered.length} jalon${filtered.length > 1 ? 's' : ''} — Bilans intermédiaires (2 mois) et décisionnels (5 mois)`
              : `Équipe Gestion de Patrimoine • ${filtered.length} évaluation${filtered.length > 1 ? 's associées' : ' associée'}`
            }
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="group relative overflow-hidden bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-red-200">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-red-50 to-transparent rotate-12 transition-transform duration-500 group-hover:scale-125" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                  <CalendarDays className="w-5 h-5 text-red-600 group-hover:text-white transition-colors" strokeWidth={2} />
                </div>
                <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-zinc-600">
                  Total Periode
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                <ChevronRight className="w-4 h-4 text-red-600 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black tracking-tight leading-none text-zinc-950">
                {totalPeriodes}
              </span>
              <span className="text-[11px] text-zinc-500 font-medium mb-1">
                évaluations
              </span>
            </div>
            <div className="mt-5">
              <Badge className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-semibold px-2.5 py-1">
                2M &amp; 5M
              </Badge>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-1 bg-gradient-to-r from-red-600 to-zinc-900 rounded-tl-full" />
        </Card>

        <Card className="group relative overflow-hidden bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-red-200">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-red-50 to-transparent rotate-12 transition-transform duration-500 group-hover:scale-125" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                  <Clock className="w-5 h-5 text-red-600 group-hover:text-white transition-colors" strokeWidth={2} />
                </div>
                <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-zinc-600">
                  En Attente
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                <ChevronRight className="w-4 h-4 text-red-600 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black tracking-tight leading-none text-zinc-950">
                {enAttenteCount}
              </span>
              <span className="text-[11px] text-zinc-500 font-medium mb-1">
                formulaires
              </span>
            </div>
            <div className="mt-5">
              <Badge className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-semibold px-2.5 py-1">
                En cours
              </Badge>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-1 bg-gradient-to-r from-red-600 to-zinc-900 rounded-tl-full" />
        </Card>

        <Card className="group relative overflow-hidden bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-red-200">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-red-50 to-transparent rotate-12 transition-transform duration-500 group-hover:scale-125" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                  <AlertTriangle className="w-5 h-5 text-red-600 group-hover:text-white transition-colors" strokeWidth={2} />
                </div>
                <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-zinc-600">
                  En Retard
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                <ChevronRight className="w-4 h-4 text-red-600 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="flex items-end gap-3">
              <span className={`text-4xl font-black tracking-tight leading-none ${enRetardCount > 0 ? 'text-red-600' : 'text-zinc-950'}`}>
                {enRetardCount}
              </span>
              <span className="text-[11px] text-zinc-500 font-medium mb-1">
                responsable
              </span>
            </div>
            <div className="mt-5">
              <Badge className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-semibold px-2.5 py-1">
                {enRetardCount > 0 ? 'Relance requise' : 'Aucun retard'}
              </Badge>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-1 bg-gradient-to-r from-red-600 to-zinc-900 rounded-tl-full" />
        </Card>

        <Card className="group relative overflow-hidden bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-red-200">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-red-50 to-transparent rotate-12 transition-transform duration-500 group-hover:scale-125" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                  <CheckCircle2 className="w-5 h-5 text-red-600 group-hover:text-white transition-colors" strokeWidth={2} />
                </div>
                <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-zinc-600">
                  Finalisées
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                <ChevronRight className="w-4 h-4 text-red-600 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black tracking-tight leading-none text-zinc-950">
                {completeesCount}
              </span>
              <span className="text-[11px] text-zinc-500 font-medium mb-1">
                complétées
              </span>
            </div>
            <div className="mt-5">
              <Badge className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-semibold px-2.5 py-1">
                Terminées
              </Badge>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-1 bg-gradient-to-r from-red-600 to-zinc-900 rounded-tl-full" />
        </Card>
      </div>

      <Card className="p-3.5 border-border/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" strokeWidth={2} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un salarié, poste, responsable ou direction..."
              className="w-full text-xs bg-secondary/40 border border-border rounded-xl pl-9 pr-3 py-2 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none font-medium"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs bg-secondary/40 border border-border rounded-xl px-3 py-2 text-foreground focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none cursor-pointer font-medium"
          >
            <option value="ALL">Tous les Periode</option>
            <option value="DEUX_MOIS">Bilan 3 Mois (Intermédiaire)</option>
            <option value="CINQ_MOIS">Bilan 6 Mois (Décision Finale)</option>
          </select>

          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="text-xs bg-secondary/40 border border-border rounded-xl px-3 py-2 text-foreground focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none cursor-pointer font-medium"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="PLANIFIEE">Planifiée</option>
            <option value="EMAIL_ENVOYE">Mail 09h envoyé</option>
            <option value="EN_ATTENTE">Formulaire en cours</option>
            <option value="EN_RETARD">En retard</option>
            <option value="COMPLETEE">Complétée</option>
            <option value="VALIDEE_RH">Validée RH</option>
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden border-border/80 shadow-2xs">
        <table className="w-full table-fixed text-left text-xs border-collapse">
       <colgroup>
  <col style={{ width: '6%' }} />
  <col style={{ width: '13%' }} />
  <col style={{ width: '11%' }} />
  <col style={{ width: '11%' }} />
  <col style={{ width: '8%' }} />
  <col style={{ width: '14%' }} />
  <col style={{ width: '7%' }} />
  <col style={{ width: '10%' }} />
  <col style={{ width: '20%' }} />
</colgroup>
          <thead className="bg-secondary/60 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-3 whitespace-nowrap truncate">Type</th>
              <th className="py-3.5 px-3 whitespace-nowrap truncate">Salarié</th>
              <th className="py-3.5 px-3 whitespace-nowrap truncate">Responsable</th>
              <th className="py-3.5 px-3 whitespace-nowrap truncate">Direction</th>
              <th className="py-3.5 px-3 whitespace-nowrap truncate">Échéance</th>
              <th className="py-3.5 px-3 whitespace-nowrap truncate" title="Décision de responsable">Décision de responsable</th>
              <th className="py-3.5 px-3 whitespace-nowrap truncate" title="Date de validation">Validation</th>
              <th className="py-3.5 px-3 whitespace-nowrap truncate">Statut</th>
              <th className="py-3.5 px-3 whitespace-nowrap truncate text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-foreground bg-card">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-muted-foreground font-medium">
                  Aucun jalon ne correspond aux filtres sélectionnés.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className={`hover:bg-red-50/30 transition-colors group ${p.statut === 'EN_RETARD' ? 'bg-red-50/20' : ''}`}>
                  <td className="py-3.5 px-3 align-middle whitespace-nowrap overflow-hidden">
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-semibold whitespace-nowrap"
                    >
                      {p.typePeriode === 'DEUX_MOIS' ? '2 Mois' : '5 Mois'}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-3 align-middle whitespace-nowrap overflow-hidden">
                    <span
                      onClick={() => navigateTo('detail-salarie', { salarieId: p.salarieId })}
                      title={p.salarieNom}
                      className="font-semibold text-foreground hover:text-red-600 cursor-pointer block truncate tracking-tight transition-colors"
                    >
                      {p.salarieNom}
                    </span>
                    <span title={p.salariePoste} className="block truncate text-[10px] text-muted-foreground">{p.salariePoste}</span>
                  </td>
                  <td title={p.responsableNom} className="py-3.5 px-3 align-middle whitespace-nowrap truncate font-medium text-foreground">{p.responsableNom}</td>
                  <td title={p.directionName} className="py-3.5 px-3 align-middle whitespace-nowrap truncate text-muted-foreground">{p.directionName}</td>
                  <td className="py-3.5 px-3 align-middle whitespace-nowrap truncate font-mono text-[11px]">{p.dateEcheance}</td>
                  <td className="py-3.5 px-14 align-middle whitespace-nowrap overflow-hidden">
                    {p.decisionFinale && p.decisionFinale !== 'EN_ATTENTE' ? (
                      <Badge
                        variant={
                          p.decisionFinale === 'CONFIRMATION' ? 'appleGreen' :
                          p.decisionFinale === 'RENOUVELLEMENT' ? 'appleOrange' :
                          'destructive'
                        }
                        className="text-[10px] font-mono whitespace-nowrap"
                      >
                        {p.decisionFinale}
                      </Badge>
                   ) : (
    <Badge
      variant="secondary"
      className="text-[10px] font-mono whitespace-nowrap"
    >
      En cours
    </Badge>
  )}
</td>
                  <td className="py-3.5 px-3 align-middle whitespace-nowrap truncate font-mono text-[11px]">
                    {formatDate(p.dateRemplissage)}
                  </td>
                  <td className="py-3.5 px-3 align-middle whitespace-nowrap overflow-hidden">
                    <Badge variant={getStatutBadgeVariant(p.statut)} className="inline-flex items-center gap-1 text-[10px] font-mono whitespace-nowrap">
                      {statutLabel(p.statut)}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-3 align-middle whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isRH ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigateTo('formulaire-evaluation', { periodeId: p.id })}
                             className="text-xs h-7 cursor-pointer border-border  bg-gradient-to-br from-red-500 to-red-900 text-white hover:bg-secondary"
                          >
                            Consulter
                          </Button>
                          {p.statut === 'COMPLETEE' && (
                            <Button
                              size="sm"
                              onClick={() => validerDecisionRH(p.id, p.decisionFinale || 'CONFIRMATION', p.motifDecision || 'Décision validée.')}
                              className="text-xs h-7 cursor-pointer flex items-center gap-1 shadow-2xs bg-emerald-600 hover:bg-emerald-700 text-white"
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
                             className="text-xs h-7 cursor-pointer border-border  bg-gradient-to-br from-red-500 to-red-900 text-white hover:bg-secondary"
                          >
                            Consulter
                          </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => navigateTo('formulaire-evaluation', { periodeId: p.id })}
                              className="text-xs h-7 cursor-pointer flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white shadow-2xs"
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
      </Card>
    </div>
  );
}