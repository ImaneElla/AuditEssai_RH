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
  const { evaluations, periodes, navigateTo } = useApp();
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<number | null>(null);

  const availableEvaluations = evaluations
    .filter((evaluation) => periodes.some((periode) => periode.id === evaluation.periodeId))
    .sort((a, b) => b.id - a.id);
  const selectedEvaluation =
    availableEvaluations.find((evaluation) => evaluation.id === selectedEvaluationId) ??
    availableEvaluations[0];
  const selectedPeriode = periodes.find(
    (periode) => periode.id === selectedEvaluation?.periodeId
  );
  const savedForm = selectedEvaluation?.donneesFormulaireComplet;

  const data = selectedEvaluation
    ? {
        salarieName: selectedPeriode?.salarieNom || 'Salarié',
        poste: savedForm?.poste || selectedPeriode?.salariePoste || 'Poste non renseigné',
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
              {
                nom: 'Compétences techniques',
                note: `${selectedEvaluation.competencesTechniques}/5`,
                commentaire: '',
              },
              {
                nom: 'Intégration dans l’équipe',
                note: `${selectedEvaluation.integrationEquipe}/5`,
                commentaire: '',
              },
              {
                nom: 'Autonomie et rigueur',
                note: `${selectedEvaluation.autonomieRigueur}/5`,
                commentaire: '',
              },
              {
                nom: 'Atteinte des objectifs',
                note: `${selectedEvaluation.atteinteObjectifs}/5`,
                commentaire: '',
              },
            ],
        appreciationGenerale: [
          savedForm?.appreciationGenerale,
          savedForm?.commentairesObjectifs,
          savedForm?.recommandationCommentaire,
          selectedEvaluation.avisResponsable,
        ]
          .filter(Boolean)
          .join('\n'),
        pointsForts: savedForm?.pointsForts || selectedEvaluation.pointsForts,
        axesAmelioration: savedForm?.axesAmelioration || selectedEvaluation.axesAmelioration,
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

      {availableEvaluations.length === 0 ? (
        <Card className="space-y-3 p-8 text-center border-dashed">
          <p className="text-sm font-semibold text-foreground">Aucune évaluation disponible pour le moment</p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Les évaluations soumises par les responsables hiérarchiques apparaîtront ici pour le traitement décisionnel.
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
                Sélectionner l&apos;Évaluation à analyser
              </label>
              <p className="text-[11px] text-muted-foreground">
                Choisissez parmi les bilans renseignés par les managers.
              </p>
            </div>

            <div className="w-full md:w-80">
              <select
                id="ai-evaluation-select"
                value={selectedEvaluation?.id ?? ''}
                onChange={(event) => setSelectedEvaluationId(Number(event.target.value))}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-background px-3 py-2 text-xs font-semibold text-foreground shadow-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-600 outline-none cursor-pointer"
              >
                {availableEvaluations.map((evaluation) => {
                  const periode = periodes.find((item) => item.id === evaluation.periodeId);
                  return (
                    <option key={evaluation.id} value={evaluation.id}>
                      {periode?.salarieNom ?? 'Salarié'} — {periode?.typePeriode === 'TROIS_MOIS' ? 'Période 1 (3 mois)' : 'Période 2 (6 mois)'}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {data && <AIAnalysisModule key={selectedEvaluation?.id} data={data} />}
        </>
      )}
    </div>
  );
}