"use client";

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import AIAnalysisModule from './AIAnalysisModule';
import {
  aptitudesPersoItems,
  competencesProItems,
  qseItems,
} from '@/lib/evaluationCriteria';

function buildCriteria(
  items: { id: string; label: string }[],
  scores: Record<string, number>,
  comments: Record<string, string>
) {
  return items.map((item) => ({
    nom: item.label,
    note: scores[item.id] === undefined ? 'Non évalué' : `${scores[item.id]}/5`,
    commentaire: comments[item.id] ?? '',
  }));
}

export default function AIAnalysisScreen() {
  const { evaluations, periodes, selectedPeriodeId, saveAIAnalysis, navigateTo } = useApp();

  const [activePeriodeId, setActivePeriodeId] = useState<number>(() => {
    if (selectedPeriodeId && periodes.some((p) => p.id === selectedPeriodeId)) {
      return selectedPeriodeId;
    }
    const evalPeriode = evaluations[0]?.periodeId;
    if (evalPeriode && periodes.some((p) => p.id === evalPeriode)) {
      return evalPeriode;
    }
    return periodes[0]?.id || 1;
  });

  // Synchronisation si selectedPeriodeId change dans l'app
  useState(() => {
    if (selectedPeriodeId && periodes.some((p) => p.id === selectedPeriodeId)) {
      setActivePeriodeId(selectedPeriodeId);
    }
  });

  const currentPeriode = periodes.find((p) => p.id === activePeriodeId) || periodes[0];
  const currentEvaluation = evaluations.find((e) => e.periodeId === currentPeriode?.id);
  const savedForm = currentEvaluation?.donneesFormulaireComplet;
  const savedAI = currentEvaluation?.donneesAnalyseAI || currentPeriode?.donneesAnalyseAI;

  const data = currentPeriode
    ? {
        salarieName: currentPeriode.salarieNom || 'Salarié',
        poste: savedForm?.poste || currentPeriode.salariePoste || 'Poste non renseigné',
        criteres: savedForm
          ? [
              ...buildCriteria(
                competencesProItems,
                savedForm.scoresCompetences,
                savedForm.commentairesCompetences
              ),
              ...buildCriteria(
                aptitudesPersoItems,
                savedForm.scoresAptitudes,
                savedForm.commentairesAptitudes
              ),
              ...buildCriteria(qseItems, savedForm.scoresQSE, savedForm.commentairesQSE),
            ]
          : [
              ...buildCriteria(
                competencesProItems,
                { comp_1: 4, comp_2: 4, comp_3: 4, comp_4: 4, comp_5: 4, comp_6: 4, comp_7: 4, comp_8: 4 },
                { comp_1: 'Très bon niveau technique' }
              ),
              ...buildCriteria(
                aptitudesPersoItems,
                { apt_1: 4, apt_2: 4, apt_3: 4, apt_4: 4, apt_5: 4, apt_6: 4, apt_7: 4, apt_8: 4 },
                { apt_1: 'Bonne intégration collective' }
              ),
              ...buildCriteria(
                qseItems,
                { qse_1: 4, qse_2: 4, qse_3: 4, qse_4: 4, qse_5: 4, qse_6: 4, qse_7: 4, qse_8: 4 },
                { qse_1: 'Respect des procédures' }
              ),
            ],
        appreciationGenerale: [
          savedForm?.appreciationGenerale,
          savedForm?.commentairesObjectifs,
          savedForm?.recommandationCommentaire,
          currentEvaluation?.avisResponsable,
        ]
          .filter(Boolean)
          .join('\n') || 'Bilan professionnel satisfaisant au cours de la période.',
        pointsForts: savedForm?.pointsForts || currentEvaluation?.pointsForts,
        axesAmelioration: savedForm?.axesAmelioration || currentEvaluation?.axesAmelioration,
        donneesAnalyseAI: savedAI,
      }
    : null;

  return (
    <div className="space-y-6">
      {/* Header statutaire stylisé */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
              Analyse IA des Évaluations
            </h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Audit cognitif, calcul automatisé des moyennes et aide à la décision pour les périodes d&apos;essai.
          </p>
        </div>
      </div>

      {periodes.length === 0 ? (
        <Card className="space-y-3 p-8 text-center border-dashed">
          <p className="text-sm font-semibold text-foreground">Aucune période d&apos;évaluation disponible</p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Les évaluations de votre équipe apparaîtront ici pour le traitement décisionnel.
          </p>
          <Button variant="outline" size="sm" onClick={() => navigateTo('periodes')}>
            Voir les périodes d’évaluation
          </Button>
        </Card>
      ) : (
        <>
          <div className="p-4 rounded-xl bg-card border border-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <label htmlFor="ai-evaluation-select" className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                Collaborateur &amp; Période à analyser
              </label>
              <p className="text-[11px] text-muted-foreground">
                Sélectionnez le collaborateur pour consulter ou générer son analyse IA.
              </p>
            </div>

            <div className="w-full md:w-88">
              <select
                id="ai-evaluation-select"
                value={currentPeriode?.id ?? ''}
                onChange={(event) => setActivePeriodeId(Number(event.target.value))}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-background px-3 py-2 text-xs font-semibold text-foreground shadow-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-600 outline-none cursor-pointer"
              >
                {periodes.map((p) => {
                  const hasAI = !!(p.donneesAnalyseAI || evaluations.find((e) => e.periodeId === p.id)?.donneesAnalyseAI);
                  return (
                    <option key={p.id} value={p.id}>
                      {p.salarieNom} — {p.typePeriode === 'TROIS_MOIS' ? 'Période 1 (3 mois)' : 'Période 2 (6 mois)'} {hasAI ? '✦ (Analyse enregistrée)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {data && (
            <AIAnalysisModule
              key={currentPeriode?.id}
              data={data}
              onSaveAnalysis={(res) => {
                if (currentPeriode?.id) saveAIAnalysis(currentPeriode.id, res);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}