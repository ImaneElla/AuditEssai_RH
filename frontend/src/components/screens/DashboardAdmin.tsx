"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  UserPlus, 
  Calendar, 
  Mail, 
  ChevronRight, 
  FileText, 
  Send,
  ExternalLink,
  Zap
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
    relancerRetard, 
  } = useApp();

  const [filterJalons, setFilterJalons] = useState<'TOUS' | 'PRIORITAIRE'>('TOUS');

  // Key metrics
  const totalActifs = salaries.filter(s => s.statutEssai === 'EN_COURS' || s.statutEssai === 'RENOUVELEE').length;
  const periodes2M = periodes.filter(p => p.typePeriode === 'DEUX_MOIS' && p.statut !== 'VALIDEE_RH');
  const periodes5M = periodes.filter(p => p.typePeriode === 'CINQ_MOIS' && p.statut !== 'VALIDEE_RH');
  const retards = periodes.filter(p => p.statut === 'EN_RETARD');

  const periodesAffichees = filterJalons === 'PRIORITAIRE'
    ? periodes.filter(p => p.statut === 'EN_RETARD' || p.statut === 'EMAIL_ENVOYE' || p.statut === 'EN_ATTENTE')
    : periodes.slice(0, 5);

    
    

  return (
    <div className="space-y-6 font-sans">
      {/*  Header DRH  */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
          Tableau de bord
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Direction des Ressources Humaines • Supervision globale, jalons &amp; alertes automatiques
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            onClick={() => navigateTo('ajouter-salarie')}
            size="sm"
            className="flex items-center gap-2 shadow-xs cursor-pointer btn-gradient"
          >
            <UserPlus className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Nouveau Salarié</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => navigateTo('periodes')}
            size="sm"
            className="flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.75} />
            <span>Tous les Jalons</span>
          </Button>
        </div>
      </div>
{/* ================================================================
    3. GLOBAL KPI CARDS — PREMIUM LIGHT / RED & BLACK
================================================================ */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

  {/* ============================================================
      1 — PÉRIODES ACTIVES
  ============================================================ */}
  <Card
    onClick={() => navigateTo('salaries')}
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
            Périodes actives
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
          {totalActifs}
        </span>

        <span className="
          text-[11px]
          text-zinc-500
          font-medium
          mb-1
        ">
          collaborateurs actuellement suivis
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
          +{salaries.length - totalActifs} confirmé
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
      2 — JALONS 2 MOIS
  ============================================================ */}
  <Card
    onClick={() => navigateTo('periodes')}
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
            Jalons 2 mois
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
          {periodes2M.length}
        </span>

        <span className="
          text-[11px]
          text-zinc-500
          font-medium
          mb-1
        ">
          évaluations à préparer
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
          À suivre
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
      3 — JALONS 5 MOIS
  ============================================================ */}
  <Card
    onClick={() => navigateTo('periodes')}
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
            <FileText
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
            Jalons 5 mois
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
          {periodes5M.length}
        </span>

        <span className="
          text-[11px]
          text-zinc-500
          font-medium
          mb-1
        ">
          décision à prendre
        </span>

      </div>

      <div className="mt-5">

        <Badge
          className="
            bg-red-50
              text-red-600
            border-0
            text-[10px]
            font-semibold
            px-2.5
            py-1
          "
        >
          <FileText className="w-3 h-3 mr-1" />
          Décision
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
      4 — RETARDS
  ============================================================ */}
  <Card
    onClick={() => navigateTo('retards')}
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
              retards.length > 0
                ? 'bg-red-50 border-red-100 group-hover:bg-red-600'
                : 'bg-zinc-50 border-zinc-200 group-hover:bg-zinc-900'
            }
          `}>

            <AlertTriangle
              className={`
                w-5 h-5 transition-colors
                ${
                  retards.length > 0
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
            Retards &gt; 2 jours
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
          ${retards.length > 0 ? 'text-red-600' : 'text-zinc-950'}
        `}>
          {retards.length}
        </span>

        <span className="
          text-[11px]
          text-zinc-500
          font-medium
          mb-1
        ">
          actions à régulariser
        </span>

      </div>

      <div className="mt-5">

        {retards.length > 0 ? (

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
            À régulariser
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
            À jour
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
        {/* Left Column (2 Cols): Jalons d'Évaluation + Moteur d'Automatisation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Jalons d'Évaluation en Cours */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/20">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold text-foreground tracking-tight">
                  Jalons d&apos;Évaluation en Cours
                </h3>
                <div className="flex items-center bg-secondary/80 p-0.5 rounded-lg border border-border/60 text-[11px]">
                  <button
                    onClick={() => setFilterJalons('TOUS')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      filterJalons === 'TOUS' ? 'bg-card text-foreground font-semibold shadow-2xs' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setFilterJalons('PRIORITAIRE')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      filterJalons === 'PRIORITAIRE' ? 'bg-card text-foreground font-semibold shadow-2xs' : 'text-muted-foreground hover:text-foreground'
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
                  Aucun jalon prioritaire à traiter pour le moment.
                </div>
              ) : (
                periodesAffichees.map((periode) => {
                  const isOverdue = periode.statut === 'EN_RETARD';
                  const isCompleted = periode.statut === 'COMPLETEE' || periode.statut === 'VALIDEE_RH';

                  return (
                    <div 
                      key={periode.id} 
                      className={`p-3.5 transition-colors flex items-center justify-between gap-3 ${
                        isOverdue ? 'bg-zinc-50/80 hover:bg-zinc-100/60' : 'hover:bg-secondary/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-medium text-xs shrink-0 bg-zinc-100 text-zinc-700 border border-zinc-200/80">
                          {periode.typePeriode === 'DEUX_MOIS' ? '2M' : '5M'}
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
                              {periode.typePeriode === 'DEUX_MOIS' ? 'Bilan 2 mois' : 'Bilan 5 mois'}
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
                        {isOverdue ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => relancerRetard(periode.id)}
                            className="flex items-center gap-1.5 border-zinc-300 text-zinc-800 hover:bg-zinc-100 shadow-2xs cursor-pointer text-xs"
                          >
                            <Send className="w-3 h-3 text-muted-foreground" strokeWidth={1.75} />
                            <span>Relancer</span>
                          </Button>
                        ) : isCompleted ? (
                          <Badge variant="appleGreen" className="flex items-center gap-1 text-xs py-1">
                            <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
                            <span>{periode.decisionFinale || 'Validé'}</span>
                          </Badge>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigateTo('formulaire-evaluation', { periodeId: periode.id })}
                            className="cursor-pointer text-xs"
                          >
                            Consulter
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* Section 2: Moteur d'Automatisation & Batch 09:00 */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-3 bg-secondary/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-zinc-100 border border-zinc-200/80 text-zinc-700 flex items-center justify-center font-medium shadow-2xs">
                  <Clock className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
                    <span>Moteur d’Automatisation &amp; Règles Système</span>
                    <Badge variant="secondary" className="text-[9px] font-mono px-1.5 py-0">
                      Batch 09:00
                    </Badge>
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Supervision du cycle automatique quotidien, détection des retards &amp; alertes RH
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-zinc-700 font-medium bg-zinc-100 border border-zinc-200/80 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span>Moteur Actif</span>
                </span>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* 3 Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-secondary/40 border border-border/70 space-y-1">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">
                    Horodatage Batch
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-bold font-mono text-foreground">09:00:00</span>
                    <span className="text-[11px] text-muted-foreground">quotidien</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Déclenchement automatique sans intervention</p>
                </div>

                <div className="p-3 rounded-xl bg-secondary/40 border border-border/70 space-y-1">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">
                    Seuil Retard
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-bold font-mono text-foreground">&gt; 2 Jours</span>
                    <span className="text-[11px] text-muted-foreground">ouvrés</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Déclenche alerte de relance automatique</p>
                </div>

                <div className="p-3 rounded-xl bg-secondary/40 border border-border/70 space-y-1">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">
                    Escalade RH
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-bold text-foreground">J+2 &amp; Copie DRH</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Notification directe à Saida KARDOUSSI</p>
                </div>
              </div>

              {/* Règles Métier & Cycle Automatique */}
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/60 space-y-3">
                <h4 className="text-xs font-semibold text-foreground tracking-tight flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.75} />
                  <span>Cycle &amp; Règles de Surveillance Réglementaire</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200/80 font-medium flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <strong className="text-foreground text-[11px] block">Jalons 2M &amp; 5M à J-0</strong>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                        Envoi automatique de la convocation au manager à 09:00 et du lien sécurisé au collaborateur.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200/80 font-medium flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <strong className="text-foreground text-[11px] block">Alerte Retard &gt; 48h</strong>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                        Détection automatique des évaluations non renseignées sous 2 jours ouvrés avec relance groupée.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200/80 font-medium flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <strong className="text-foreground text-[11px] block">Validation Finale DRH</strong>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                        Visa officiel DCH (Confirmation, Renouvellement ou Rupture) et notification électronique finale.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ── Right Column (1 Col): Flux des Emails Automatiques ── */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/20">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200/80 text-zinc-700 flex items-center justify-center shadow-2xs">
                  <Mail className="w-3.5 h-3.5" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-foreground tracking-tight">
                    Emails Automatiques
                  </h3>
                  <p className="text-[10px] text-muted-foreground">
                    Journal d’envoi (Batch 09:00)
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateTo('emails')}
                className="text-muted-foreground hover:text-foreground text-[11px] h-7 px-2 font-medium cursor-pointer"
              >
                <span>Tous ({emails.length})</span>
                <ChevronRight className="w-3 h-3 ml-0.5" strokeWidth={2} />
              </Button>
            </div>

            <div className="divide-y divide-border/60 max-h-[540px] overflow-y-auto">
              {emails.slice(0, 6).map((mail) => (
                <div
                  key={mail.id}
                  onClick={() => openEmailModal(mail)}
                  className="p-3.5 hover:bg-secondary/40 transition-colors cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[9px] font-medium px-2 py-0.5 rounded border ${
                      mail.typeEmail === 'RAPPEL_RETARD_J2'
                        ? 'bg-rose-50/70 text-rose-700 border-rose-200/70'
                        : mail.typeEmail === 'CONFIRMATION_RH'
                        ? 'bg-emerald-50/70 text-emerald-800 border-emerald-200/70'
                        : 'bg-zinc-100 text-zinc-700 border-zinc-200/70'
                    }`}>
                      {mail.typeEmail.replace(/_/g, ' ')}
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
                      className="h-6 px-1.5 text-[10px] text-zinc-500 hover:text-foreground cursor-pointer"
                    >
                      <span>Voir</span>
                      <ExternalLink className="w-2.5 h-2.5 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-border/60 bg-secondary/20 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateTo('emails')}
                className="w-full text-xs h-8 cursor-pointer"
              >
                <span>Consulter l’historique d’audit complet</span>
              </Button>
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
