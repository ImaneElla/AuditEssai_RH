"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,   Calendar, 
  Mail, 
  ChevronRight, 
  ExternalLink
} from 'lucide-react';
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
    emails, 
    navigateTo, 
    openEmailModal, 
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

  const prochaines = periodes
    .filter(p => p.statut !== 'VALIDEE_RH' && p.statut !== 'COMPLETEE' && p.statut !== 'EN_RETARD')
    .sort((a, b) => new Date(a.dateEcheance).getTime() - new Date(b.dateEcheance).getTime())
    .slice(0, 4);

  const periodesAffichees = filterPeriode === 'PRIORITAIRE'
    ? periodes.filter(p => p.statut === 'EN_RETARD' || p.statut === 'EN_RELANCE' || p.statut === 'EMAIL_ENVOYE' || p.statut === 'EN_ATTENTE')
    : periodes.slice(0, 5);

  const getEmailBadgeConfig = (typeEmail: string) => {
    if (typeEmail === 'EMAIL_1_EN_COURS') {
      return { label: 'Email 1 (J-21) • En cours', class: 'bg-blue-50 text-blue-700 border-blue-200' };
    }
    if (typeEmail === 'EMAIL_2_EN_RELANCE') {
      return { label: 'Email 2 (J-14) • En relance', class: 'bg-amber-50 text-amber-800 border-amber-200' };
    }
    if (typeEmail === 'EMAIL_3_EN_RETARD' || typeEmail === 'RAPPEL_RETARD_J2') {
      return { label: 'Email 3 (J-7) • En retard', class: 'bg-rose-50 text-rose-700 border-rose-200' };
    }
    if (typeEmail === 'CONFIRMATION_RH') {
      return { label: 'Validation RH', class: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    }
    return { label: typeEmail.replace(/_/g, ' '), class: 'bg-zinc-100 text-zinc-700 border-zinc-200' };
  };

  return (
    <div className="space-y-6 font-sans">
      {/*  Header DRH  */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
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
    3. GLOBAL KPI CARDS — PREMIUM LIGHT / RED & BLACK
================================================================ */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

  {/* ============================================================
      1 — PÉRIODES ACTIVES
  ============================================================ */}
  <Card
    onClick={() => navigateTo('archive')}
    className="
      group relative overflow-hidden cursor-pointer
      bg-white border border-zinc-200
      rounded-2xl p-5
      shadow-sm
      transition-all duration-300
      hover:-translate-y-1 hover:shadow-lg hover:border-red-200
    "
  >
    {/* Décoration bas droite */}
    <div className="
      absolute -right-8 -bottom-8
      w-32 h-32
      bg-gradient-to-br from-red-50 to-transparent
      rotate-12
      transition-transform duration-500
      group-hover:scale-125
    " />

    <div className="relative z-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">

        <div className="flex items-center gap-3">

          {/* Icon */}
          <div className="
            w-11 h-11 rounded-xl
            bg-red-50 border border-red-100
            flex items-center justify-center
            group-hover:bg-red-600
            transition-colors duration-300
          ">
            <Users
              className="w-5 h-5 text-red-600 group-hover:text-white transition-colors"
              strokeWidth={2}
            />
          </div>

          <span className="
            text-[11px]
            font-bold
            tracking-[0.12em]
            uppercase
            text-zinc-600
          ">
            Total titularisés
          </span>

        </div>

        {/* Arrow */}
        <div className="
          w-8 h-8 rounded-full
          bg-red-50
          flex items-center justify-center
          group-hover:bg-red-600
          transition-colors
        ">
          <ChevronRight
            className="w-4 h-4 text-red-600 group-hover:text-white transition-colors"
          />
        </div>

      </div>

      {/* Number */}
      <div className="flex items-end gap-3">

        <span className="
          text-4xl
          font-black
          tracking-tight
          leading-none
          text-zinc-950
        ">
          {totalTitularises}
        </span>

        <span className="
          text-[11px]
          text-zinc-500
          font-medium
          mb-1
        ">
          salariés confirmés définitivement
        </span>

      </div>

      {/* Status */}
      <div className="mt-5">

        <Badge
          className="
            bg-red-50
            text-red-600
            border border-red-100
            hover:bg-red-100
            text-[10px]
            font-semibold
            px-2.5
            py-1
          "
        >
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Décisions RH finalisées
        </Badge>

      </div>

    </div>

    {/* Bottom accent */}
    <div className="
      absolute bottom-0 right-0
      w-16 h-1
      bg-gradient-to-r from-red-600 to-zinc-900
      rounded-tl-full
    " />

  </Card>


  {/* ============================================================
      2 — PÉRIODES EN COURS (3M & 6M)
  ============================================================ */}
  <Card
    onClick={() => navigateTo('archive')}
    className="
      group relative overflow-hidden cursor-pointer
      bg-white border border-zinc-200
      rounded-2xl p-5
      shadow-sm
      transition-all duration-300
      hover:-translate-y-1 hover:shadow-lg hover:border-red-200
    "
  >

    <div className="
      absolute -right-8 -bottom-8
      w-32 h-32
      bg-gradient-to-br from-red-50 to-transparent
      rotate-12
      transition-transform duration-500
      group-hover:scale-125
    " />

    <div className="relative z-10">

      <div className="flex items-center justify-between mb-5">

        <div className="flex items-center gap-3">

          <div className="
            w-11 h-11 rounded-xl
            bg-red-50 border border-red-100
            flex items-center justify-center
            group-hover:bg-red-600
            transition-colors duration-300
          ">
            <Clock
              className="w-5 h-5 text-red-600 group-hover:text-white transition-colors"
              strokeWidth={2}
            />
          </div>

          <span className="
            text-[11px]
            font-bold
            tracking-[0.12em]
            uppercase
            text-zinc-600
          ">
            Total ruptures
          </span>

        </div>

        <div className="
          w-8 h-8 rounded-full
          bg-red-50
          flex items-center justify-center
          group-hover:bg-red-600
          transition-colors
        ">
          <ChevronRight
            className="w-4 h-4 text-red-600 group-hover:text-white transition-colors"
          />
        </div>

      </div>

      <div className="flex items-end gap-3">

        <span className="
          text-4xl
          font-black
          tracking-tight
          leading-none
          text-zinc-950
        ">
          {totalRuptures}
        </span>

        <span className="
          text-[11px]
          text-zinc-500
          font-medium
          mb-1
        ">
          salariés en fin de période d’essai
        </span>

      </div>

      <div className="mt-5">

        <Badge
          className="
            bg-red-50
            text-red-600
            border border-red-100
            hover:bg-red-100
            text-[10px]
            font-semibold
            px-2.5
            py-1
          "
        >
          <Clock className="w-3 h-3 mr-1" />
          Relances automatiquement arrêtées
        </Badge>

      </div>

    </div>

    <div className="
      absolute bottom-0 right-0
      w-16 h-1
      bg-gradient-to-r from-red-600 to-zinc-900
      rounded-tl-full
    " />

  </Card>




  {/* ============================================================
      3 — RETARDS & EN RELANCE
  ============================================================ */}
  <Card
    onClick={() => navigateTo('archive')}
    className="
      group relative overflow-hidden cursor-pointer
      bg-white
      border border-zinc-200
      rounded-2xl p-5
      shadow-sm
      transition-all duration-300
      hover:-translate-y-1 hover:shadow-lg
      hover:border-red-200
    "
  >

    {/* Red warning background */}
    <div className="
      absolute -right-8 -bottom-8
      w-32 h-32
      bg-gradient-to-br from-red-100 to-transparent
      rotate-12
      transition-transform duration-500
      group-hover:scale-125
    " />

    <div className="relative z-10">

      <div className="flex items-center justify-between mb-5">

        <div className="flex items-center gap-3">

          <div className={`
            w-11 h-11 rounded-xl
            flex items-center justify-center
            border
            transition-colors duration-300
            ${
              totalRuptures > 0
                ? 'bg-red-50 border-red-100 group-hover:bg-red-600'
                : 'bg-zinc-50 border-zinc-200 group-hover:bg-zinc-900'
            }
          `}>

            <AlertTriangle
              className={`
                w-5 h-5 transition-colors
                ${
                  totalRuptures > 0
                    ? 'text-red-600 group-hover:text-white'
                    : 'text-zinc-600 group-hover:text-white'
                }
              `}
              strokeWidth={2}
            />

          </div>

          <span className="
            text-[11px]
            font-bold
            tracking-[0.12em]
            uppercase
            text-zinc-600
          ">
            Taux de titularisation
          </span>

        </div>

        <div className="
          w-8 h-8 rounded-full
          bg-red-50
          flex items-center justify-center
          group-hover:bg-red-600
          transition-colors
        ">
          <ChevronRight
            className="w-4 h-4 text-red-600 group-hover:text-white transition-colors"
          />
        </div>

      </div>

      <div className="flex items-end gap-3">

        <span className={`
          text-4xl
          font-black
          tracking-tight
          leading-none
          ${totalRuptures > 0 ? 'text-red-600' : 'text-zinc-950'}
        `}>
          {tauxTitularisation}%
        </span>

        <span className="
          text-[11px]
          text-zinc-500
          font-medium
          mb-1
        ">
          des décisions finales
        </span>

      </div>

      <div className="mt-5">

        {totalRuptures > 0 ? (

          <Badge
            className="
              bg-red-50
              text-red-600
              border border-red-100
              hover:bg-red-100
              text-[10px]
              font-semibold
              px-2.5
              py-1
            "
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            Taux de rupture : {tauxRupture}%
          </Badge>

        ) : (

          <Badge
            className="
              bg-zinc-100
              text-zinc-700
              border border-zinc-200
              text-[10px]
              font-semibold
              px-2.5
              py-1
            "
          >
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Aucune rupture
          </Badge>

        )}

      </div>

    </div>

    <div className="
      absolute bottom-0 right-0
      w-16 h-1
      bg-gradient-to-r from-red-600 to-zinc-900
      rounded-tl-full
    " />

  </Card>

</div>

      {/*  4. Main Section: 2 Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Période d'Évaluation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Période d'Évaluation en Cours */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/20">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold text-foreground tracking-tight">
                  Période d&apos;Évaluation en Cours (3M / 6M)
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

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateTo('periodes')}
                className="text-primary hover:text-primary text-xs font-medium cursor-pointer"
              >
                <span>Tout afficher ({periodes.length})</span>
                <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
              </Button>
            </div>

            <div className="divide-y divide-border/60">
              {periodesAffichees.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  Aucune période prioritaire à traiter pour le moment.
                </div>
              ) : (
                periodesAffichees.map((periode) => {
                  const isOverdue = periode.statut === 'EN_RETARD';
                  const is3M = periode.typePeriode === 'TROIS_MOIS' || periode.typePeriode === 'DEUX_MOIS';

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
                            {isOverdue && (
                              <Badge variant="destructive" className="text-[10px]">
                                +{periode.joursRetard}j retard
                              </Badge>
                            )}
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
          </Card>
          

          <Card className="overflow-hidden">
            <div className="p-4 border-b border-border flex items-center gap-2.5 bg-secondary/20">
              <div className="w-8 h-8 rounded-xl bg-zinc-100 border border-zinc-200/80 text-zinc-700 flex items-center justify-center shadow-2xs">
                <Calendar className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground tracking-tight">Prochaines Échéances (3M / 6M)</h3>
                <p className="text-[11px] text-muted-foreground">Périodes à venir, calculées automatiquement</p>
              </div>
            </div>

            <div className="divide-y divide-border/60">
              {prochaines.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">Aucune échéance à venir.</div>
              ) : (
                prochaines.map((p) => {
                  const jours = Math.ceil((new Date(p.dateEcheance).getTime() - Date.now()) / 86400000);
                  const is3M = p.typePeriode === 'TROIS_MOIS' || p.typePeriode === 'DEUX_MOIS';
                  return (
                    <div key={p.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-secondary/40 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-medium text-xs shrink-0 bg-zinc-100 text-zinc-700 border border-zinc-200/80">
                          {is3M ? '3M' : '6M'}
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-foreground text-xs tracking-tight truncate block">{p.salarieNom}</span>
                          <p className="text-[11px] text-muted-foreground truncate">{p.salariePoste}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-mono text-foreground block">{p.dateEcheance}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {jours > 0 ? `dans ${jours} j` : jours === 0 ? "aujourd'hui" : `il y a ${Math.abs(jours)} j`}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
          {/* Planning des Relances Automatiques */}
<Card className="p-4 bg-gradient-to-br from-red-50/50 via-white to-zinc-50 border border-red-100 rounded-2xl space-y-3 shadow-xs">
  <div className="flex items-center gap-2 font-bold text-xs text-red-700">
    <Mail className="w-4 h-4 text-red-600" />
    <span>Planning des Relances Automatiques</span>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
    <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-zinc-200/80 shadow-2xs">
      <div>
        <span className="font-bold text-zinc-900 block">Email 1 (J-21)</span>
        <span className="text-[10px] text-muted-foreground">Notification initiale</span>
      </div>
      <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
        En cours
      </Badge>
    </div>

    <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-zinc-200/80 shadow-2xs">
      <div>
        <span className="font-bold text-zinc-900 block">Email 2 (J-14)</span>
        <span className="text-[10px] text-muted-foreground">Relance intermédiaire</span>
      </div>
      <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-800 border-amber-200">
        En relance
      </Badge>
    </div>

    <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-zinc-200/80 shadow-2xs">
      <div>
        <span className="font-bold text-zinc-900 block">Email 3 (J-7)</span>
        <span className="text-[10px] text-muted-foreground">Relance urgente / retard</span>
      </div>
      <Badge variant="outline" className="text-[10px] bg-rose-50 text-rose-700 border-rose-200">
        En retard
      </Badge>
    </div>
  </div>
</Card>
        </div>

        {/* ── Right Column (1 Col): Cycle Emails & Journal ── */}
        <div className="space-y-6">
          {/* Automatic Email Schedule Legend */}
       

          <Card className="overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/20">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200/80 text-zinc-700 flex items-center justify-center shadow-2xs">
                  <Mail className="w-3.5 h-3.5" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-foreground tracking-tight">
                    Journal des Emails Automatiques
                  </h3>
                  <p className="text-[10px] text-muted-foreground">
                    Historique des envois selon le statut
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-border/60 max-h-[540px] overflow-y-auto">
              {emails.slice(0, 6).map((mail) => {
                const config = getEmailBadgeConfig(mail.typeEmail);

                return (
                  <div
                    key={mail.id}
                    onClick={() => openEmailModal(mail)}
                    className="p-3.5 hover:bg-secondary/40 transition-colors cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[9px] font-medium px-2 py-0.5 rounded border ${config.class}`}>
                        {config.label}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {mail.heureEnvoi}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-foreground tracking-tight line-clamp-1">
                      {mail.objet}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                      <span className="truncate max-w-[170px]">
                        À : <strong className="text-foreground/80 font-medium">{mail.destinataireNom}</strong>
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEmailModal(mail);
                        }}
                        className="h-6 px-1.5 text-[10px] text-zinc-500 hover:text-foreground cursor-pointer bg-red-50"
                      >
                        <span>Voir</span>
                        <ExternalLink className="w-2.5 h-2.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


// ============================================================================
// 3. MAIN DASHBOARD
// ============================================================================

export default function DashboardAdmin() {

  const { currentRole } = useApp();

  if (currentRole === "RESPONSABLE") {
    return <DashboardResponsable />;
  }

  return <DashboardRH />;
}