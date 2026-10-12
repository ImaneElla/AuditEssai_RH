"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, CheckCircle2, TrendingUp, Target, Calculator, Table as TableIcon, Copy, Check } from "lucide-react";

export interface EvaluationCriterion {
  nom: string;
  note: string;
  commentaire: string;
}

export interface EvaluationData {
  salarieName?: string;
  poste?: string;
  criteres: EvaluationCriterion[];
  appreciationGenerale?: string;
  pointsForts?: string;
  axesAmelioration?: string;
}

export interface SyntheseTableauRow {
  salarie: string;
  point1_pointsForts: string;
  point2_axesAmelioration: string;
  point3_syntheseMoyenne: string;
}

export interface AIAnalysisResult {
  moyenneGlobale?: number;
  pointsForts: string[];
  axesAmelioration: string[];
  planAccompagnement: {
    action: string;
    objectif: string;
    echeance: string;
    moyens: string;
  }[];
  syntheseTableau?: SyntheseTableauRow[];
}

interface AIAnalysisModuleProps {
  data: EvaluationData;
  onApplyToForm?: (pointsFortsText: string, axesAmeliorationText: string, syntheseText: string) => void;
}

export default function AIAnalysisModule({ data, onApplyToForm }: AIAnalysisModuleProps) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  const generateAnalysis = async () => {
    setLoading(true);
    setErrorMessage(null);
    setApplied(false);
    try {
      const response = await fetch("/api/ai-evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Une erreur est survenue pendant l’analyse.");
      }
      setAnalysis(result);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Une erreur est survenue pendant l’analyse.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!analysis || !onApplyToForm) return;
    const pfText = analysis.pointsForts.join("\n• ");
    const axesText = analysis.axesAmelioration.join("\n• ");
    const synthText = analysis.syntheseTableau?.[0]?.point3_syntheseMoyenne || "";
    onApplyToForm(
      pfText ? `• ${pfText}` : "",
      axesText ? `• ${axesText}` : "",
      synthText
    );
    setApplied(true);
    setTimeout(() => setApplied(false), 3000);
  };

  // Calcul du nombre de critères évalués
  const criteresEvaluesCount = data.criteres?.filter((c) => !c.note.includes("Non évalué")).length || 0;
  const totalCriteres = data.criteres?.length || 24;

  return (
    <div className="space-y-6 p-6 bg-card border border-border rounded-2xl shadow-sm">
      {/* En-tête avec bouton de déclenchement */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-100 text-[#A30000] dark:bg-red-950 dark:text-red-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </span>
            <h3 className="text-base font-bold text-foreground">
              Analyse IA RH &amp; Synthèse Automatisée
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Analyse les <span className="font-semibold text-foreground">{totalCriteres} critères d&apos;évaluation</span> et commentaires du responsable pour générer les 3 points clés : Points forts, Axes d&apos;amélioration avec calcul de la moyenne, et Tableau de synthèse.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={generateAnalysis}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#A30000] hover:bg-[#850000] text-white text-xs font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyse IA en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Lancer l&apos;Analyse IA (24 critères)
              </>
            )}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 dark:bg-red-950/30 dark:border-red-900 dark:text-red-300">
          <p className="font-semibold">Impossible de générer l&apos;analyse :</p>
          <p className="mt-0.5">{errorMessage}</p>
        </div>
      )}

      {/* RÉSULTATS DE L'ANALYSE IA EN 3 POINTS */}
      {analysis && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          {/* Bannière récapitulative Salarié & Moyenne Calculée */}
          <div className="p-4 rounded-xl bg-secondary/50 border border-border flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#A30000]/10 text-[#A30000] flex items-center justify-center font-bold text-sm">
                {(data.salarieName || "S")[0].toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Collaborateur évalué</p>
                <p className="text-sm font-bold text-foreground">
                  {data.salarieName || "Salarié"} {data.poste ? `— ${data.poste}` : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-[11px] text-muted-foreground block">Critères renseignés</span>
                <span className="text-xs font-semibold text-foreground">
                  {criteresEvaluesCount} / {totalCriteres} critères
                </span>
              </div>

              {analysis.moyenneGlobale !== undefined && (
                <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-lg border border-border shadow-xs">
                  <Calculator className="w-4 h-4 text-[#A30000]" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Moyenne calculée</span>
                    <span className="text-sm font-black text-[#A30000]">
                      {analysis.moyenneGlobale.toFixed(1)} / 5
                    </span>
                  </div>
                </div>
              )}

              {onApplyToForm && (
                <button
                  onClick={handleApply}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white text-xs font-medium rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  {applied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Appliqué au formulaire !
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Insérer dans le formulaire
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* POINT 1 & POINT 2 : POINTS FORTS ET AXES D'AMÉLIORATION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Identification des points forts */}
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
                  <CheckCircle2 className="w-4 h-4" />
                  1. Identification des Points Forts
                </h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                  {analysis.pointsForts.length} forces clés
                </span>
              </div>
              <ul className="text-xs text-foreground space-y-2">
                {analysis.pointsForts.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-background/60 p-2.5 rounded-lg border border-emerald-500/10">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Détection des axes d'amélioration & Calcul moyenne */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
                  <TrendingUp className="w-4 h-4" />
                  2. Détection des Axes d&apos;Amélioration &amp; Moyenne
                </h4>
                {analysis.moyenneGlobale !== undefined && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300">
                    Moyenne : {analysis.moyenneGlobale.toFixed(1)}/5
                  </span>
                )}
              </div>
              <ul className="text-xs text-foreground space-y-2">
                {analysis.axesAmelioration.map((axe, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-background/60 p-2.5 rounded-lg border border-amber-500/10">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{axe}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* POINT 3 : SYNTHÈSE GÉNÉRALE EN TABLEAU (| SALARIÉ | 1 | 2 | 3 |) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
                <TableIcon className="w-4 h-4 text-[#A30000]" />
                3. Synthèse Générale en Tableau
              </h4>
              <span className="text-[11px] text-muted-foreground">
                Tableau synthétique conforme au bilan managérial
              </span>
            </div>

            <div className="overflow-x-auto border border-border rounded-xl bg-card shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-secondary/70 text-foreground border-b border-border text-[11px] uppercase font-bold tracking-wider">
                    <th className="py-3 px-4 border-r border-border w-1/5">Salarié</th>
                    <th className="py-3 px-4 border-r border-border w-4/15">
                      1. Points Forts
                    </th>
                    <th className="py-3 px-4 border-r border-border w-4/15">
                      2. Axes d&apos;Amélioration
                    </th>
                    <th className="py-3 px-4 w-5/15 bg-primary/5 text-primary">
                      3. Synthèse &amp; Moyenne
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(analysis.syntheseTableau && analysis.syntheseTableau.length > 0
                    ? analysis.syntheseTableau
                    : [
                        {
                          salarie: data.salarieName || "Collaborateur",
                          point1_pointsForts: analysis.pointsForts[0] || "Compétences techniques solides et rigueur opérationnelle.",
                          point2_axesAmelioration: analysis.axesAmelioration[0] || "Autonomie sur les tâches complexes et prise d'initiative.",
                          point3_syntheseMoyenne: `Moyenne : ${analysis.moyenneGlobale ? analysis.moyenneGlobale.toFixed(1) : "3.5"}/5 — Progression constante avec potentiel confirmé.`
                        }
                      ]
                  ).map((row, idx) => (
                    <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-foreground border-r border-border align-top">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                            {row.salarie[0]?.toUpperCase() || "S"}
                          </div>
                          <div>
                            <p className="font-semibold">{row.salarie}</p>
                            {data.poste && (
                              <p className="text-[10px] text-muted-foreground">{data.poste}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-foreground/90 border-r border-border leading-relaxed align-top">
                        <div className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{row.point1_pointsForts}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-foreground/90 border-r border-border leading-relaxed align-top">
                        <div className="flex items-start gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{row.point2_axesAmelioration}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-foreground bg-primary/5 leading-relaxed align-top font-medium">
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-[10px]">
                            {analysis.moyenneGlobale !== undefined ? `Moyenne : ${analysis.moyenneGlobale.toFixed(1)}/5` : "Évaluation"}
                          </span>
                          <p className="text-xs text-foreground/90">{row.point3_syntheseMoyenne}</p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PLAN D'ACCOMPAGNEMENT RECOMMANDÉ */}
          {analysis.planAccompagnement && analysis.planAccompagnement.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
                <Target className="w-4 h-4 text-[#A30000]" />
                Plan d&apos;Accompagnement Recommandé par l&apos;IA
              </h4>

              <div className="overflow-x-auto border border-border rounded-xl bg-card">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary/60 text-muted-foreground border-b border-border uppercase font-semibold text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Action d&apos;accompagnement</th>
                      <th className="py-2.5 px-3">Objectif visé</th>
                      <th className="py-2.5 px-3">Moyens / Formations</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Échéance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {analysis.planAccompagnement.map((item, idx) => (
                      <tr key={idx} className="hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-3 font-medium text-foreground">{item.action}</td>
                        <td className="py-3 px-3 text-muted-foreground">{item.objectif}</td>
                        <td className="py-3 px-3 text-muted-foreground">{item.moyens}</td>
                        <td className="py-3 px-3 whitespace-nowrap text-foreground font-semibold">{item.echeance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}