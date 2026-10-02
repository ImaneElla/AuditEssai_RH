"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useApp } from "../context/AppContext";

import {
  Bell,
  ChevronDown,
  CheckCircle,
  PanelLeft,
  ShieldCheck,
  Briefcase,
  User,
  HelpCircle,
  LogOut,
  Check,
} from "lucide-react";


function getInitials(prenom: string, nom: string): string {
  const p = prenom?.trim()[0] ?? "";
  const n = nom?.trim()[0] ?? "";
  return (p + n).toUpperCase() || "U";
}



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
    parametres,
    currentResponsable,
  } = useApp();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const [isCronRunning, setIsCronRunning] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  const isRH = currentRole === "ADMIN_RH";

  // ── Profile identity: Admin uses parametres.profil, Responsable uses currentResponsable
  const profilePrenom  = isRH ? parametres.profil.prenom  : (currentResponsable?.firstName ?? "Responsable");
  const profileNom     = isRH ? parametres.profil.nom      : (currentResponsable?.lastName  ?? "");
  const profileLabel   = isRH ? (parametres.profil.direction || "DRH Groupe Premium") : (currentResponsable?.poste || currentResponsable?.directionName || "Responsable N+1");

  const initials = getInitials(profilePrenom, profileNom);
  const fullName = `${profilePrenom} ${profileNom}`.trim() || "Utilisateur";

  const unreadNotifs = notifications.filter((n) => !n.estLue);

  const retardsCount = periodes.filter(
    (p) => p.statut === "EN_RETARD"
  ).length;


  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsProfileMenuOpen(false);
      setIsNotifMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
      if (
        notifMenuRef.current &&
        !notifMenuRef.current.contains(e.target as Node)
      ) {
        setIsNotifMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);


  const getScreenTitle = (): string => {
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
          ? "Suivi des Périodes d'Évaluation (3 Mois & 6 Mois)"
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
      case "gestion-responsable":
        return "Annuaire des Responsables";
      case "ajouter-responsable":
        return "Ajouter un Responsable";
      case "dashboard-responsable":
        return "Tableau de Bord Manager";
      case "moteur":
        return "Moteur d'Automatisation & Règles Système";
      case "aide":
        return "Aide & Support RH";

      case "parametres":
        return "Paramètres & Réglages";

      default:
        return "Groupe Premium - Essai Manager";
    }
  };


  const handleCronClick = () => {
    if (isCronRunning) return;
    setIsCronRunning(true);
    setTimeout(() => {
      triggerCronBatch0900();
      setIsCronRunning(false);
    }, 800);
  };


  const switchRole = (role: "ADMIN_RH" | "RESPONSABLE") => {
    setCurrentRole(role);
    setIsProfileMenuOpen(false);
  };



  return (
    <>
      <header
        className="
          h-16 bg-card/95 backdrop-blur-md border-b border-border/80
          px-5 md:px-6 flex items-center justify-between
          sticky top-0 z-30 shadow-2xs font-sans print:hidden
        "
      >
    
        <div className="flex items-center gap-3 min-w-0">
          {isSidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className="
                w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground
                hover:bg-secondary flex items-center justify-center transition-colors
                cursor-pointer border border-border/60 shadow-2xs shrink-0
              "
              title="Développer la barre latérale"
              aria-label="Développer la barre latérale"
            >
              <PanelLeft className="w-4 h-4 text-primary" strokeWidth={1.75} />
            </button>
          )}

          <div className="min-w-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium">
              <span className="text-muted-foreground">Groupe Premium</span>
              <span className="text-border">/</span>
              <span className="text-primary font-semibold uppercase tracking-wider">
                {isRH
                  ? "ESPACE DRH & ADMIN"
                  : currentRole === "RESPONSABLE"
                  ? "ESPACE RESPONSABLE"
                  : "ESPACE COLLABORATEUR"}
              </span>
            </div>

            {/* Screen title */}
            <h1 className="text-sm md:text-[15px] font-semibold text-foreground tracking-tight leading-tight truncate max-w-[380px] md:max-w-[560px]">
              {getScreenTitle()}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">

          <div className="relative" ref={notifMenuRef}>
            <button
              onClick={() => {
                setIsNotifMenuOpen((v) => !v);
                setIsProfileMenuOpen(false);
              }}
              aria-label="Centre de notifications"
              aria-haspopup="true"
              aria-expanded={isNotifMenuOpen}
              className="
                w-9 h-9 flex items-center justify-center text-muted-foreground
                hover:text-foreground rounded-xl hover:bg-secondary
                border border-transparent hover:border-border
                transition-colors relative cursor-pointer
              "
              title="Centre de notifications"
            >
              <Bell className="w-4 h-4" strokeWidth={1.75} />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive ring-2 ring-card" />
              )}
            </button>

            {/* Notification dropdown */}
            {isNotifMenuOpen && (
              <div
                className="
                  absolute right-0 mt-2 w-80 bg-card rounded-2xl
                  shadow-xl border border-border py-2 z-50
                  animate-in fade-in slide-in-from-top-2 duration-150
                "
              >
                <div className="px-4 py-2 border-b border-border/70 flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">Notifications</span>
                  <button
                    onClick={() => {
                      setIsNotifMenuOpen(false);
                      navigateTo("notifications");
                    }}
                    className="text-[11px] text-primary hover:underline font-semibold cursor-pointer"
                  >
                    Voir tout ({notifications.length})
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-border/40">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <Bell className="w-5 h-5 mx-auto text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground">Aucune notification</p>
                    </div>
                  ) : (
                    notifications.slice(0, 4).map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 text-xs hover:bg-secondary/60 transition-colors cursor-pointer ${!n.estLue ? "bg-primary/5" : ""}`}
                        onClick={() => {
                          setIsNotifMenuOpen(false);
                          if (n.lienEcran) {
                            navigateTo(n.lienEcran as Parameters<typeof navigateTo>[0], {
                              salarieId: n.targetId,
                              periodeId: n.targetId,
                            });
                          } else {
                            navigateTo("notifications");
                          }
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                              n.type === "RETARD"
                                ? "bg-destructive/15 text-destructive"
                                : n.type === "CRON_SYSTEME"
                                ? "bg-secondary text-foreground"
                                : "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                            }`}
                          >
                            {n.type}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {n.heureCreation}
                          </span>
                        </div>
                        <p className="font-semibold text-foreground line-clamp-1">{n.titre}</p>
                        <p className="text-muted-foreground text-[11px] line-clamp-2 mt-0.5">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => {
                setIsProfileMenuOpen((v) => !v);
                setIsNotifMenuOpen(false);
              }}
              aria-label="Menu profil utilisateur"
              aria-haspopup="true"
              aria-expanded={isProfileMenuOpen}
              className="
                flex items-center gap-2 rounded-xl border border-border/60
                bg-card hover:bg-secondary transition-colors
                px-2 py-1.5 cursor-pointer shadow-2xs focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-primary/40
              "
            >
              {/* Avatar */}
              <div
                className="
                  w-7 h-7 rounded-full bg-gradient-to-br from-[#A50000] to-[#5C0000]
                  text-white font-bold flex items-center justify-center text-[11px]
                  shadow-sm shrink-0
                "
                aria-hidden="true"
              >
                {initials}
              </div>

              {/* Name + role – hidden on mobile */}
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-foreground leading-none truncate max-w-[120px]">
                  {fullName}
                </p>
                <p className="text-[10px] text-muted-foreground leading-none mt-0.5 truncate max-w-[120px]">
                  {profileLabel}
                </p>
              </div>

              <ChevronDown
                className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${isProfileMenuOpen ? "rotate-180" : ""}`}
                strokeWidth={1.75}
              />
            </button>

            {/* Profile dropdown */}
            {isProfileMenuOpen && (
              <div
                className="
                  absolute right-0 mt-2 w-72 bg-card rounded-2xl
                  shadow-xl border border-border p-1.5 z-50 text-xs
                  animate-in fade-in slide-in-from-top-2 duration-150
                "
                role="menu"
                aria-label="Menu profil"
              >
                {/* Profile header */}
                <div className="px-3 py-3 flex items-center gap-3 border-b border-border/60 mb-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A50000] to-[#5C0000] text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm leading-tight truncate">{fullName}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{profileLabel}</p>
                  </div>
                </div>

                {/* Mon profil */}
                <button
                  role="menuitem"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    navigateTo("parametres");
                  }}
                  className="
                    w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5
                    text-foreground hover:bg-secondary transition-colors cursor-pointer
                    focus-visible:outline-none focus-visible:bg-secondary
                  "
                >
                  <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" strokeWidth={1.75} />
                  </div>
                  <span className="font-medium">Mon profil</span>
                </button>

                {/* Role switcher */}
                <div className="px-3 pt-2 pb-1 text-[10px] uppercase font-semibold text-muted-foreground tracking-wider border-t border-border/60 mt-1">
                  Changer de rôle
                </div>

                {/* ADMIN_RH */}
                <button
                  role="menuitem"
                  onClick={() => switchRole("ADMIN_RH")}
                  className={`
                    w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5
                    transition-colors cursor-pointer focus-visible:outline-none focus-visible:bg-secondary
                    ${isRH ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-secondary"}
                  `}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isRH ? "bg-primary/20" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                    <ShieldCheck className={`w-3.5 h-3.5 ${isRH ? "text-primary" : "text-zinc-600 dark:text-zinc-300"}`} strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block font-semibold">Admin / DRH</span>
                    <span className="text-[10px] text-muted-foreground font-normal">Accès complet au système</span>
                  </div>
                  {isRH && <Check className="w-3.5 h-3.5 text-primary shrink-0" strokeWidth={2.5} />}
                </button>

                {/* RESPONSABLE */}
                <button
                  role="menuitem"
                  onClick={() => switchRole("RESPONSABLE")}
                  className={`
                    w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5
                    transition-colors cursor-pointer focus-visible:outline-none focus-visible:bg-secondary
                    ${currentRole === "RESPONSABLE" ? "bg-secondary text-foreground font-semibold" : "text-foreground hover:bg-secondary"}
                  `}
                >
                  <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    <Briefcase className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block font-semibold">Responsable</span>
                    <span className="text-[10px] text-muted-foreground font-normal">Évalue uniquement ses salariés</span>
                  </div>
                  {currentRole === "RESPONSABLE" && <Check className="w-3.5 h-3.5 text-foreground shrink-0" strokeWidth={2.5} />}
                </button>

                {/* Séparateur */}
                <div className="border-t border-border/60 mt-1 pt-1" />

                {/* Aide & Support */}
                <button
                  role="menuitem"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    navigateTo("aide");
                  }}
                  className="
                    w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5
                    text-foreground hover:bg-secondary transition-colors cursor-pointer
                    focus-visible:outline-none focus-visible:bg-secondary
                  "
                >
                  <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" strokeWidth={1.75} />
                  </div>
                  <span className="font-medium">Aide & Support</span>
                </button>

                {/* Se déconnecter */}
                <button
                  role="menuitem"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    // TODO: brancher ici l'API d'authentification (signOut)
                  }}
                  className="
                    w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5
                    text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20
                    transition-colors cursor-pointer
                    focus-visible:outline-none focus-visible:bg-red-50
                  "
                >
                  <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center shrink-0">
                    <LogOut className="w-3.5 h-3.5 text-red-600 dark:text-red-400" strokeWidth={1.75} />
                  </div>
                  <span className="font-medium">Se déconnecter</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {toastMessage && (
        <div
          className="
            fixed bottom-6 right-6 z-50 bg-card/95 backdrop-blur-md
            text-foreground px-4 py-3 rounded-2xl shadow-xl border border-border
            flex items-center gap-3
            animate-in slide-in-from-bottom-5 duration-200 print:hidden
          "
          role="status"
          aria-live="polite"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
            <CheckCircle className="w-3.5 h-3.5" strokeWidth={2} />
          </div>
          <span className="text-xs font-medium tracking-tight">{toastMessage}</span>
        </div>
      )}
    </>
  );
}