"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Mail, 
  Clock, 
  Calendar, 
  ExternalLink, 
  Search, 
  Zap, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  Filter,
  RefreshCw,
  User,
  Inbox,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function EmailsScreen() {
  const { emails = [], openEmailModal } = useApp();

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

  // Métriques d'en-tête dynamiques
  const totalEmails = emails.length;
  const cronEmails = emails.filter(e => e.batchCron).length;
  const alertEmails = emails.filter(e => e.typeEmail.includes('RETARD') || e.typeEmail.includes('ALERTE')).length;
  const successEmails = emails.filter(e => e.statut === 'DELIVRE' || e.statut === 'OUVERT').length;

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
    <div className="space-y-6 font-sans">
      {/* En-tête principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              Journal des Emails &amp; Notifications
            </h2>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
              {filtered.length} enregistrement{filtered.length > 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Suivi temps réel des communications automatisées du Cron 09:00 et des relances manuelles.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchTerm('');
            setFilterType('ALL');
            setFilterBatch('ALL');
          }}
          className="text-xs self-start sm:self-auto cursor-pointer gap-1.5 border-border hover:bg-secondary/60"
        >
          <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
          <span>Réinitialiser les filtres</span>
        </Button>
      </div>

      {/* Cartes KPI Unifiées */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 : Total Envoyés */}
        <Card className="group relative overflow-hidden bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-red-200">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-red-50 to-transparent rotate-12 transition-transform duration-500 group-hover:scale-125" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                  <Send className="w-5 h-5 text-red-600 group-hover:text-white transition-colors" strokeWidth={2} />
                </div>
                <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-zinc-600">
                  Total Envoyés
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                <ChevronRight className="w-4 h-4 text-red-600 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black tracking-tight leading-none text-zinc-950">
                {totalEmails}
              </span>
              <span className="text-[11px] text-zinc-500 font-medium mb-1">
                communications
              </span>
            </div>
            <div className="mt-5">
              <Badge className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-semibold px-2.5 py-1">
                <Mail className="w-3 h-3 mr-1 inline-block" />
                Journal global
              </Badge>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-1 bg-gradient-to-r from-red-600 to-zinc-900 rounded-tl-full" />
        </Card>

        {/* KPI 2 : Batch Cron (09:00) */}
        <Card className="group relative overflow-hidden bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-red-200">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-red-50 to-transparent rotate-12 transition-transform duration-500 group-hover:scale-125" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                  <Zap className="w-5 h-5 text-red-600 group-hover:text-white transition-colors" strokeWidth={2} />
                </div>
                <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-zinc-600">
                  Batch Cron (09:00)
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                <ChevronRight className="w-4 h-4 text-red-600 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black tracking-tight leading-none text-zinc-950">
                {cronEmails}
              </span>
              <span className="text-[11px] text-zinc-500 font-medium mb-1">
                automatiques
              </span>
            </div>
            <div className="mt-5">
              <Badge className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-semibold px-2.5 py-1">
                <Zap className="w-3 h-3 mr-1 inline-block" />
                Quotidien
              </Badge>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-1 bg-gradient-to-r from-red-600 to-zinc-900 rounded-tl-full" />
        </Card>

        {/* KPI 3 : Alertes & Retards */}
        <Card className="group relative overflow-hidden bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-red-200">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-red-50 to-transparent rotate-12 transition-transform duration-500 group-hover:scale-125" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                  <AlertTriangle className="w-5 h-5 text-red-600 group-hover:text-white transition-colors" strokeWidth={2} />
                </div>
                <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-zinc-600">
                  Alertes &amp; Retards
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                <ChevronRight className="w-4 h-4 text-red-600 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="flex items-end gap-3">
              <span className={`text-4xl font-black tracking-tight leading-none ${alertEmails > 0 ? 'text-red-600' : 'text-zinc-950'}`}>
                {alertEmails}
              </span>
              <span className="text-[11px] text-zinc-500 font-medium mb-1">
                critiques
              </span>
            </div>
            <div className="mt-5">
              <Badge className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-semibold px-2.5 py-1">
                <AlertTriangle className="w-3 h-3 mr-1 inline-block" />
                {alertEmails > 0 ? 'Attention requise' : 'Aucune alerte'}
              </Badge>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-1 bg-gradient-to-r from-red-600 to-zinc-900 rounded-tl-full" />
        </Card>

        {/* KPI 4 : Délivrés / Ouverts */}
        <Card className="group relative overflow-hidden bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-red-200">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-red-50 to-transparent rotate-12 transition-transform duration-500 group-hover:scale-125" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                  <CheckCircle2 className="w-5 h-5 text-red-600 group-hover:text-white transition-colors" strokeWidth={2} />
                </div>
                <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-zinc-600">
                  Délivrés / Ouverts
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                <ChevronRight className="w-4 h-4 text-red-600 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black tracking-tight leading-none text-zinc-950">
                {successEmails}
              </span>
              <span className="text-[11px] text-zinc-500 font-medium mb-1">
                reçus (100%)
              </span>
            </div>
            <div className="mt-5">
              <Badge className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-semibold px-2.5 py-1">
                <CheckCircle2 className="w-3 h-3 mr-1 inline-block" />
                Délivré
              </Badge>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-1 bg-gradient-to-r from-red-600 to-zinc-900 rounded-tl-full" />
        </Card>
      </div>

      {/* Barre de Recherche et Filtres */}
      <Card className="p-3.5 border-border/80 shadow-2xs">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
            <input
              type="text"
              placeholder="Rechercher par objet, nom du salarié, destinataire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-secondary/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-card transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium shrink-0 px-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filtrer :</span>
            </div>

            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)} 
              className="w-full md:w-auto text-xs bg-secondary/40 border border-border rounded-xl px-3 py-2 text-foreground focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none cursor-pointer font-medium"
            >
              <option value="ALL">Tous les types d&apos;emails</option>
              <option value="CONVOCATION_2M">Convocation 2 Mois</option>
              <option value="CONVOCATION_5M">Convocation 5 Mois</option>
              <option value="RAPPEL_RETARD_J2">Rappel Retard J+2</option>
              <option value="ALERTE_CRITIQUE_J5">Alerte Critique J+5</option>
              <option value="CONFIRMATION_RH">Confirmation RH</option>
            </select>

            <select 
              value={filterBatch} 
              onChange={(e) => setFilterBatch(e.target.value)} 
              className="w-full md:w-auto text-xs bg-secondary/40 border border-border rounded-xl px-3 py-2 text-foreground focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none cursor-pointer font-medium"
            >
              <option value="ALL">Toutes les sources</option>
              <option value="CRON">Cron 09:00 Automatique</option>
              <option value="MANUAL">Manuel / Relance</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tableau interactif */}
      <Card className="overflow-hidden border-border/80 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-secondary/60 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Objet &amp; Détails</th>
                <th className="py-3.5 px-4">Collaborateur</th>
                <th className="py-3.5 px-4">Destinataire</th>
                <th className="py-3.5 px-4">Date / Horaire</th>
                <th className="py-3.5 px-4">Déclencheur</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground bg-card">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-secondary/60 flex items-center justify-center">
                        <Inbox className="w-6 h-6 strokeWidth={1.5}" />
                      </div>
                      <p className="text-xs font-medium">Aucun email ne correspond à vos critères de recherche.</p>
                      <button 
                        onClick={() => { setSearchTerm(''); setFilterType('ALL'); setFilterBatch('ALL'); }}
                        className="text-xs text-red-600 underline font-medium hover:text-red-700 cursor-pointer"
                      >
                        Effacer les filtres
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((mail) => (
                  <tr key={mail.id} className="hover:bg-red-50/30 transition-colors group">
                    <td className="py-3.5 px-4 align-middle">
                      <Badge variant={getBadgeVariant(mail.typeEmail)} className="text-[10px] font-semibold whitespace-nowrap">
                        {typeLabel(mail.typeEmail)}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-secondary/70 flex items-center justify-center text-muted-foreground shrink-0 group-hover:bg-red-100/60 group-hover:text-red-600 transition-colors">
                          <Mail className="w-3.5 h-3.5" strokeWidth={1.75} />
                        </div>
                        <span className="font-semibold text-foreground text-xs tracking-tight line-clamp-1 max-w-xs group-hover:text-red-700 transition-colors">
                          {mail.objet}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" strokeWidth={1.75} />
                        <span className="font-semibold text-foreground">{mail.salarieNom}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-middle">
                      <div>
                        <span className="font-medium text-foreground block">{mail.destinataireNom}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{mail.destinataire}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-middle font-mono text-[11px]">
                      <span className="flex items-center gap-1 text-foreground">
                        <Calendar className="w-3 h-3 text-muted-foreground" strokeWidth={1.75} />
                        {mail.dateEnvoi}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground text-[10px] mt-0.5">
                        <Clock className="w-3 h-3" strokeWidth={1.75} />
                        {mail.heureEnvoi}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 align-middle">
                      {mail.batchCron ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-red-100 text-red-700 border border-red-200/60">
                          <Zap className="w-3 h-3 text-red-600 fill-red-600" strokeWidth={1.5} />
                          Cron 09:00
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border">
                          Manuel
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 align-middle">
                      <Badge variant="appleGreen" className="text-[10px] font-mono">
                        {mail.statut}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 align-middle text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => openEmailModal(mail)} 
                        className="cursor-pointer ml-auto flex items-center gap-1 h-7 text-xs border-border/80 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors shadow-2xs"
                      >
                        <span>Aperçu</span>
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