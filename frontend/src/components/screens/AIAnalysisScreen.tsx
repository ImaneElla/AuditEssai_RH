"use client";

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
      <div>
        <h2 className="text-xl font-bold text-foreground">Analyse IA des évaluations</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Obtenez des pistes de synthèse et d’accompagnement à partir d’une évaluation soumise.
        </p>
      </div>

      {availableEvaluations.length === 0 ? (
        <Card className="space-y-3 p-6">
          <p className="text-sm font-semibold text-foreground">Aucune évaluation disponible</p>
          <p className="text-sm text-muted-foreground">
            Les évaluations soumises de votre équipe apparaîtront ici pour analyse.
          </p>
          <Button variant="outline" onClick={() => navigateTo('periodes')}>
            Voir les périodes d’évaluation
          </Button>
        </Card>
      ) : (
        <>
          <div className="max-w-xl space-y-2">
            <label htmlFor="ai-evaluation-select" className="text-sm font-medium text-foreground">
              Évaluation à analyser
            </label>
            <select
              id="ai-evaluation-select"
              value={selectedEvaluation?.id ?? ''}
              onChange={(event) => setSelectedEvaluationId(Number(event.target.value))}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
            >
              {availableEvaluations.map((evaluation) => {
                const periode = periodes.find((item) => item.id === evaluation.periodeId);
                return (
                  <option key={evaluation.id} value={evaluation.id}>
                    {periode?.salarieNom ?? 'Salarié'} · {periode?.typePeriode ?? 'Évaluation'}
                  </option>
                );
              })}
            </select>
          </div>

          <p className="max-w-3xl text-xs text-muted-foreground">
            Le nom du salarié n’est pas transmis à OpenAI. Les notes et commentaires le sont pour
            générer les suggestions ; vérifiez-les avant de les utiliser.
          </p>

          {data && <AIAnalysisModule key={selectedEvaluation?.id} data={data} />}
        </>
      )}
    </div>
  );
}