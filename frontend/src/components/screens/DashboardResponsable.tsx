'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Users,
} from 'lucide-react';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

type KpiCardProps = {
  title: string;
  value: number;
  suffix: string;
  badgeLabel: string;
  badgeIcon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  cardIcon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  onClick?: () => void;
  badgeTone?: 'red' | 'dark' | 'neutral';
  urgent?: boolean;
  idleIcon?: boolean;
};

function KpiCard({
  title,
  value,
  suffix,
  badgeLabel,
  badgeIcon: BadgeIcon,
  cardIcon: CardIcon,
  onClick,
  badgeTone = 'red',
  urgent = false,
  idleIcon = false,
}: KpiCardProps) {
  const badgeClass =
    badgeTone === 'dark'
      ? 'bg-zinc-900 text-white border-0 hover:bg-zinc-800'
      : badgeTone === 'neutral'
        ? 'bg-zinc-100 text-zinc-700 border border-zinc-200'
        : 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100';

  return (
    <Card
      onClick={onClick}
      className="
        group relative overflow-hidden cursor-pointer
        bg-white border border-zinc-200
        rounded-2xl p-5
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg hover:border-red-200
      "
    >
      <div
        className={`
          absolute -right-8 -bottom-8
          w-32 h-32
          rotate-12
          transition-transform duration-500
          group-hover:scale-125
          ${
            urgent
              ? 'bg-gradient-to-br from-red-100 to-transparent'
              : 'bg-gradient-to-br from-red-50 to-transparent'
          }
        `}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className={`
                w-11 h-11 rounded-xl
                flex items-center justify-center
                border
                transition-colors duration-300
                ${
                  idleIcon
                    ? 'bg-zinc-50 border-zinc-200 group-hover:bg-zinc-900'
                    : 'bg-red-50 border-red-100 group-hover:bg-red-600'
                }
              `}
            >
              <CardIcon
                className={`w-5 h-5 transition-colors ${
                  idleIcon
                    ? 'text-zinc-600 group-hover:text-white'
                    : 'text-red-600 group-hover:text-white'
                }`}
                strokeWidth={2}
              />
            </div>

            <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-zinc-600">
              {title}
            </span>
          </div>

          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-600 transition-colors">
            <ChevronRight className="w-4 h-4 text-red-600 group-hover:text-white transition-colors" />
          </div>
        </div>

        <div className="flex items-end gap-3">
          <span
            className={`text-4xl font-black tracking-tight leading-none ${
              urgent && value > 0 ? 'text-red-600' : 'text-zinc-950'
            }`}
          >
            {value}
          </span>
          <span className="text-[11px] text-zinc-500 font-medium mb-1">{suffix}</span>
        </div>

        <div className="mt-5">
          <Badge className={`text-[10px] font-semibold px-2.5 py-1 ${badgeClass}`}>
            <BadgeIcon className="w-3 h-3 mr-1" />
            {badgeLabel}
          </Badge>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-16 h-1 bg-gradient-to-r from-red-600 to-zinc-900 rounded-tl-full" />
    </Card>
  );
}

type Notification = {
  id: string;
  tone: 'red' | 'dark' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  periodeId: string | number;
};

// Ordre de priorité d'affichage (0 = le plus urgent)
const PRIORITE: Record<string, number> = {
  EN_RETARD: 0,
  EN_RELANCE: 1,
  EN_COURS: 2,
  PLANIFIEE: 3,
  EMAIL_ENVOYE: 3,
  EN_ATTENTE: 3,
  COMPLETEE: 4,
  VALIDEE_RH: 5,
};

// Nombre maximum de lignes affichées sur le tableau de bord
const MAX_AFFICHES = 5;

// ============================================================================
// 2. DASHBOARD RESPONSABLE
// ============================================================================

export default function DashboardResponsable() {
  const {
    salaries,
    periodes,
    navigateTo,
    currentResponsable,
    parametres
  } = useApp();

  const aFaire = periodes.filter(
    (p) =>
      p.statut === "EN_COURS" ||
      p.statut === "EN_RELANCE" ||
      p.statut === "PLANIFIEE" ||
      p.statut === "EMAIL_ENVOYE" ||
      p.statut === "EN_ATTENTE"
  );

  const soumises = periodes.filter(
    (p) =>
      p.statut === "COMPLETEE" ||
      p.statut === "VALIDEE_RH"
  );

  const retards = periodes.filter(
    (p) => p.statut === "EN_RETARD"
  );

  // Périodes prioritaires : retard > relance > en cours > complétées (ruptures masquées)
  const periodesPrioritaires = useMemo(
    () =>
      [...periodes]
        .filter((p) => p.statut !== 'RUPTURE')
        .sort(
          (a, b) =>
            (PRIORITE[a.statut] ?? 9) - (PRIORITE[b.statut] ?? 9) ||
            new Date(a.dateEcheance).getTime() - new Date(b.dateEcheance).getTime()
        )
        .slice(0, MAX_AFFICHES),
    [periodes]
  );

  const notifications: Notification[] = useMemo(() => {
    const late: Notification[] = retards.map((p) => ({
      id: `late-${p.id}`,
      tone: 'red',
      icon: AlertTriangle,
      title: `Retard imminent (${p.salarieNom})`,
      description: `Échéance ${p.dateEcheance}`,
      periodeId: p.id,
    }));

    const todo: Notification[] = aFaire.map((p) => ({
      id: `todo-${p.id}`,
      tone: 'dark',
      icon: Clock,
      title: `Période en cours (${p.salarieNom})`,
      description: `Échéance ${p.dateEcheance}`,
      periodeId: p.id,
    }));

    const done: Notification[] = soumises.map((p) => ({
      id: `done-${p.id}`,
      tone: 'neutral',
      icon: CheckCircle2,
      title: `Évaluation soumise (${p.salarieNom})`,
      description: `Transmise à la RH`,
      periodeId: p.id,
    }));

    return [...late, ...todo, ...done].slice(0, 6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodes]);

  const prenomResponsable = currentResponsable
    ? currentResponsable.firstName
    : (parametres?.profil?.prenom || 'Responsable');
  const directionName = currentResponsable?.directionName ?? parametres?.profil?.direction ?? '—';

  return (
    <div className="space-y-7 font-sans">

      {/* HEADER */}
      <div className="
        flex
        flex-col
        gap-4
        sm:flex-row
        sm:items-end
        sm:justify-between
      ">
        <div>
          <div className="
            mb-2
            flex
            items-center
            gap-2
          ">
            <span
              className="h-2 w-2 rounded-full bg-red-600"
              aria-hidden
            />
            <span className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.18em]
              text-red-600
            ">
              Espace Responsable
            </span>
          </div>

          <h2 className="
            text-4xl
            font-bold
            tracking-tight
            text-zinc-950
          ">
            Bonjour {prenomResponsable}
          </h2>

          <p className="
            mt-1
            text-[14px]
            text-zinc-500
          ">
            {directionName}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigateTo("periodes")}
            size="sm"
            className="
              h-9
              rounded-xl
              border-zinc-200
              text-xs
              font-semibold
              hover:border-red-200
              hover:bg-red-50
              hover:text-red-600
              cursor-pointer
            "
          >
            <Calendar className="mr-2 h-3.5 w-3.5" />
            Mes Évaluations
          </Button>

          <Button
            variant="outline"
            onClick={() => navigateTo("salaries")}
            size="sm"
            className="
              h-9
              rounded-xl
              border-zinc-200
              text-xs
              font-semibold
              hover:border-red-200
              hover:bg-red-50
              hover:text-red-600
              cursor-pointer
            "
          >
            <Users className="mr-2 h-3.5 w-3.5" />
            Mes Salariés ({salaries.length})
          </Button>
        </div>
      </div>

      {/* ALERT */}
      {retards.length > 0 && (
        <div className="
          flex
          flex-col
          gap-4
          rounded-2xl
          border
          border-red-100
          bg-red-50/60
          p-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        ">
          <div className="
            flex
            items-center
            gap-3
          ">
            <div className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-red-600
              text-white
            ">
              <AlertTriangle className="h-4 w-4" />
            </div>

            <div>
              <p className="
                text-xs
                font-bold
                text-zinc-950
              ">
                {retards.length} évaluation
                {retards.length > 1 ? "s" : ""} en retard
              </p>

              <p className="
                mt-0.5
                text-[10px]
                text-zinc-600
              ">
                Certaines évaluations nécessitent votre intervention.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => {
              const first = retards[0];
              if (first) {
                navigateTo(
                  "formulaire-evaluation",
                  {
                    periodeId: first.id,
                  }
                );
              } else {
                navigateTo("retards");
              }
            }}
            className="
              h-9
              rounded-xl
              bg-red-600
              text-[10px]
              font-semibold
              text-white
              hover:bg-red-700
              cursor-pointer
            "
          >
            <FileText className="mr-2 h-3 w-3" />
            Remplir l&apos;évaluation
          </Button>
        </div>
      )}

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Mes salariés"
          value={salaries.length}
          suffix="collaborateurs affectés"
          badgeLabel="Équipe"
          badgeIcon={Users}
          cardIcon={Users}
          onClick={() => navigateTo("salaries")}
        />

        <KpiCard
          title="Évaluations à faire"
          value={aFaire.length}
          suffix="Période 3M et 6M"
          badgeLabel="À traiter"
          badgeIcon={Clock}
          cardIcon={Clock}
          onClick={() => navigateTo("periodes")}
        />

        <KpiCard
          title="Évaluations soumises"
          value={soumises.length}
          suffix="transmises à la RH"
          badgeLabel="Soumis"
          badgeIcon={FileText}
          cardIcon={CheckCircle2}
          badgeTone="red"
          onClick={() => navigateTo("periodes")}
        />

        <KpiCard
          title="Retards équipe"
          value={retards.length}
          suffix={
            retards.length > 0 ? "actions à régulariser" : "aucun retard signalé"
          }
          badgeLabel={retards.length > 0 ? "À régulariser" : "À jour"}
          badgeIcon={retards.length > 0 ? AlertTriangle : CheckCircle2}
          cardIcon={AlertTriangle}
          badgeTone={retards.length > 0 ? "red" : "neutral"}
          urgent={retards.length > 0}
          idleIcon={retards.length === 0}
          onClick={() => navigateTo("retards")}
        />
      </div>


      {/* MAIN */}
      <div className="
        grid
        grid-cols-1
        gap-6
        xl:grid-cols-4
      ">

        {/* LISTE DES SALARIÉS AFFECTÉS & ÉVALUATIONS (PRIORITAIRES) */}
        <Card className="
          overflow-hidden
          rounded-2xl
          border
          border-zinc-200
          bg-white
          shadow-sm
          xl:col-span-3
        ">
          <div className="
            flex
            items-center
            justify-between
            border-b
            border-zinc-100
            px-5
            py-4
          ">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <Users className="h-4 w-4" />
                </div>

                <h3 className="text-sm font-semibold text-zinc-900">
                  Mes Salariés & Évaluations de Période d&apos;Essai
                </h3>
              </div>
              <p className="
                mt-0.5 ml-9
                text-[10px]
                text-zinc-500
              ">
                Les évaluations prioritaires en premier
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateTo("periodes")}
              className="
                h-8
                text-[10px]
                font-semibold
                text-red-600
                hover:bg-red-50
                cursor-pointer
              "
            >
              Voir tout ({periodes.length})
              <ChevronRight className="
                ml-1
                h-3
                w-3
              " />
            </Button>
          </div>

          <div className="
            divide-y
            divide-zinc-100
          ">
            {periodesPrioritaires.length === 0 ? (
              <div className="
                flex
                flex-col
                items-center
                justify-center
                gap-2
                px-5
                py-12
                text-center
              ">
                <div className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  bg-zinc-50
                  text-zinc-400
                ">
                  <Users className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold text-zinc-900">
                  Aucun salarié affecté
                </p>
              </div>
            ) : (
              periodesPrioritaires.map((periode) => {
                const isRetard = periode.statut === 'EN_RETARD';
                const isCompletee = periode.statut === 'COMPLETEE' || periode.statut === 'VALIDEE_RH';
                const isEnCoursOrRelance = periode.statut === 'EN_COURS' || periode.statut === 'EN_RELANCE' || periode.statut === 'PLANIFIEE';

                const badgeLabel = 
                  periode.statut === 'EN_RETARD' ? 'En retard' :
                  periode.statut === 'EN_RELANCE' ? 'En relance' :
                  periode.statut === 'EN_COURS' ? 'En cours' :
                  periode.statut === 'COMPLETEE' ? 'Complétée' :
                  periode.statut === 'VALIDEE_RH' ? 'Validée RH' :
                  periode.statut === 'RUPTURE' ? 'Rupture' : 'Planifiée';

                const badgeClass =
                  periode.statut === 'EN_RETARD' ? 'bg-red-100 text-red-700 border-red-200' :
                  periode.statut === 'EN_RELANCE' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                  periode.statut === 'EN_COURS' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  periode.statut === 'RUPTURE' ? 'bg-rose-900 text-white border-rose-950' :
                  'bg-emerald-50 text-emerald-700 border-emerald-200';

                const typeLabel = periode.typePeriode === 'TROIS_MOIS' || periode.typePeriode === 'DEUX_MOIS'
                  ? 'Période 1 (3 mois)'
                  : 'Période 2 (6 mois)';

                return (
                  <div
                    key={periode.id}
                    className="
                      group
                      flex
                      items-center
                      justify-between
                      gap-4
                      p-4
                      transition-colors
                      hover:bg-zinc-50/60
                    "
                  >
                    <div className="
                      flex
                      min-w-0
                      items-center
                      gap-3
                    ">
                      <div className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-zinc-100
                        text-[10px]
                        font-bold
                        text-zinc-700
                        transition-all
                        group-hover:bg-red-600
                        group-hover:text-white
                      ">
                        {getInitials(periode.salarieNom)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              navigateTo("detail-salarie", {
                                salarieId: periode.salarieId,
                              })
                            }
                            className="
                              truncate
                              text-xs
                              font-bold
                              text-zinc-950
                              hover:text-red-600
                              cursor-pointer
                            "
                          >
                            {periode.salarieNom}
                          </button>
                          <Badge variant="outline" className={`text-[9px] font-semibold ${badgeClass}`}>
                            {badgeLabel}
                          </Badge>
                        </div>

                        <p className="
                          mt-0.5
                          truncate
                          text-[10px]
                          text-zinc-500
                        ">
                          {periode.salariePoste}
                          {" • "}
                          {typeLabel}
                          {" • "}
                          Échéance :{" "}
                          <span className="font-mono">
                            {periode.dateEcheance}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="
                      flex
                      shrink-0
                      items-center
                      gap-2
                    ">
                      {/* LOGIQUE :
                          - EN_RETARD -> Bouton "Remplir"
                          - EN_COURS / EN_RELANCE -> Aucun bouton
                          - COMPLETEE / VALIDEE_RH -> Bouton "Consulter" (lecture seule)
                      */}
                      {isRetard && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigateTo("formulaire-evaluation", {
                              periodeId: periode.id,
                            })
                          }
                          className="
                            h-8
                            rounded-lg
                            border-red-200
                            text-[10px]
                            font-semibold
                            cursor-pointer
                            bg-red-600 
                            text-white
                            hover:bg-red-700
                          "
                        >
                          Remplir
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      )}

                      {isCompletee && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigateTo("formulaire-evaluation", {
                              periodeId: periode.id,
                            })
                          }
                          className="
                            h-8
                            rounded-lg
                            border-zinc-200
                            text-[10px]
                            font-semibold
                            cursor-pointer
                            bg-zinc-100
                            text-zinc-800
                            hover:bg-zinc-200
                          "
                        >
                          Consulter
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      )}

                      {isEnCoursOrRelance && (
                        <span className="text-[10px] text-zinc-400 font-medium italic px-2">
                          Aucune action requise
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Lien "Voir tout" en bas de la liste */}
          {periodes.length > periodesPrioritaires.length && (
            <button
              onClick={() => navigateTo("periodes")}
              className="flex w-full cursor-pointer items-center justify-center gap-1 border-t border-zinc-100 py-3 text-[11px] font-semibold text-red-600 transition-colors hover:bg-red-50/50"
            >
              Voir tout ({periodes.length})
              <ChevronRight className="h-3 w-3" />
            </button>
          )}
        </Card>

        {/* NOTIFICATIONS */}
        <Card className="
          overflow-hidden
          rounded-2xl
          border
          border-zinc-200
          bg-white
          shadow-sm
          xl:col-span-1
          self-start
        ">
          <div className="
            flex
            items-center
            justify-between
            border-b
            border-zinc-100
            px-5
            py-4
          ">
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Bell className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-900">
                Dernières nouvelles
              </h3>
            </div>

            {notifications.length > 0 && (
              <Badge className="bg-red-600 text-white border-0 text-[10px] font-semibold px-2 py-0.5 hover:bg-red-600">
                {notifications.length}
              </Badge>
            )}
          </div>

          <div className="divide-y divide-zinc-100">
            {notifications.length === 0 ? (
              <div className="
                flex
                flex-col
                items-center
                justify-center
                gap-2
                px-5
                py-12
                text-center
              ">
                <div className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  bg-zinc-50
                  text-zinc-400
                ">
                  <Bell className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold text-zinc-900">
                  Aucune notification
                </p>
                <p className="text-[11px] text-zinc-500">
                  Vous êtes à jour.
                </p>
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = n.icon;
                const toneClass =
                  n.tone === 'red'
                    ? 'bg-red-50 text-red-600 border-red-100'
                    : n.tone === 'dark'
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-zinc-100 text-zinc-600 border-zinc-200';

                return (
                  <button
                    key={n.id}
                    onClick={() =>
                      navigateTo("formulaire-evaluation", {
                        periodeId: Number(n.periodeId),
                      })
                    }
                    className="
                      group
                      flex
                      w-full
                      items-start
                      gap-3
                      p-4
                      text-left
                      transition-colors
                      hover:bg-red-50/30
                      cursor-pointer
                    "
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${toneClass}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-zinc-950 group-hover:text-red-600">
                        {n.title}
                      </p>
                      <p className="mt-0.5 truncate text-[10px] text-zinc-500">
                        {n.description}
                      </p>
                    </div>

                    <ChevronRight className="mt-1 h-3 w-3 shrink-0 text-zinc-400 group-hover:text-red-600" />
                  </button>
                );
              })
            )}
          </div>
        </Card>

      </div>
    </div>
  );
}