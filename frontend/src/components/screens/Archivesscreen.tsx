"use client";

import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Salarie } from '../../types';
import {
  Archive,
  Search,
  Eye,
  RotateCcw,
  Building2,
  X,
  CheckCircle2,
  AlertTriangle,
  UserRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const issueLabel = (s: Salarie) =>
  s.statutEssai === 'RUPTURE'
    ? "Fin de période d'essai"
    : s.statutEssai === 'CONFIRMEE'
    ? 'Confirmé'
    : s.statutEssai;

const issueVariant = (s: Salarie): 'destructive' | 'appleGreen' | 'secondary' =>
  s.statutEssai === 'RUPTURE'
    ? 'destructive'
    : s.statutEssai === 'CONFIRMEE'
    ? 'appleGreen'
    : 'secondary';

export default function ArchivesScreen() {
  const { archives, periodes, navigateTo, restaurerSalarie, currentRole } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<'ALL' | 'RUPTURE' | 'CONFIRMEE'>('ALL');
  const [toRestore, setToRestore] = useState<Salarie | null>(null);

  const isRH = currentRole === 'ADMIN_RH';

  // Date et motif de la dernière décision enregistrée pour le salarié
  const getDecisionInfo = (salarieId: number) => {
    const ps = periodes.filter(p => p.salarieId === salarieId);
    const last =
      [...ps]
        .filter(p => p.dateValidationRH)
        .sort((a, b) => String(b.dateValidationRH).localeCompare(String(a.dateValidationRH)))[0] ||
      ps.find(p => p.statut === 'RUPTURE') ||
      ps[0];

    return {
      date:
        last?.dateValidationRH ||
        (last?.dateValidationEvaluateur ? String(last.dateValidationEvaluateur).split(' ')[0] : '—'),
      motif: last?.motifDecision || '',
    };
  };

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return archives.filter(s => {
      const matchesSearch =
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.poste.toLowerCase().includes(q);
      const matchesIssue = selectedIssue === 'ALL' || s.statutEssai === selectedIssue;
      return matchesSearch && matchesIssue;
    });
  }, [archives, searchTerm, selectedIssue]);

  const countConfirmes = archives.filter(s => s.statutEssai === 'CONFIRMEE').length;
  const countRuptures = archives.filter(s => s.statutEssai === 'RUPTURE').length;

  const handleRestore = () => {
    if (toRestore) restaurerSalarie(toRestore.id);
    setToRestore(null);
  };

  return (
    <div className="space-y-5 font-sans">
      {/* En-tête */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center">
          <Archive className="w-5 h-5 text-muted-foreground" strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-bold text-foreground tracking-tight">Archives</h2>
          <p className="text-xs text-muted-foreground">
            Salariés dont la période d&apos;essai est terminée (confirmés ou fin d&apos;essai). Consultez leur dossier
            ou restaurez-les dans la liste active.
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-4">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total archivés</p>
          <p className="text-2xl font-bold text-foreground mt-1">{archives.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Confirmés</p>
          <p className="text-2xl font-bold text-apple-green mt-1">{countConfirmes}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Fins d&apos;essai</p>
          <p className="text-2xl font-bold text-destructive mt-1">{countRuptures}</p>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search
              className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"
              strokeWidth={1.75}
            />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou poste..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-card transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <select
            value={selectedIssue}
            onChange={(e) => setSelectedIssue(e.target.value as 'ALL' | 'RUPTURE' | 'CONFIRMEE')}
            className="text-xs bg-secondary/50 border border-border rounded-xl px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer w-full md:w-auto"
          >
            <option value="ALL">Toutes les issues</option>
            <option value="CONFIRMEE">Confirmés</option>
            <option value="RUPTURE">Fin d&apos;essai</option>
          </select>
        </div>
      </Card>

      {/* Liste */}
      {filtered.length === 0 ? (
        <Card className="py-12">
          <div className="text-center text-muted-foreground">
            <UserRound className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium">Aucun salarié archivé</p>
            <p className="text-xs mt-1">
              Les salariés confirmés ou en fin de période d&apos;essai apparaîtront ici.
            </p>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden border border-border/80 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-secondary/60 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 whitespace-nowrap">Collaborateur</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Poste & Direction</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Issue</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Décision RH</th>
                  <th className="py-3.5 px-4 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60 text-foreground">
                {filtered.map((s) => {
                  const info = getDecisionInfo(s.id);
                  return (
                    <tr key={s.id} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-secondary border border-border text-foreground font-bold flex items-center justify-center text-xs shrink-0">
                            {s.firstName[0]}
                            {s.lastName[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground text-xs truncate">
                              {s.firstName} {s.lastName}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">{s.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" strokeWidth={1.75} />
                          <p className="font-semibold text-xs truncate">{s.poste}</p>
                        </div>
                        <p className="text-[11px] text-muted-foreground pl-5 mt-0.5 truncate">{s.directionName}</p>
                      </td>

                      <td className="py-3.5 px-4 align-middle">
                        <Badge variant={issueVariant(s)} className="text-[10px] font-normal">
                          {issueLabel(s)}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 align-middle max-w-[260px]">
                        <p className="font-mono text-[11px] text-foreground">{info.date}</p>
                        {info.motif && (
                          <p
                            title={info.motif}
                            className="text-[11px] text-muted-foreground truncate mt-0.5"
                          >
                            {info.motif}
                          </p>
                        )}
                      </td>

                      <td className="py-3.5 px-4 align-middle text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigateTo('detail-salarie', { salarieId: s.id })}
                            className="cursor-pointer h-8 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" strokeWidth={1.75} />
                            Consulter
                          </Button>

                          {isRH && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setToRestore(s)}
                              className="cursor-pointer h-8 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1.5"
                            >
                              <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} />
                              Restaurer
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

      {/* Modal de confirmation de restauration */}
      {toRestore && (
        <div
          onClick={() => setToRestore(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl border border-border shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-5 h-5 text-primary" strokeWidth={1.75} />
                <h3 className="text-sm font-semibold text-foreground tracking-tight">
                  Restaurer le salarié
                </h3>
              </div>
              <button
                type="button"
                aria-label="Fermer"
                onClick={() => setToRestore(null)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">
                {toRestore.firstName} {toRestore.lastName}
              </strong>{' '}
              sera retiré des archives et réapparaîtra dans la liste des salariés.
            </p>

            {toRestore.statutEssai === 'RUPTURE' && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-[11px] text-red-700">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Sa période d&apos;essai reste en statut « Fin d&apos;essai » : les évaluations restent bloquées et
                  les relances automatiques arrêtées.
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setToRestore(null)} className="cursor-pointer">
                Annuler
              </Button>
              <Button size="sm" onClick={handleRestore} className="cursor-pointer flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" strokeWidth={1.75} />
                Oui, restaurer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}