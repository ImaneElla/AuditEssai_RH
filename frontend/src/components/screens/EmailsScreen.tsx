"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, Clock, Calendar, ExternalLink, Search, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function EmailsScreen() {
  const { emails, openEmailModal } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterBatch, setFilterBatch] = useState<string>('ALL');

  const filtered = emails.filter(e => {
    const matchSearch =
      e.objet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.salarieNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.destinataireNom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'ALL' || e.typeEmail === filterType;
    const matchBatch = filterBatch === 'ALL' || (filterBatch === 'CRON' ? e.batchCron : !e.batchCron);
    return matchSearch && matchType && matchBatch;
  });

  const typeLabel = (t: string) => {
    switch (t) {
      case 'CONVOCATION_2M': return 'Convocation 2M';
      case 'CONVOCATION_5M': return 'Convocation 5M';
      case 'RAPPEL_RETARD_J2': return 'Rappel Retard J+2';
      case 'ALERTE_CRITIQUE_J5': return 'Alerte Critique J+5';
      case 'CONFIRMATION_RH': return 'Confirmation RH';
      default: return t;
    }
  };

  const getBadgeVariant = (t: string): 'appleBlue' | 'applePurple' | 'destructive' | 'appleRed' | 'appleGreen' | 'secondary' => {
    switch (t) {
      case 'CONVOCATION_2M': return 'appleBlue';
      case 'CONVOCATION_5M': return 'applePurple';
      case 'RAPPEL_RETARD_J2': return 'destructive';
      case 'ALERTE_CRITIQUE_J5': return 'destructive';
      case 'CONFIRMATION_RH': return 'appleGreen';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-5 font-sans">
      <div>
        <h2 className="text-lg md:text-xl font-bold text-foreground tracking-tight">Historique des Emails Automatiques</h2>
        <p className="text-xs text-muted-foreground">
          Journal d&apos;audit — Emails déclenchés par le batch quotidien de 09:00 et relances manuelles
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Rechercher par objet, salarié ou destinataire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-card transition-all text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)} 
          className="text-xs bg-secondary/50 border border-border rounded-xl px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
        >
          <option value="ALL">Tous les types</option>
          <option value="CONVOCATION_2M">Convocation 2 Mois</option>
          <option value="CONVOCATION_5M">Convocation 5 Mois</option>
          <option value="RAPPEL_RETARD_J2">Rappel Retard J+2</option>
          <option value="ALERTE_CRITIQUE_J5">Alerte Critique J+5</option>
          <option value="CONFIRMATION_RH">Confirmation RH</option>
        </select>
        <select 
          value={filterBatch} 
          onChange={(e) => setFilterBatch(e.target.value)} 
          className="text-xs bg-secondary/50 border border-border rounded-xl px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
        >
          <option value="ALL">Toutes les sources</option>
          <option value="CRON">Batch Cron 09:00</option>
          <option value="MANUAL">Relances manuelles</option>
        </select>
      </Card>

      {/* Emails Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Objet</th>
                <th className="py-3.5 px-4">Collaborateur</th>
                <th className="py-3.5 px-4">Destinataire</th>
                <th className="py-3.5 px-4">Date / Heure</th>
                <th className="py-3.5 px-4">Source</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Aperçu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-muted-foreground">Aucun email ne correspond aux filtres.</td>
                </tr>
              ) : (
                filtered.map((mail) => (
                  <tr key={mail.id} className="hover:bg-secondary/40 transition-colors">
                    <td className="py-3 px-4">
                      <Badge variant={getBadgeVariant(mail.typeEmail)} className="text-[10px]">
                        {typeLabel(mail.typeEmail)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-foreground text-xs line-clamp-1 max-w-xs block tracking-tight">{mail.objet}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">{mail.salarieNom}</td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-foreground">{mail.destinataireNom}</span>
                      <span className="block text-[10px] text-muted-foreground">{mail.destinataire}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-muted-foreground" strokeWidth={1.75} /> {mail.dateEnvoi}</span>
                      <span className="flex items-center gap-1 text-muted-foreground"><Clock className="w-3 h-3" strokeWidth={1.75} /> {mail.heureEnvoi}</span>
                    </td>
                    <td className="py-3 px-4">
                      {mail.batchCron ? (
                        <Badge variant="appleRed" className="inline-flex items-center gap-1 text-[10px] font-mono">
                          <Zap className="w-3 h-3" strokeWidth={2} /> Cron 09:00
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">Manuel</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="appleGreen" className="text-[10px]">
                        {mail.statut}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => openEmailModal(mail)} 
                        className="cursor-pointer ml-auto flex items-center gap-1"
                      >
                        <span>Voir</span>
                        <ExternalLink className="w-3 h-3" strokeWidth={1.75} />
                      </Button>
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
