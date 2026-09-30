'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
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

// ============================================================================
// 2. DASHBOARD RESPONSABLE
// ============================================================================

export default function DashboardResponsable() {
  const {
    salaries,
    periodes,
    navigateTo,
    currentResponsable,
  } = useApp();

  const aFaire = periodes.filter(
    (p) =>
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

  const responsableName = currentResponsable
    ? `${currentResponsable.firstName} ${currentResponsable.lastName}`
    : 'Responsable';
  const directionName = currentResponsable?.directionName ?? '—';

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
            Bienvenue, {responsableName}
          </h2>

          <p className="
            mt-1
            text-[14px]
            text-zinc-500
          ">
            de {directionName}
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
            Compléter l&apos;évaluation
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
          suffix="Periode 2M et 5M"
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

        {/* EVALUATIONS EN RETARD UNIQUEMENT */}
        <Card className="
          overflow-hidden
          rounded-2xl
          border
          border-zinc-200
          bg-white
          shadow-sm
          xl:col-span-4
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
                <div className="flex h-6 w-6 mt-1 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                </div>

                <h3 className="text-sm font-semibold text-zinc-900">
                  Évaluations en retard
                </h3>
              </div>
              <p className="
                mt-0.5 ml-7
                text-[10px] 
                text-zinc-500
              ">
                {retards.length} évaluation{retards.length > 1 ? "s" : ""} nécessitant une régularisation
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateTo("retards")}
              className="
                h-8
                text-[10px]
                font-semibold
                text-red-600
                hover:bg-red-50
                cursor-pointer
              "
            >
              Toutes
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
            {retards.length === 0 ? (
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
                  bg-emerald-50
                  text-emerald-600
                ">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold text-zinc-900">
                  Aucun retard à signaler
                </p>
                <p className="text-[11px] text-zinc-500">
                  Toutes les évaluations de votre équipe sont à jour.
                </p>
              </div>
            ) : (
              retards.map((periode) => {
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
                      hover:bg-red-50/30
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

                        <p className="
                          mt-0.5
                          truncate
                          text-[10px]
                          text-zinc-500
                        ">
                          {periode.salariePoste}
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
                      <span className="
                        rounded-full
                        border
                        border-red-100
                        bg-red-50
                        px-2
                        py-1
                        text-[9px]
                        font-bold
                        text-red-600
                      ">
                        +{periode.joursRetard}j
                      </span>

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
                          bg-gradient-to-b from-red-500 to-red-950 
                          text-white
                        "
                      >
                        Remplir
                        <ChevronRight className="
                          ml-1
                          h-3
                          w-3
                        " />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

      </div>
    </div>
  );
}