"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ChevronRight,
  TrendingUp,
  PlusCircle,
  ClipboardList,
  Download,
  Eye
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import DashboardResponsable from './DashboardResponsable';

// =========================================================================
// 1. DASHBOARD RH / ADMIN (SUPERVISION GLOBALE DE TOUT LE SYSTÈME)
// =========================================================================
function DashboardRH() {
  const {
    salaries,
    periodes,
    navigateTo,
    parametres
  } = useApp();

  const [filterPeriode, setFilterPeriode] = useState<'TOUS' | 'PRIORITAIRE'>('PRIORITAIRE');

  // Logged in user greeting prenom
  const prenomCompte = parametres.profil.prenom || 'Administrateur';

  // Key metrics
  const totalTitularises = salaries.filter(s => s.statutEssai === 'CONFIRMEE').length;
  const totalRuptures = salaries.filter(s => s.statutEssai === 'RUPTURE').length;
  const totalDecisionsFinales = totalTitularises + totalRuptures;
  const tauxTitularisation = totalDecisionsFinales
    ? Math.round((totalTitularises / totalDecisionsFinales) * 100)
    : 0;
  const tauxRupture = totalDecisionsFinales
    ? Math.round((totalRuptures / totalDecisionsFinales) * 100)
    : 0;
  const retards = periodes.filter(p => p.statut === 'EN_RETARD');

  const periodesAffichees = filterPeriode === 'PRIORITAIRE'
    ? periodes.filter(p => p.statut === 'EN_RETARD' || p.statut === 'EN_RELANCE' || p.statut === 'EMAIL_ENVOYE' || p.statut === 'EN_ATTENTE')
    : periodes.slice(0, 5);


  const getDecisionDate = (s: any): Date | null => {
    const raw = s.dateDecision || s.dateFinEssai || s.dateEmbauche;
    const d = raw ? new Date(raw) : null;
    return d && !Number.isNaN(d.getTime()) ? d : null;
  };

  const currentYear = new Date().getFullYear();
  const MOIS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

  const evolutionAnnuelle = MOIS.map((mois, index) => {
    const countByStatut = (statut: string) =>
      salaries.filter(s => {
        if (s.statutEssai !== statut) return false;
        const d = getDecisionDate(s);
        return d !== null && d.getFullYear() === currentYear && d.getMonth() === index;
      }).length;

    return {
      mois,
      titularisation: countByStatut('CONFIRMEE'),
      ruptures: countByStatut('RUPTURE'),
    };
  });

  const totalTituAnnee = evolutionAnnuelle.reduce((sum, m) => sum + m.titularisation, 0);
  const totalRuptAnnee = evolutionAnnuelle.reduce((sum, m) => sum + m.ruptures, 0);

  // ---------------------------------------------------------------------
  // Mini calendrier du mois + date du jour
  // ---------------------------------------------------------------------
  const today = new Date();
  const dateDuJour = today.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const moisCourant = today.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const calYear = today.getFullYear();
  const calMonth = today.getMonth();
  const joursDuMois = new Date(calYear, calMonth + 1, 0).getDate();
  const decalage = (new Date(calYear, calMonth, 1).getDay() + 6) % 7; // lundi = 0

  const joursEcheances = new Set(
    periodes
      .map(p => new Date(p.dateEcheance))
      .filter(d => !Number.isNaN(d.getTime()) && d.getFullYear() === calYear && d.getMonth() === calMonth)
      .map(d => d.getDate())
  );

  const cellulesCalendrier: (number | null)[] = [
    ...Array(decalage).fill(null),
    ...Array.from({ length: joursDuMois }, (_, i) => i + 1),
  ];

  // ---------------------------------------------------------------------
  // Export CSV des périodes (Actions rapides)
  // ---------------------------------------------------------------------
  const exporterRapport = () => {
    const entetes = ['Salarié', 'Poste', 'Responsable', 'Type', 'Statut', 'Échéance'];
    const lignes = periodes.map(p => [
      p.salarieNom,
      p.salariePoste,
      p.responsableNom,
      p.typePeriode,
      p.statut,
      p.dateEcheance,
    ]);

    const csv = [entetes, ...lignes]
      .map(row => row.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';'))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-periodes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header DRH */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p suppressHydrationWarning className="text-[11px] font-semibold text-red-700 capitalize mb-1">
            {dateDuJour}
          </p>
          <h2 className="text-xl md:text-4xl font-bold text-foreground tracking-tight">
            Bonjour {prenomCompte}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Direction des Ressources Humaines • Supervision globale, Période &amp; alertes automatiques
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            onClick={() => navigateTo('periodes')}
            size="sm"
            className="flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.75} />
            <span>Toutes les Périodes</span>
          </Button>
        </div>
      </div>

      {/* ================================================================
          GLOBAL KPI CARDS — PREMIUM LIGHT / RED & BLACK
      ================================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* 1 — TOTAL TITULARISÉS */}
        <Card
          onClick={() => navigateTo('archive')}
          className="group relative overflow-hidden cursor-pointer bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-red-200"
        >
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-red-50 to-transparent rotate-12 transition-transform duration-500 group-hover:scale-125" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                  <Users className="w-5 h-5 text-red-600 group-hover:text-white transition-colors" strokeWidth={2} />
                </div>
                <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-zinc-600">
                  Total titularisés
                </span>
              </div>

              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                <ChevronRight className="w-4 h-4 text-red-600 group-hover:text-white transition-colors" />
              </div>
            </div>

            <div className="flex items-end gap-3">
              <span className="text-4xl font-black tracking-tight leading-none text-zinc-950">
                {totalTitularises}
              </span>
              <span className="text-[11px] text-zinc-500 font-medium mb-1">
                salariés confirmés définitivement
              </span>
            </div>

            <div className="mt-5">
              <Badge className="bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 text-[10px] font-semibold px-2.5 py-1">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Décisions RH finalisées
              </Badge>
            </div>
          </div>

          <div className="absolute bottom-0 right-0 w-16 h-1 bg-gradient-to-r from-red-600 to-zinc-900 rounded-tl-full" />
        </Card>

        {/* 2 — TOTAL RUPTURES */}
        <Card
          onClick={() => navigateTo('archive')}
          className="group relative overflow-hidden cursor-pointer bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-red-200"
        >
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-red-50 to-transparent rotate-12 transition-transform duration-500 group-hover:scale-125" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                  <Clock className="w-5 h-5 text-red-600 group-hover:text-white transition-colors" strokeWidth={2} />
                </div>
                <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-zinc-600">
                  Total ruptures
                </span>
              </div>

              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                <ChevronRight className="w-4 h-4 text-red-600 group-hover:text-white transition-colors" />
              </div>
            </div>

            <div className="flex items-end gap-3">
              <span className="text-4xl font-black tracking-tight leading-none text-zinc-950">
                {totalRuptures}
              </span>
              <span className="text-[11px] text-zinc-500 font-medium mb-1">
                salariés en fin de période d’essai
              </span>
            </div>

            <div className="mt-5">
              <Badge className="bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 text-[10px] font-semibold px-2.5 py-1">
                <Clock className="w-3 h-3 mr-1" />
                Relances automatiquement arrêtées
              </Badge>
            </div>
          </div>

          <div className="absolute bottom-0 right-0 w-16 h-1 bg-gradient-to-r from-red-600 to-zinc-900 rounded-tl-full" />
        </Card>

        {/* 3 — TAUX DE TITULARISATION */}
        <Card
          onClick={() => navigateTo('archive')}
          className="group relative overflow-hidden cursor-pointer bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-red-200"
        >
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-red-100 to-transparent rotate-12 transition-transform duration-500 group-hover:scale-125" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-colors duration-300 group-hover:bg-red-600 ${
                    totalRuptures > 0 ? 'bg-red-50 border-red-100' : 'bg-red-100 border-zinc-200'
                  }`}
                >
                  <AlertTriangle
                    className={`w-5 h-5 transition-colors group-hover:text-white ${
                      totalRuptures > 0 ? 'text-red-600' : 'text-red-500'
                    }`}
                    strokeWidth={2}
                  />
                </div>
                <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-zinc-600">
                  Taux de titularisation
                </span>
              </div>

              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                <ChevronRight className="w-4 h-4 text-red-600 group-hover:text-white transition-colors" />
              </div>
            </div>

            <div className="flex items-end gap-3">
              <span
                className={`text-4xl font-black tracking-tight leading-none ${
                  totalRuptures > 0 ? 'text-red-600' : 'text-zinc-950'
                }`}
              >
                {tauxTitularisation}%
              </span>
              <span className="text-[11px] text-zinc-500 font-medium mb-1">
                des décisions finales
              </span>
            </div>

            <div className="mt-5">
              {totalRuptures > 0 ? (
                <Badge className="bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 text-[10px] font-semibold px-2.5 py-1">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Taux de rupture : {tauxRupture}%
                </Badge>
              ) : (
                <Badge className="bg-zinc-100 text-zinc-700 border border-zinc-200 text-[10px] font-semibold px-2.5 py-1">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Aucune rupture
                </Badge>
              )}
            </div>
          </div>

          <div className="absolute bottom-0 right-0 w-16 h-1 bg-gradient-to-r from-red-600 to-zinc-900 rounded-tl-full" />
        </Card>
      </div>

      {/* Main Section: 2 Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (2 Cols): Graphique */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm">
            <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-red-600" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground tracking-tight">Évolution Annuelle</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Titularisation vs Ruptures sur l&apos;année {currentYear}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] font-normal">
                <Calendar className="w-3 h-3 mr-1" />
                1 an
              </Badge>
            </div>

            <div className="p-4">
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evolutionAnnuelle} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                    <XAxis
                      dataKey="mois"
                      tick={{ fontSize: 12, fill: '#52525b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 12, fill: '#52525b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e4e4e7', fontSize: 12 }} />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      wrapperStyle={{ fontSize: 12 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="titularisation"
                      name="Titularisation"
                      stroke="#f59e0b"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#f59e0b' }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="ruptures"
                      name="Ruptures"
                      stroke="#dc2626"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#dc2626' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <p className="text-center text-[11px] text-muted-foreground mt-2">
                Bilan {currentYear} :{' '}
                <span className="text-amber-600 font-medium">
                  {totalTituAnnee} titularisation{totalTituAnnee > 1 ? 's' : ''}
                </span>
                {' '}•{' '}
                <span className="text-red-600 font-medium">
                  {totalRuptAnnee} rupture{totalRuptAnnee > 1 ? 's' : ''}
                </span>
              </p>
            </div>
          </Card>
        </div>

        {/* Right Column (1 Col): Période d'Évaluation */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/20">
              <h3 className="text-sm font-semibold text-foreground tracking-tight">
                Période d&apos;Évaluation
              </h3>

              <div className="flex items-center bg-secondary/80 p-0.5 rounded-lg border border-border/60 text-[11px]">
                <button
                  onClick={() => setFilterPeriode('TOUS')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    filterPeriode === 'TOUS' ? 'bg-card text-foreground font-semibold shadow-2xs' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setFilterPeriode('PRIORITAIRE')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    filterPeriode === 'PRIORITAIRE' ? 'bg-card text-foreground font-semibold shadow-2xs' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Prioritaires {retards.length > 0 && `(${retards.length})`}
                </button>
              </div>
            </div>

            <div className="divide-y divide-border/60">
              {periodesAffichees.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  Aucune période prioritaire à traiter pour le moment.
                </div>
              ) : (
                periodesAffichees.map((periode) => {
                  const isOverdue = periode.statut === 'EN_RETARD';
                  const is3M = periode.typePeriode === 'TROIS_MOIS';

                  return (
                    <div
                      key={periode.id}
                      className={`p-3.5 transition-colors flex items-center justify-between gap-3 ${
                        isOverdue ? 'bg-zinc-50/80 hover:bg-zinc-100/60' : 'hover:bg-secondary/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-medium text-xs shrink-0 bg-zinc-100 text-zinc-700 border border-zinc-200/80">
                          {is3M ? '3M' : '6M'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              onClick={() => navigateTo('detail-salarie', { salarieId: periode.salarieId })}
                              className="font-semibold text-foreground text-xs hover:underline cursor-pointer truncate tracking-tight"
                            >
                              {periode.salarieNom}
                            </span>
                            <Badge
                              variant="secondary"
                              className="text-[10px] hidden sm:inline-flex font-normal"
                            >
                              {is3M ? 'Période 1 (3 mois)' : 'Période 2 (6 mois)'}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                            {periode.salariePoste} • Resp : <strong className="text-primary font-medium">{periode.responsableNom}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigateTo('formulaire-evaluation', { periodeId: periode.id })}
                          className="text-xs h-7 cursor-pointer border-border bg-gradient-to-br from-red-500 to-red-900 text-white hover:bg-secondary"
                        >
                          Consulter
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer (maintenant À L'INTÉRIEUR de la Card) */}
            <div className="p-4 border-t border-border flex items-center justify-between bg-secondary/20">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateTo('periodes')
              }
                className="flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.75} />
                Voir Toutes les Périodes
              </Button>

              <AlertTriangle className="w-4 h-4 text-red-600" strokeWidth={2} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. MAIN DASHBOARD
// ============================================================================

export default function DashboardAdmin() {
  const { currentRole } = useApp();

  if (currentRole === "RESPONSABLE") {
    return <DashboardResponsable />;
  }

  return <DashboardRH />;
}