"use client";

import React, { useState, useRef, useEffect } from "react";
import { Eye, ChevronDown, FileText, Sparkles, Brain, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { PeriodeEvaluation } from "@/types";

interface ConsulterBoutonProps {
  periode?: PeriodeEvaluation | null;
  periodeId?: number;
  salarieId?: number;
  salarieNom?: string;
  className?: string;
  size?: "sm" | "default";
  variant?: "outline" | "solid";
}

export default function ConsulterBouton({
  periode,
  periodeId,
  salarieId,
  salarieNom,
  className = "",
  size = "sm",
  variant = "outline"
}: ConsulterBoutonProps) {
  const { periodes, allPeriodes, navigateTo } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Résolution intelligente de la période et du salarié
  const effectiveSalarieId = periode?.salarieId || salarieId;
  const effectivePeriode =
    periode ||
    (periodeId ? periodes.find((p) => p.id === periodeId) || allPeriodes?.find((p) => p.id === periodeId) : null) ||
    (effectiveSalarieId ? periodes.find((p) => p.salarieId === effectiveSalarieId) || allPeriodes?.find((p) => p.salarieId === effectiveSalarieId) : null);

  const effectivePeriodeId = effectivePeriode?.id || periodeId;
  const displayName = effectivePeriode?.salarieNom || salarieNom || "Collaborateur";

  // Fermer le menu au clic extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleOpenFormulaire = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    if (effectivePeriodeId) {
      navigateTo("formulaire-evaluation", { periodeId: effectivePeriodeId });
    } else if (effectiveSalarieId) {
      navigateTo("detail-salarie", { salarieId: effectiveSalarieId });
    }
  };

  const handleOpenAnalyseAI = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    navigateTo("analyse-ia", {
      periodeId: effectivePeriodeId,
      salarieId: effectiveSalarieId
    });
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`inline-flex items-center justify-center gap-1.5 font-bold rounded-lg transition-all cursor-pointer shadow-2xs select-none ${
          size === "sm" ? "px-2.5 py-1 text-[11px] h-7" : "px-3.5 py-2 text-xs h-8"
        } ${
          variant === "solid"
            ? "bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-red-900 border border-red-700/80"
            : "bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-foreground border border-border hover:border-zinc-400 dark:hover:border-zinc-600"
        }`}
        title="Consulter le dossier"
      >
        <Eye className="w-3.5 h-3.5 text-zinc-500" />
        <span>Consulter</span>
        <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* DROPDOWN MENU AVEC LES DEUX CHOIX */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-1.5 w-64 rounded-xl bg-card border border-border shadow-2xl z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150"
        >
          <div className="p-2.5 border-b border-border bg-muted/40">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Options de consultation
            </p>
            <p className="text-xs font-bold text-foreground truncate mt-0.5">
              {displayName}
            </p>
          </div>

          <div className="p-1.5 space-y-1">
            {/* CHOIX 1 : FORMULAIRE D'ÉVALUATION */}
            <button
              type="button"
              onClick={handleOpenFormulaire}
              className="w-full text-left p-2.5 rounded-lg hover:bg-secondary/70 transition-colors flex items-start gap-2.5 group cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Consulter le Formulaire
                </p>
                <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                  Fiche d&apos;évaluation complète avec les 24 critères et signatures.
                </p>
              </div>
            </button>

            {/* CHOIX 2 : ANALYSE IA DU SALARIÉ */}
            <button
              type="button"
              onClick={handleOpenAnalyseAI}
              className="w-full text-left p-2.5 rounded-lg hover:bg-secondary/70 transition-colors flex items-start gap-2.5 group cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/60 text-[#A30000] dark:text-red-400 group-hover:bg-[#A30000] group-hover:text-white transition-colors shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-foreground group-hover:text-[#A30000] dark:group-hover:text-red-400 transition-colors">
                    Consulter l&apos;Analyse du Salarié
                  </p>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-red-100 text-[#A30000] dark:bg-red-950 dark:text-red-300">
                    IA
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                  Diagnostic cognitif, points forts, axes d&apos;amélioration &amp; moyenne.
                </p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
