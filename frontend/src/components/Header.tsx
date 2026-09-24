"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";

import {
  Bell,
  Clock,
  ShieldCheck,
  Briefcase,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  PanelLeft,
  Play,
  LayoutDashboard,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Header() {
  const {
    currentScreen,
    navigateTo,
    currentRole,
    setCurrentRole,
    notifications,
    triggerCronBatch0900,
    toastMessage,
    periodes,
    isSidebarCollapsed,
    toggleSidebar,
  } = useApp();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const [isCronRunning, setIsCronRunning] = useState(false);

  const isRH = currentRole === "ADMIN_RH";

  const unreadNotifs = notifications.filter(
    (n) => !n.estLue
  );

  const retardsCount = periodes.filter(
    (p) => p.statut === "EN_RETARD"
  ).length;

  // ============================================================
  // TITRE DE L'ÉCRAN
  // ============================================================

  const getScreenTitle = () => {
    switch (currentScreen) {
      case "dashboard":
        return isRH
          ? "Supervision des Périodes d'Essai"
          : "Tableau de Bord Manager";

      case "salaries":
        return isRH
          ? "Répertoire des Salariés en Période d'Essai"
          : "Mes Salariés Affectés";

      case "ajouter-salarie":
        return "Intégration d'un Nouveau Salarié";

      case "detail-salarie":
        return "Fiche Individuelle & Parcours d'Évaluation";

      case "periodes":
        return isRH
          ? "Suivi des Jalons d'Évaluation (2 Mois & 5 Mois)"
          : "Évaluations à Réaliser — Mon Équipe";

      case "formulaire-evaluation":
        return "Fiche Officielle d'Évaluation";

      case "retards":
        return isRH
          ? "Centre de Surveillance des Retards (> 2 Jours)"
          : "Suivi des Évaluations en Souffrance";

      case "emails":
        return "Journal d'Audit des Emails Automatiques";

      case "notifications":
        return "Centre de Notifications & Alertes";

      case "responsables":
        return "Annuaire des Responsables";

      default:
        return "Groupe Premium - Essai Manager";
    }
  };

  // ============================================================
  // BATCH 09:00
  // ============================================================

  const handleCronClick = () => {
    if (isCronRunning) return;

    setIsCronRunning(true);

    setTimeout(() => {
      triggerCronBatch0900();
      setIsCronRunning(false);
    }, 800);
  };

  // ============================================================
  // RETURN
  // ============================================================

  return (
    <>
      <header
        className="
          h-16
          bg-card/95
          backdrop-blur-md
          border-b
          border-border/80
          px-5
          md:px-6
          flex
          items-center
          justify-between
          sticky
          top-0
          z-30
          shadow-2xs
          font-sans
        "
      >
        {/* ======================================================
            LEFT
        ====================================================== */}

        <div className="flex items-center gap-3 min-w-0">

          {/* Bouton sidebar quand elle est réduite */}
          {isSidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className="
                w-8
                h-8
                rounded-lg
                text-muted-foreground
                hover:text-foreground
                hover:bg-secondary
                flex
                items-center
                justify-center
                transition-colors
                cursor-pointer
                border
                border-border/60
                shadow-2xs
                shrink-0
              "
              title="Développer la barre latérale"
            >
              <PanelLeft
                className="w-4 h-4 text-primary"
                strokeWidth={1.75}
              />
            </button>
          )}

       

          {/* Breadcrumb + titre */}
          <div className="min-w-0">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium">

              <span className="text-muted-foreground">
                Groupe Premium
              </span>

              <span className="text-border">
                /
              </span>

              <span className="text-primary font-semibold uppercase tracking-wider">
                {isRH
                  ? "ESPACE DRH & ADMIN"
                  : currentRole === "RESPONSABLE"
                  ? "ESPACE RESPONSABLE"
                  : "ESPACE COLLABORATEUR"}
              </span>

            </div>

            {/* Titre */}
            <h1
              className="
                text-sm
                md:text-[15px]
                font-semibold
                text-foreground
                tracking-tight
                leading-tight
                truncate
                max-w-[420px]
                md:max-w-[600px]
              "
            >
              {getScreenTitle()}
            </h1>

          </div>
        </div>

        {/* ======================================================
            RIGHT
        ====================================================== */}

        <div className="flex items-center gap-2">
          {/* ==================================================
              NOTIFICATIONS
          ================================================== */}

          <div className="relative">

            <button
              onClick={() =>
                setIsNotifMenuOpen(!isNotifMenuOpen)
              }
              className="
                w-9
                h-9
                flex
                items-center
                justify-center
                text-muted-foreground
                hover:text-foreground
                rounded-xl
                hover:bg-secondary
                border
                border-transparent
                hover:border-border
                transition-colors
                relative
                cursor-pointer
              "
              title="Centre de notifications"
            >
              <Bell
                className="w-4 h-4"
                strokeWidth={1.75}
              />

              {unreadNotifs.length > 0 && (
                <span
                  className="
                    absolute
                    top-2
                    right-2
                    w-2
                    h-2
                    rounded-full
                    bg-destructive
                    ring-2
                    ring-card
                  "
                />
              )}
            </button>

            {/* MENU NOTIFICATIONS */}

            {isNotifMenuOpen && (
              <div
                className="
                  absolute
                  right-0
                  mt-2
                  w-80
                  bg-card
                  rounded-2xl
                  shadow-xl
                  border
                  border-border
                  py-2
                  z-50
                  animate-in
                  fade-in
                  slide-in-from-top-2
                  duration-150
                "
                onClick={(e) =>
                  e.stopPropagation()
                }
              >

                <div
                  className="
                    px-4
                    py-2
                    border-b
                    border-border/70
                    flex
                    items-center
                    justify-between
                  "
                >
                  <span className="text-xs font-semibold text-foreground">
                    Notifications
                  </span>

                  <button
                    onClick={() => {
                      setIsNotifMenuOpen(false);
                      navigateTo("notifications");
                    }}
                    className="
                      text-[11px]
                      text-primary
                      hover:underline
                      font-semibold
                      cursor-pointer
                    "
                  >
                    Voir tout ({notifications.length})
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-border/40">

                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <Bell
                        className="w-5 h-5 mx-auto text-muted-foreground mb-2"
                      />

                      <p className="text-xs text-muted-foreground">
                        Aucune notification
                      </p>
                    </div>
                  ) : (
                    notifications
                      .slice(0, 4)
                      .map((n) => (
                        <div
                          key={n.id}
                          className={`
                            p-3
                            text-xs
                            hover:bg-secondary/60
                            transition-colors
                            cursor-pointer
                            ${
                              !n.estLue
                                ? "bg-primary/5"
                                : ""
                            }
                          `}
                          onClick={() => {
                            setIsNotifMenuOpen(false);

                            if (n.lienEcran) {
                              navigateTo(
                                n.lienEcran as any,
                                {
                                  salarieId:
                                    n.targetId,
                                  periodeId:
                                    n.targetId,
                                }
                              );
                            } else {
                              navigateTo(
                                "notifications"
                              );
                            }
                          }}
                        >

                          <div className="flex items-center justify-between mb-1">

                            <span
                              className={`
                                text-[10px]
                                font-bold
                                px-1.5
                                py-0.5
                                rounded-md
                                ${
                                  n.type === "RETARD"
                                    ? "bg-destructive/15 text-destructive"
                                    : n.type ===
                                      "CRON_SYSTEME"
                                    ? "bg-secondary text-foreground"
                                    : "bg-apple-blue-subtle text-apple-blue"
                                }
                              `}
                            >
                              {n.type}
                            </span>

                            <span className="text-[10px] text-muted-foreground font-mono">
                              {n.heureCreation}
                            </span>

                          </div>

                          <p className="font-semibold text-foreground line-clamp-1">
                            {n.titre}
                          </p>

                          <p className="text-muted-foreground text-[11px] line-clamp-2 mt-0.5">
                            {n.message}
                          </p>

                        </div>
                      ))
                  )}

                </div>
              </div>
            )}

          </div>

          {/* ==================================================
              ROLE SWITCHER
          ================================================== */}

          <div className="relative">

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setIsRoleMenuOpen(!isRoleMenuOpen)
              }
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border-border
                bg-card
                hover:bg-secondary
                text-foreground
                text-xs
                font-medium
                cursor-pointer
                shadow-2xs
              "
            >

              <div className="flex items-center gap-1.5">

                {isRH ? (
                  <ShieldCheck
                    className="w-3.5 h-3.5 text-primary"
                    strokeWidth={1.75}
                  />
                ) : (
                  <Briefcase
                    className="w-3.5 h-3.5 text-zinc-600"
                    strokeWidth={1.75}
                  />
                )}

                <span className="tracking-tight">
                  {isRH
                    ? "ADMIN / RH"
                    : "RESPONSABLE"}
                </span>

              </div>

              <ChevronDown
                className="w-3.5 h-3.5 text-muted-foreground"
                strokeWidth={1.75}
              />

            </Button>

            {/* ROLE MENU */}

            {isRoleMenuOpen && (
              <div
                className="
                  absolute
                  right-0
                  mt-2
                  w-72
                  bg-card
                  rounded-2xl
                  shadow-xl
                  border
                  border-border
                  p-1.5
                  z-50
                  text-xs
                  animate-in
                  fade-in
                  slide-in-from-top-2
                  duration-150
                "
                onClick={() =>
                  setIsRoleMenuOpen(false)
                }
              >

                <div
                  className="
                    px-3
                    py-1.5
                    text-[10px]
                    uppercase
                    font-semibold
                    text-muted-foreground
                    tracking-wider
                    border-b
                    border-border/60
                  "
                >
                  Comptes Authentifiés (2 Rôles)
                </div>

                {/* ADMIN / RH */}

                <button
                  onClick={() =>
                    setCurrentRole("ADMIN_RH")
                  }
                  className={`
                    w-full
                    text-left
                    px-3
                    py-2
                    rounded-xl
                    flex
                    items-center
                    gap-2.5
                    transition-colors
                    cursor-pointer
                    mt-1
                    ${
                      isRH
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-foreground hover:bg-secondary"
                    }
                  `}
                >

                  <ShieldCheck
                    className="w-4 h-4 text-primary shrink-0"
                    strokeWidth={1.75}
                  />

                  <div>
                    <span className="block font-semibold">
                      ADMIN / RH
                    </span>

                    <span className="text-[10px] text-muted-foreground font-normal">
                      Accès complet à l’ensemble du système
                    </span>
                  </div>

                </button>

                {/* RESPONSABLE */}

                <button
                  onClick={() =>
                    setCurrentRole("RESPONSABLE")
                  }
                  className={`
                    w-full
                    text-left
                    px-3
                    py-2
                    rounded-xl
                    flex
                    items-center
                    gap-2.5
                    transition-colors
                    cursor-pointer
                    mt-0.5
                    ${
                      currentRole === "RESPONSABLE"
                        ? "bg-secondary text-foreground font-semibold"
                        : "text-foreground hover:bg-secondary"
                    }
                  `}
                >

                  <Briefcase
                    className="w-4 h-4 text-zinc-600 shrink-0"
                    strokeWidth={1.75}
                  />

                  <div>

                    <span className="block font-semibold">
                      RESPONSABLE 
                    </span>

                    <span className="text-[10px] text-muted-foreground font-normal">
                      Consulte et évalue uniquement ses salariés
                    </span>

                  </div>

                </button>

              </div>
            )}

          </div>

        </div>
      </header>

      {/* ========================================================
          TOAST
      ======================================================== */}

      {toastMessage && (
        <div
          className="
            fixed
            bottom-6
            right-6
            z-50
            bg-card/95
            backdrop-blur-md
            text-foreground
            px-4
            py-3
            rounded-2xl
            shadow-xl
            border
            border-border
            flex
            items-center
            gap-3
            animate-in
            slide-in-from-bottom-5
            duration-200
          "
        >

          <div
            className="
              w-6
              h-6
              rounded-full
              bg-apple-green-subtle
              text-apple-green
              border
              border-apple-green/30
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <CheckCircle
              className="w-3.5 h-3.5"
              strokeWidth={2}
            />
          </div>

          <span className="text-xs font-medium tracking-tight">
            {toastMessage}
          </span>

        </div>
      )}
    </>
  );
}