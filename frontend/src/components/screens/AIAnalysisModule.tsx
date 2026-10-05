import React, { useState } from "react";
import { Sparkles, Loader2, CheckCircle2, TrendingUp, Target } from "lucide-react";

interface EvaluationData {
  salarieName?: string;
  poste: string;
  criteres: { nom: string; note: string; commentaire: string }[];
  appreciationGenerale: string;
}

interface AIAnalysisResult {
  pointsForts: string[];
  axesAmelioration: string[];
  planAccompagnement: {
    action: string;
    objectif: string;
    echeance: string;
    moyens: string;
  }[];
}

export default function AIAnalysisModule({ data }: { data: EvaluationData }) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const generateAnalysis = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/ai-evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Une erreur est survenue pendant l’analyse.');
      }
      setAnalysis(result);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Une erreur est survenue pendant l’analyse.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 mt-6 p-6 bg-card border border-border rounded-2xl shadow-sm">
      {/* Bouton pour déclencher l'IA */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">

      {errorMessage && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      )}
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            Analyse &amp; Plan d&apos;accompagnement IA
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Générez automatiquement la synthèse, les points forts et le plan d&apos;action à partir des critères et appréciations renseignés.
          </p>
        </div>

        <button
          onClick={generateAnalysis}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Générer l&lsquo;Analyse IA
            </>
          )}
        </button>
      </div>

      {/* Résultat de l'analyse */}
      {analysis && (
        <div className="space-y-6">
          {/* Points Forts & Axes d'Amélioration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Points Forts */}
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2">
              <h4 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4" />
                Principaux Points Forts
              </h4>
              <ul className="list-disc list-inside text-xs text-foreground space-y-1">
                {analysis.pointsForts.map((pt, idx) => (
                  <li key={idx}>{pt}</li>
                ))}
              </ul>
            </div>

            {/* Axes d'Amélioration */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
              <h4 className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
                <TrendingUp className="w-4 h-4" />
                Axes d&apos;Amélioration Identifiés
              </h4>
              <ul className="list-disc list-inside text-xs text-foreground space-y-1">
                {analysis.axesAmelioration.map((axe, idx) => (
                  <li key={idx}>{axe}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tableau du Plan d'Accompagnement */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
              <Target className="w-4 h-4 text-primary" />
              Plan d&apos;Accompagnement / Recommandations
            </h4>

            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary/60 text-muted-foreground border-b border-border uppercase font-medium">
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
                      <td className="py-3 px-3 whitespace-nowrap text-foreground font-medium">{item.echeance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}