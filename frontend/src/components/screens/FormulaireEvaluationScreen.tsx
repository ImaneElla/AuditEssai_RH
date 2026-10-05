"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Printer,
  CheckCircle2,
  ArrowLeft,
  Award,
  FileCheck,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  aptitudesPersoItems,
  competencesProItems,
  qseItems,
  type CriterionItem,
} from '@/lib/evaluationCriteria';

// ============================================================================
// Types & static data
// ============================================================================

type ScoreMap = { [id: string]: number };
type CommentMap = { [id: string]: string };
type ObjectifsStatut = 'DEPASSE' | 'ATTEINT' | 'PARTIELLEMENT_ATTEINT' | null;
type Decision = 'VALIDATION' | 'RUPTURE' | 'RENOUVELLEMENT' | 'TITULARISATION' | null;

// Date d'aujourd'hui (fuseau local) au format YYYY-MM-DD
const getToday = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// ============================================================================
// Reusable criteria table (used for the 3 categories)
// ============================================================================

interface CriteriaTableProps {
  title: string;
  items: CriterionItem[];
  scores: ScoreMap;
  comments: CommentMap;
  onScore: (id: string, score: number) => void;
  onComment: (id: string, value: string) => void;
  className?: string;
}

function CriteriaTable({
  title,
  items,
  scores,
  comments,
  onScore,
  onComment,
  className = 'pt-4',
}: CriteriaTableProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="font-bold text-xs uppercase tracking-wide text-zinc-900">{title}</h3>

      <div className="border border-black overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-zinc-100 border-b border-black text-center font-bold">
              <th className="p-2 border-r border-black w-5/12 text-left">Critères</th>
              <th className="p-2 border-r border-black w-3/12">Évaluation</th>
              <th className="p-2 w-4/12 text-left">Commentaires</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-zinc-50/50">
                <td className="p-2 border-r border-black font-medium leading-tight">
                  {item.label}
                </td>
                <td className="p-2 border-r border-black text-center">
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <label
                        key={score}
                        className="flex items-center gap-0.5 cursor-pointer text-[11px]"
                      >
                        <input
                          type="radio"
                          name={`score-${item.id}`}
                          value={score}
                          checked={scores[item.id] === score}
                          onChange={() => onScore(item.id, score)}
                          className="w-3.5 h-3.5 appearance-none rounded-full border-2 border-zinc-500 bg-white checked:border-[#A30000] checked:bg-[#A30000] checked:shadow-[inset_0_0_0_3px_#fff] [print-color-adjust:exact] [-webkit-print-color-adjust:exact]"
                        />
                        <span className="font-bold">{score}</span>
                      </label>
                    ))}
                  </div>
                </td>
                <td className="p-1.5">
                  <input
                    type="text"
                    value={comments[item.id] || ''}
                    onChange={(e) => onComment(item.id, e.target.value)}
                    placeholder="..."
                    className="w-full text-xs px-1.5 py-0.5 border-b border-transparent hover:border-zinc-300 focus:border-black outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// Main screen
// ============================================================================

export default function FormulaireEvaluationScreen() {
  const app = useApp();
  const {
    selectedPeriodeId,
    periodes,
    salaries,
    submitEvaluation,
    navigateTo,
    setSelectedPeriodeId,
  } = app;

  const { evaluations } = app;

  const periode =
    periodes.find((p) => p.id === selectedPeriodeId) ||
    periodes.find((p) => p.statut !== 'VALIDEE_RH') ||
    periodes[0];

  const salarie = salaries.find((s) => s.id === periode?.salarieId) || salaries[0];

  // submitEvaluation stores the full form in `donneesFormulaireComplet`.
  const existing: any =
    evaluations.find((e) => e.periodeId === periode?.id)?.donneesFormulaireComplet ?? null;

  const isReadOnly =
    !!existing && (periode?.statut === 'COMPLETEE' || periode?.statut === 'VALIDEE_RH');

  // ---- Form state 
  // 1. Renseignements collaborateur
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [dateIntegration, setDateIntegration] = useState('');
  const [dateEvaluation, setDateEvaluation] = useState(getToday());
  const [poste, setPoste] = useState('');
  const [directionDivision, setDirectionDivision] = useState('');
  const [superieurHierarchique, setSuperieurHierarchique] = useState('');
  const [nomEvaluateur, setNomEvaluateur] = useState('');

  // Evaluation des objectifs
  const [objectifsStatut, setObjectifsStatut] = useState<ObjectifsStatut>(null);
  const [commentairesObjectifs, setCommentairesObjectifs] = useState('');

  // Scores et commentaires
  const [scoresCompetences, setScoresCompetences] = useState<ScoreMap>({});
  const [commentairesCompetences, setCommentairesCompetences] = useState<CommentMap>({});
  const [scoresAptitudes, setScoresAptitudes] = useState<ScoreMap>({});
  const [commentairesAptitudes, setCommentairesAptitudes] = useState<CommentMap>({});
  const [scoresQSE, setScoresQSE] = useState<ScoreMap>({});
  const [commentairesQSE, setCommentairesQSE] = useState<CommentMap>({});

  // Appréciations générales
  const [appreciationGenerale, setAppreciationGenerale] = useState('');
  const [pointsForts, setPointsForts] = useState('');
  const [axesAmelioration, setAxesAmelioration] = useState('');

  // Recommandation
  const [recommandationCommentaire, setRecommandationCommentaire] = useState('');
  const [decisionValidation, setDecisionValidation] = useState<Decision>(null);
  const [dateEffetDecision, setDateEffetDecision] = useState(getToday());

  // Signatures / bilan
  const [dateRealisationBilan, setDateRealisationBilan] = useState(getToday());
  const [signatureEvalue, setSignatureEvalue] = useState('');
  const [signatureEvaluateur, setSignatureEvaluateur] = useState('');
  const [signatureSuperieur, setSignatureSuperieur] = useState('');

  const [soumissionReussie, setSoumissionReussie] = useState(false);

  // ---- Load saved data OR prefill a new form ---------------------------------
  // The form is (re)initialised only when the period changes or when a saved
  // version appears. It is NOT reset on every context update, so typing is safe.
  const loadedKey = useRef<string | null>(null);
  const currentKey = periode ? `${periode.id}-${existing ? 'saved' : 'new'}` : null;

  useEffect(() => {
    if (!periode || !currentKey || loadedKey.current === currentKey) return;
    loadedKey.current = currentKey;

    if (existing) {
      // Reload what was saved
      setNom(existing.nom ?? '');
      setPrenom(existing.prenom ?? '');
      setDateIntegration(existing.dateIntegration ?? '');
      setDateEvaluation(existing.dateEvaluation ?? getToday());
      setPoste(existing.poste ?? '');
      setDirectionDivision(existing.directionDivision ?? '');
      setSuperieurHierarchique(existing.superieurHierarchique ?? '');
      setNomEvaluateur(existing.nomEvaluateur ?? '');
      setObjectifsStatut(existing.objectifsStatut ?? null);
      setCommentairesObjectifs(existing.commentairesObjectifs ?? '');
      setScoresCompetences(existing.scoresCompetences ?? {});
      setCommentairesCompetences(existing.commentairesCompetences ?? {});
      setScoresAptitudes(existing.scoresAptitudes ?? {});
      setCommentairesAptitudes(existing.commentairesAptitudes ?? {});
      setScoresQSE(existing.scoresQSE ?? {});
      setCommentairesQSE(existing.commentairesQSE ?? {});
      setAppreciationGenerale(existing.appreciationGenerale ?? '');
      setPointsForts(existing.pointsForts ?? '');
      setAxesAmelioration(existing.axesAmelioration ?? '');
      setRecommandationCommentaire(existing.recommandationCommentaire ?? '');
      setDecisionValidation(existing.decisionValidation ?? null);
      setDateEffetDecision(existing.dateEffetDecision ?? getToday());
      setDateRealisationBilan(existing.dateRealisationBilan ?? getToday());
      setSignatureEvalue(existing.signatureEvalue ?? '');
      setSignatureEvaluateur(existing.signatureEvaluateur ?? '');
      setSignatureSuperieur(existing.signatureSuperieur ?? '');
    } else {
      // New evaluation: prefill from the employee, empty everything else
      setNom(salarie?.nom || salarie?.lastName || '');
      setPrenom(salarie?.prenom || salarie?.firstName || '');
      setDateIntegration(salarie?.dateIntegration || salarie?.dateEmbauche || '');
      setPoste(salarie?.poste || '');
      setDirectionDivision(salarie?.directionName || '');
      setSuperieurHierarchique(salarie?.responsableNom || '');
      setNomEvaluateur(salarie?.responsableNom || '');
      setDateEvaluation(getToday());
      setObjectifsStatut(null);
      setCommentairesObjectifs('');
      setScoresCompetences({});
      setCommentairesCompetences({});
      setScoresAptitudes({});
      setCommentairesAptitudes({});
      setScoresQSE({});
      setCommentairesQSE({});
      setAppreciationGenerale('');
      setPointsForts('');
      setAxesAmelioration('');
      setRecommandationCommentaire('');
      setDecisionValidation(null);
      setDateEffetDecision(getToday());
      setDateRealisationBilan(getToday());
      setSignatureEvalue('');
      setSignatureEvaluateur('');
      setSignatureSuperieur('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentKey]);

  // ---- Live averages -----------------------------------------------------------
  const allScores = [
    ...Object.values(scoresCompetences),
    ...Object.values(scoresAptitudes),
    ...Object.values(scoresQSE),
  ];
  const moyenneGlobale =
    allScores.length > 0
      ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1)
      : '—';
  const moyenneNum = allScores.length > 0 ? Number(moyenneGlobale) : 0;

  // ---- Handlers -----------------------------------------------------------------
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!periode || isReadOnly) return;

    submitEvaluation({
      periodeId: periode.id,
      competencesTechniques: moyenneNum,
      integrationEquipe: moyenneNum,
      autonomieRigueur: moyenneNum,
      atteinteObjectifs:
        objectifsStatut === 'DEPASSE'
          ? 5
          : objectifsStatut === 'ATTEINT'
            ? 4
            : objectifsStatut === 'PARTIELLEMENT_ATTEINT'
              ? 3
              : 0,
      pointsForts,
      axesAmelioration,
      avisResponsable: appreciationGenerale,
      avisSalarie: commentairesObjectifs,
      recommandation:
        decisionValidation === 'VALIDATION'
          ? 'VALIDATION'
          : decisionValidation === 'RUPTURE'
            ? 'RUPTURE'
            : decisionValidation === 'RENOUVELLEMENT'
              ? 'RENOUVELLEMENT'
              : decisionValidation === 'TITULARISATION'
                ? 'TITULARISATION'
                : 'VALIDATION',
      motifRupture: decisionValidation === 'RUPTURE' ? recommandationCommentaire : undefined,
      signatureResponsable: signatureEvaluateur,
      formulaireComplet: {
        periodeId: periode.id,
        nom,
        prenom,
        dateIntegration,
        dateEvaluation,
        poste,
        directionDivision,
        superieurHierarchique,
        nomEvaluateur,
        objectifsStatut: objectifsStatut || 'ATTEINT',
        commentairesObjectifs,
        scoresCompetences,
        commentairesCompetences,
        scoresAptitudes,
        commentairesAptitudes,
        scoresQSE,
        commentairesQSE,
        appreciationGenerale,
        pointsForts,
        axesAmelioration,
        recommandationCommentaire,
        decisionValidation: decisionValidation || 'VALIDATION',
        dateEffetDecision,
        dateRealisationBilan,
        signatureEvalue,
        signatureEvaluateur,
        signatureSuperieur,
      },
    });

    setSoumissionReussie(true);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // ---- Success screen (only right after submitting) ---------------------------
  if (soumissionReussie) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-[#A30000]/10 text-[#A30000] border-2 border-[#A30000]/20 rounded-full mx-auto flex items-center justify-center shadow-lg">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Évaluation Enregistrée avec Succès !</h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            La Fiche d&apos;Objectifs et d&apos;Évaluation de la Période d&apos;Essai pour{' '}
            <strong>
              {prenom} {nom}
            </strong>{' '}
            a été transmise et archivée dans le système Groupe Premium.
          </p>
        </div>

        <div className="bg-card p-4 rounded-xl border border-border text-xs text-left space-y-1.5 max-w-md mx-auto">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Collaborateur :</span>
            <span className="font-semibold text-foreground">
              {prenom} {nom}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Échéance :</span>
            <span className="font-semibold text-foreground">
              {periode?.typePeriode === 'TROIS_MOIS' || periode?.numeroPeriode === 1
                ? 'Bilan 3 Mois (Intermédiaire)'
                : 'Bilan 6 Mois (Décision finale)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Score calculé :</span>
            <span className="font-bold text-[#A30000]">{moyenneGlobale} / 5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Décision :</span>
            <span className="font-bold text-foreground">
              {decisionValidation === 'VALIDATION'
                ? 'Validation Période d’essai'
                : decisionValidation === 'RUPTURE'
                  ? 'Rupture'
                  : 'À renseigner par les RH'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer / PDF</span>
          </Button>
          <Button
            onClick={() => {
              setSoumissionReussie(false);
              navigateTo('periodes');
            }}
            className="bg-[#A30000] hover:bg-[#850000] text-white flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux évaluations</span>
          </Button>
        </div>
      </div>
    );
  }

  // ---- Main form 
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 font-sans print:max-w-none print:mx-0 print:pb-0 print:space-y-0">
      {/* Action Bar (Top Controls) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-card rounded-2xl border border-border shadow-xs print:hidden">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateTo('periodes')}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Periode</span>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                Fiche Officielle Groupe Premium
              </span>
              <Badge variant="appleRed" className="text-[10px]">
                PS07PR02IN02FO02 v3.0
              </Badge>
              {isReadOnly && (
                <Badge className="text-[10px] flex items-center gap-1 bg-zinc-100 text-zinc-700 border border-zinc-200">
                  <Eye className="w-3 h-3" />
                  Consultation
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Formulaire standardisé d&apos;évaluation de période d&apos;essai
            </p>
          </div>
        </div>

        {/* Period Selector (for HR & Manager) */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">Collaborateur :</span>
          <select
            value={periode?.id}
            onChange={(e) => setSelectedPeriodeId(Number(e.target.value))}
            className="text-xs py-1.5 px-3 bg-secondary border border-border rounded-xl font-medium text-foreground cursor-pointer focus:ring-1 focus:ring-[#A30000]"
          >
            {periodes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.salarieNom} — {p.typePeriode === 'TROIS_MOIS' || p.numeroPeriode === 1 ? '3 Mois' : '6 Mois'}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* Average Badge */}
          <div className="flex items-center gap-1.5 bg-[#A30000]/10 text-[#A30000] border border-[#A30000]/20 px-3 py-1 rounded-xl text-xs font-bold">
            <Award className="w-4 h-4" />
            <span>Moyenne : {moyenneGlobale}/5</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            title="Imprimer ou enregistrer en PDF (exactement comme le document papier)"
            className="flex items-center gap-1.5 rounded-xl border-border bg-card hover:bg-secondary text-xs font-medium cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Imprimer / PDF</span>
          </Button>

          {!isReadOnly && (
            <Button
              size="sm"
              onClick={() => handleSubmit()}
              className="bg-[#A30000] hover:bg-[#850000] text-white flex items-center gap-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Enregistrer</span>
            </Button>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* THE OFFICIAL DOCUMENT PAPER CONTAINER                                 */}
      {/* ===================================================================== */}
      <form
        id="fiche-evaluation-print"
        onSubmit={handleSubmit}
        className="print-document bg-white text-black shadow-lg border border-zinc-400 p-6 md:p-8 space-y-6 print:border-none print:shadow-none print:p-0"
      >
        {/* When read-only, every input inside is disabled */}
        <fieldset disabled={isReadOnly} className="min-w-0 border-0 p-0 m-0 space-y-6">
          {/* Document Header Table */}
          <div className="border border-black grid grid-cols-12 text-center text-xs">
            {/* Logo Box */}
            <div className="col-span-4 p-4 border-r border-black flex flex-col items-center justify-center bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-groupe-premium.png"
                alt="Logo Premium RH"
                width={190}
                height={80}
                className="mx-auto"
              />
            </div>

            {/* Title & Reference Box */}
            <div className="col-span-8 flex flex-col justify-between">
              <div className="p-3 font-bold text-sm md:text-base border-b border-black uppercase text-zinc-800 flex items-center justify-center text-center">
                FICHE D’OBJECTIFS ET D’EVALUATION DE LA PERIODE D’ESSAI
              </div>
              <div className="grid grid-cols-3 text-[11px] font-medium divide-x divide-black py-1.5 bg-zinc-50">
                <div className="px-2">
                  Référence : <span className="font-bold font-mono">PS07PR02IN02FO02</span>
                </div>
                <div className="px-2">
                  Etat : <span className="font-bold">Mise à Jour</span>
                </div>
                <div className="px-2">
                  Version n° : <span className="font-bold font-mono">3.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================= */}
          {/* SECTION 1: Renseignements du collaborateur                    */}
          {/* ============================================================= */}
          <div className="space-y-0 border border-black">
            <div className="bg-[#A30000] text-white font-bold text-center py-1.5 uppercase text-xs tracking-wider">
              Renseignements du collaborateur
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 text-xs divide-y md:divide-y-0 md:divide-x divide-black">
              {/* Left Column */}
              <div className="p-3 space-y-2">
                <div className="flex items-center">
                  <span className="w-36 font-bold">Nom :</span>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="flex-1 border-b border-zinc-400 focus:border-black outline-none px-1 py-0.5 font-semibold text-xs"
                  />
                </div>
                <div className="flex items-center">
                  <span className="w-36 font-bold">Prénom :</span>
                  <input
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className="flex-1 border-b border-zinc-400 focus:border-black outline-none px-1 py-0.5 font-semibold text-xs"
                  />
                </div>
                <div className="flex items-center">
                  <span className="w-36 font-bold">Date d’intégration :</span>
                  <input
                    type="date"
                    value={dateIntegration}
                    onChange={(e) => setDateIntegration(e.target.value)}
                    className="flex-1 border-b border-zinc-400 focus:border-black outline-none px-1 py-0.5 text-xs font-mono"
                  />
                </div>
                <div className="flex items-center">
                  <span className="w-36 font-bold">Date de l’évaluation :</span>
                  <input
                    type="date"
                    value={dateEvaluation}
                    readOnly
                    tabIndex={-1}
                    className="flex-1 border-b border-zinc-400 outline-none px-1 py-0.5 text-xs font-mono bg-zinc-50 cursor-not-allowed pointer-events-none"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="p-3 space-y-2">
                <div className="flex items-center">
                  <span className="w-40 font-bold">Poste :</span>
                  <input
                    type="text"
                    value={poste}
                    onChange={(e) => setPoste(e.target.value)}
                    className="flex-1 border-b border-zinc-400 focus:border-black outline-none px-1 py-0.5 font-semibold text-xs"
                  />
                </div>
                <div className="flex items-center">
                  <span className="w-40 font-bold">Direction/ Division :</span>
                  <input
                    type="text"
                    value={directionDivision}
                    onChange={(e) => setDirectionDivision(e.target.value)}
                    className="flex-1 border-b border-zinc-400 focus:border-black outline-none px-1 py-0.5 text-xs"
                  />
                </div>
                <div className="flex items-center">
                  <span className="w-40 font-bold">Supérieur Hiérarchique :</span>
                  <input
                    type="text"
                    value={superieurHierarchique}
                    onChange={(e) => setSuperieurHierarchique(e.target.value)}
                    className="flex-1 border-b border-zinc-400 focus:border-black outline-none px-1 py-0.5 text-xs font-medium"
                  />
                </div>
                <div className="flex items-center">
                  <span className="w-40 font-bold">Nom de l’évaluateur :</span>
                  <input
                    type="text"
                    value={nomEvaluateur}
                    onChange={(e) => setNomEvaluateur(e.target.value)}
                    className="flex-1 border-b border-zinc-400 focus:border-black outline-none px-1 py-0.5 text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Sub-section: Evaluation des objectifs */}
            <div className="border-t border-black p-3 space-y-3">
              <div className="font-bold underline text-xs">Evaluation des objectifs :</div>

              <div className="flex flex-wrap items-center gap-6 text-xs">
                <span className="font-bold">Objectifs</span>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="objectifs"
                    checked={objectifsStatut === 'DEPASSE'}
                    onChange={() => setObjectifsStatut('DEPASSE')}
                    className="w-4 h-4 appearance-none rounded-full border-2 border-zinc-500 bg-white checked:border-[#A30000] checked:bg-[#A30000] checked:shadow-[inset_0_0_0_3px_#fff] [print-color-adjust:exact] [-webkit-print-color-adjust:exact]"
                  />
                  <span>Dépassés</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="objectifs"
                    checked={objectifsStatut === 'ATTEINT'}
                    onChange={() => setObjectifsStatut('ATTEINT')}
                    className="w-4 h-4 appearance-none rounded-full border-2 border-zinc-500 bg-white checked:border-[#A30000] checked:bg-[#A30000] checked:shadow-[inset_0_0_0_3px_#fff] [print-color-adjust:exact] [-webkit-print-color-adjust:exact]"
                  />
                  <span>Atteints</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="objectifs"
                    checked={objectifsStatut === 'PARTIELLEMENT_ATTEINT'}
                    onChange={() => setObjectifsStatut('PARTIELLEMENT_ATTEINT')}
                    className="w-4 h-4 appearance-none rounded-full border-2 border-zinc-500 bg-white checked:border-[#A30000] checked:bg-[#A30000] checked:shadow-[inset_0_0_0_3px_#fff] [print-color-adjust:exact] [-webkit-print-color-adjust:exact]"
                  />
                  <span>Partiellement atteints</span>
                </label>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold">Commentaires synthétiques sur les objectifs :</div>
                <textarea
                  rows={2}
                  value={commentairesObjectifs}
                  onChange={(e) => setCommentairesObjectifs(e.target.value)}
                  placeholder="Renseignez vos commentaires et réalisations sur les objectifs fixés..."
                  className="w-full text-xs p-2 border border-zinc-300 rounded focus:border-black outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* ============================================================= */}
          {/* SECTION 2: Grille d’évaluation & Légende                      */}
          {/* ============================================================= */}
          <div className="space-y-4">
            <div className="bg-[#A30000] text-white font-bold text-center py-1.5 uppercase text-xs tracking-wider">
              Grille d’évaluation
            </div>

            {/* Légende */}
            <div className="border border-black grid grid-cols-12 text-xs">
              <div className="col-span-3 p-3 font-bold border-r border-black flex items-center bg-zinc-50">
                Légende :
              </div>
              <div className="col-span-9 divide-y divide-black text-[11px]">
                <div className="p-1 px-3">
                  <span className="font-bold">1 :</span> Performance exceptionnelle
                </div>
                <div className="p-1 px-3">
                  <span className="font-bold">2 :</span> Performance supérieure aux besoins du poste
                </div>
                <div className="p-1 px-3">
                  <span className="font-bold">3 :</span> Performance correspondant aux besoins du poste
                </div>
                <div className="p-1 px-3">
                  <span className="font-bold">4 :</span> Performance acceptable nécessitant une amélioration
                </div>
                <div className="p-1 px-3">
                  <span className="font-bold">5 :</span> Performance insuffisante et inférieure aux besoins du poste
                </div>
              </div>
            </div>

            <CriteriaTable
              title="Compétences professionnelles & techniques"
              items={competencesProItems}
              scores={scoresCompetences}
              comments={commentairesCompetences}
              onScore={(id, score) => setScoresCompetences((prev) => ({ ...prev, [id]: score }))}
              onComment={(id, val) => setCommentairesCompetences((prev) => ({ ...prev, [id]: val }))}
              className="pt-2"
            />

            <CriteriaTable
              title="Aptitudes personnelles & comportement professionnel"
              items={aptitudesPersoItems}
              scores={scoresAptitudes}
              comments={commentairesAptitudes}
              onScore={(id, score) => setScoresAptitudes((prev) => ({ ...prev, [id]: score }))}
              onComment={(id, val) => setCommentairesAptitudes((prev) => ({ ...prev, [id]: val }))}
            />

            <CriteriaTable
              title="Bonnes pratiques QSE"
              items={qseItems}
              scores={scoresQSE}
              comments={commentairesQSE}
              onScore={(id, score) => setScoresQSE((prev) => ({ ...prev, [id]: score }))}
              onComment={(id, val) => setCommentairesQSE((prev) => ({ ...prev, [id]: val }))}
            />
          </div>

          {/* ============================================================= */}
          {/* SECTION 3: Appréciations générales des performances           */}
          {/* ============================================================= */}
          <div className="space-y-0 border border-black">
            <div className="bg-[#A30000] text-white font-bold text-center py-1.5 uppercase text-xs tracking-wider">
              Appréciations générales des performances
            </div>

            <div className="p-4 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold block text-zinc-900">
                  Appréciation générale des performances :
                </label>
                <textarea
                  rows={2}
                  value={appreciationGenerale}
                  onChange={(e) => setAppreciationGenerale(e.target.value)}
                  className="w-full p-2 border border-zinc-300 rounded focus:border-black outline-none text-xs leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold block text-zinc-900">Principaux points forts observés :</label>
                <textarea
                  rows={2}
                  value={pointsForts}
                  onChange={(e) => setPointsForts(e.target.value)}
                  className="w-full p-2 border border-zinc-300 rounded focus:border-black outline-none text-xs leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold block text-zinc-900">Axes d’amélioration identifiés :</label>
                <textarea
                  rows={2}
                  value={axesAmelioration}
                  onChange={(e) => setAxesAmelioration(e.target.value)}
                  className="w-full p-2 border border-zinc-300 rounded focus:border-black outline-none text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* ============================================================= */}
          {/* SECTION 4: Recommandation                                     */}
          {/* ============================================================= */}
          <div className="space-y-0 border border-black">
            <div className="bg-[#A30000] text-white font-bold text-center py-1.5 uppercase text-xs tracking-wider">
              Recommandation
            </div>

            <div className="p-3 border-b border-black">
              <textarea
                rows={2}
                value={recommandationCommentaire}
                onChange={(e) => setRecommandationCommentaire(e.target.value)}
                placeholder="Renseignez ici la synthèse et les éléments motivant la recommandation..."
                className="w-full p-2 text-xs border border-zinc-300 rounded focus:border-black outline-none"
              />
            </div>

            <div className="p-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              

                <label className="flex items-center gap-2 cursor-pointer font-bold select-none">
                  <input
                    type="radio"
                    name="decision"
                    checked={decisionValidation === 'RENOUVELLEMENT'}
                    onChange={() => setDecisionValidation('RENOUVELLEMENT')}
                    className="w-4 h-4 appearance-none rounded-full border-2 border-zinc-500 bg-white checked:border-[#A30000] checked:bg-[#A30000] checked:shadow-[inset_0_0_0_3px_#fff] [print-color-adjust:exact] [-webkit-print-color-adjust:exact]"
                  />
                  <span>Renouvellement (Periode 1)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold select-none">
                  <input
                    type="radio"
                    name="decision"
                    checked={decisionValidation === 'TITULARISATION'}
                    onChange={() => setDecisionValidation('TITULARISATION')}
                    className="w-4 h-4 appearance-none rounded-full border-2 border-zinc-500 bg-white checked:border-[#A30000] checked:bg-[#A30000] checked:shadow-[inset_0_0_0_3px_#fff] [print-color-adjust:exact] [-webkit-print-color-adjust:exact]"
                  />
                  <span>Titularisation (Periode 2)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold select-none text-red-700">
                  <input
                    type="radio"
                    name="decision"
                    checked={decisionValidation === 'RUPTURE'}
                    onChange={() => setDecisionValidation('RUPTURE')}
                    className="w-4 h-4 appearance-none rounded-full border-2 border-zinc-500 bg-white checked:border-[#A30000] checked:bg-[#A30000] checked:shadow-[inset_0_0_0_3px_#fff] [print-color-adjust:exact] [-webkit-print-color-adjust:exact]"
                  />
                  <span>Rupture période d’essai</span>
                </label>
              </div>

              {decisionValidation === 'RUPTURE' && (
                <div className="pt-2 border-t border-zinc-200 space-y-1">
                  <label className="font-bold text-red-700 block">
                    Motif de la rupture (facultatif) :
                  </label>
                  <textarea
                    rows={2}
                    value={recommandationCommentaire}
                    onChange={(e) => setRecommandationCommentaire(e.target.value)}
                    placeholder="Précisez ici le motif ou les raisons de la rupture..."
                    className="w-full p-2 text-xs border border-red-300 bg-red-50/30 rounded focus:border-red-600 outline-none"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-zinc-200">
                <div className="flex items-center gap-2">
                  <span className="font-bold shrink-0">Date d’effet :</span>
                  <input
                    type="date"
                    value={dateEffetDecision}
                    onChange={(e) => setDateEffetDecision(e.target.value)}
                    className="border-b border-black px-1 py-0.5 text-xs outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================= */}
          {/* SECTION 5: Validation & Signatures                            */}
          {/* ============================================================= */}
          <div className="space-y-6 pt-2 font-sans">
            <table className="w-full border-collapse text-black" style={{ tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th className="border border-black p-1.5 align-top text-center font-normal">
                    <div className="text-sm font-bold">Validation DCH</div>
                    <div className="text-[11px]">Mme Saida KARDOUSSI</div>
                  </th>
                  <th className="border border-black p-1.5 align-top text-center font-normal">
                    <div className="text-sm font-bold">Evalué</div>
                    <div className="text-[11px]">
                      Nom : {prenom} {nom}
                    </div>
                  </th>
                  <th className="border border-black p-1.5 align-top text-center font-normal">
                    <div className="text-sm font-bold">Evaluateur</div>
                    <div className="text-[11px]">Nom : {nomEvaluateur}</div>
                  </th>
                  <th className="border border-black p-1.5 align-top text-center font-normal">
                    <div className="text-sm font-bold">Supérieur hiérarchique</div>
                    <div className="text-[11px]">Nom : {superieurHierarchique}</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black h-40"></td>
                  <td className="border border-black h-40"></td>
                  <td className="border border-black h-40"></td>
                  <td className="border border-black h-40"></td>
                </tr>
              </tbody>
            </table>

            {/* Date de réalisation du bilan */}
            <div className="flex items-center justify-end gap-2 text-sm pr-2">
              <span>Date de réalisation du bilan :</span>
              <input
                type="date"
                value={dateRealisationBilan}
                readOnly
                tabIndex={-1}
                className="border-b border-dotted border-black px-2 py-0.5 text-sm outline-none font-sans bg-transparent cursor-not-allowed pointer-events-none"
              />
            </div>
          </div>
        </fieldset>

        {/* Bottom bar (outside the fieldset so Print still works in read-only) */}
        <div className="pt-6 border-t border-zinc-300 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="text-xs text-zinc-600">
            Fiche certifiée conforme à la procédure{' '}
            <span className="font-mono font-semibold">PS07PR02IN02FO02</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrint}
              className="flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </Button>

            {!isReadOnly && (
              <Button
                type="submit"
                className="bg-[#A30000] hover:bg-[#850000] text-white flex items-center gap-1.5 cursor-pointer text-xs font-semibold"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Enregistrer & Soumettre l’Évaluation</span>
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}