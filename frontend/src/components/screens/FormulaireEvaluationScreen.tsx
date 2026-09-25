"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Printer, 
  CheckCircle2, 
  ArrowLeft, 
  Check, 
  User as UserIcon,
  ShieldCheck,
  FileCheck,
  Award,
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CriterionItem {
  id: string;
  label: string;
}

const competencesProItems: CriterionItem[] = [
  { id: 'cp1', label: 'Compréhension du poste, des missions et du périmètre' },
  { id: 'cp2', label: 'Qualité du travail rendu' },
  { id: 'cp3', label: 'Respect des délais et rythme d’exécution' },
  { id: 'cp4', label: 'Capacité d’analyse et de résolution des problèmes' },
  { id: 'cp5', label: 'Prise en main des outils et méthodes de travail' },
  { id: 'cp6', label: 'Application des procédures et consignes internes' },
  { id: 'cp7', label: 'Organisation et gestion des priorités' },
  { id: 'cp8', label: 'Fiabilité des informations transmises' },
  { id: 'cp9', label: 'Capacité à proposer des améliorations' },
  { id: 'cp10', label: 'Adaptation aux exigences du poste' },
];

const aptitudesPersoItems: CriterionItem[] = [
  { id: 'ap1', label: 'Adaptation à l’environnement de travail' },
  { id: 'ap2', label: 'Implication et engagement dans le travail' },
  { id: 'ap3', label: 'Sens du service et orientation client' },
  { id: 'ap4', label: 'Réactivité et prise d’initiative' },
  { id: 'ap5', label: 'Autonomie progressive' },
  { id: 'ap6', label: 'Ponctualité et assiduité' },
  { id: 'ap7', label: 'Conscience professionnelle' },
  { id: 'ap8', label: 'Maîtrise de soi et posture professionnelle' },
  { id: 'ap9', label: 'Esprit d’équipe et collaboration' },
  { id: 'ap10', label: 'Qualité de la communication' },
  { id: 'ap11', label: 'Respect de la hiérarchie et du cadre' },
];

const qseItems: CriterionItem[] = [
  { id: 'qse1', label: 'Connaissance des règles et procédures QSE' },
  { id: 'qse2', label: 'Respect des consignes de sécurité' },
  { id: 'qse3', label: 'Respect de l’environnement et du matériel' },
];

export default function FormulaireEvaluationScreen() {
  const { 
    selectedPeriodeId, 
    periodes, 
    salaries, 
    submitEvaluation, 
    navigateTo, 
    currentRole,
    setSelectedPeriodeId
  } = useApp();

  // Find target period
  const periode = periodes.find(p => p.id === selectedPeriodeId) 
    || periodes.find(p => p.statut !== 'VALIDEE_RH') 
    || periodes[0];

  const salarie = salaries.find(s => s.id === periode?.salarieId) || salaries[0];

  // 1. Renseignements collaborateur
  const [nom, setNom] = useState(salarie?.nom || salarie?.lastName || 'Bernard');
  const [prenom, setPrenom] = useState(salarie?.prenom || salarie?.firstName || 'Thomas');
  const [dateIntegration, setDateIntegration] = useState(salarie?.dateIntegration || salarie?.dateEmbauche || '2026-07-15');
  const [dateEvaluation, setDateEvaluation] = useState('2026-09-24');
  const [poste, setPoste] = useState(salarie?.poste || 'Consultant en Gestion de Patrimoine');
  const [directionDivision, setDirectionDivision] = useState(salarie?.directionName || 'Gestion de Patrimoine & Conseil Privé');
  const [superieurHierarchique, setSuperieurHierarchique] = useState(salarie?.responsableNom || 'Marc Delattre');
  const [nomEvaluateur, setNomEvaluateur] = useState(salarie?.responsableNom || 'Marc Delattre');

  // Evaluation des objectifs
  const [objectifsStatut, setObjectifsStatut] = useState<'DEPASSE' | 'ATTEINT' | 'PARTIELLEMENT_ATTEINT'>('ATTEINT');
  const [commentairesObjectifs, setCommentairesObjectifs] = useState(
    'Objectifs commerciaux et prise en main du portefeuille de clients patrimoniaux atteints conformément aux jalons fixés.'
  );

  // Scores et commentaires par critère (1 à 5)
  const [scoresCompetences, setScoresCompetences] = useState<{ [id: string]: number }>({
    cp1: 4, cp2: 4, cp3: 4, cp4: 4, cp5: 4, cp6: 3, cp7: 4, cp8: 4, cp9: 3, cp10: 4
  });
  const [commentairesCompetences, setCommentairesCompetences] = useState<{ [id: string]: string }>({});

  const [scoresAptitudes, setScoresAptitudes] = useState<{ [id: string]: number }>({
    ap1: 4, ap2: 5, ap3: 4, ap4: 4, ap5: 3, ap6: 5, ap7: 4, ap8: 4, ap9: 4, ap10: 4, ap11: 4
  });
  const [commentairesAptitudes, setCommentairesAptitudes] = useState<{ [id: string]: string }>({});

  const [scoresQSE, setScoresQSE] = useState<{ [id: string]: number }>({
    qse1: 4, qse2: 4, qse3: 4
  });
  const [commentairesQSE, setCommentairesQSE] = useState<{ [id: string]: string }>({});

  // Appréciations générales
  const [appreciationGenerale, setAppreciationGenerale] = useState(
    'Très bonne intégration au sein de l’équipe. Le collaborateur démontre une forte motivation et un bon sens relationnel.'
  );
  const [pointsForts, setPointsForts] = useState(
    'Rigueur dans le suivi client, excellente ponctualité, esprit d’équipe très apprécié et adaptabilité rapide.'
  );
  const [axesAmelioration, setAxesAmelioration] = useState(
    'Gagner en rapidité sur les outils internes de simulation patrimoniale et approfondir les montages fiscaux complexes.'
  );

  // Recommandation
  const [recommandationCommentaire, setRecommandationCommentaire] = useState(
    'Avis très favorable pour la confirmation définitive des missions confiées.'
  );
  const [decisionValidation, setDecisionValidation] = useState<'VALIDATION' | 'RUPTURE'>('VALIDATION');
  const [dateEffetDecision, setDateEffetDecision] = useState('2026-11-15');

  // Signatures
  const [dateRealisationBilan, setDateRealisationBilan] = useState('2026-09-24');
  const [validationDCH, setValidationDCH] = useState(true);
  const [signatureEvalue, setSignatureEvalue] = useState(`${prenom} ${nom}`);
  const [signatureEvaluateur, setSignatureEvaluateur] = useState(nomEvaluateur);
  const [signatureSuperieur, setSignatureSuperieur] = useState(superieurHierarchique);

  const [soumissionReussie, setSoumissionReussie] = useState(false);

  // Sync state when selected periode changes
  useEffect(() => {
    if (salarie) {
      setNom(salarie.nom || salarie.lastName);
      setPrenom(salarie.prenom || salarie.firstName);
      setDateIntegration(salarie.dateIntegration || salarie.dateEmbauche);
      setPoste(salarie.poste);
      setDirectionDivision(salarie.directionName);
      setSuperieurHierarchique(salarie.responsableNom);
      setNomEvaluateur(salarie.responsableNom);
      setSignatureEvalue(`${salarie.prenom || salarie.firstName} ${salarie.nom || salarie.lastName}`);
      setSignatureEvaluateur(salarie.responsableNom);
      setSignatureSuperieur(salarie.responsableNom);
    }
  }, [salarie]);

  // Compute live averages
  const allScores = [
    ...Object.values(scoresCompetences),
    ...Object.values(scoresAptitudes),
    ...Object.values(scoresQSE)
  ];
  const moyenneGlobale = allScores.length > 0 
    ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1) 
    : '4.0';

  const handleScoreChange = (type: 'comp' | 'apt' | 'qse', id: string, score: number) => {
    if (type === 'comp') setScoresCompetences(prev => ({ ...prev, [id]: score }));
    if (type === 'apt') setScoresAptitudes(prev => ({ ...prev, [id]: score }));
    if (type === 'qse') setScoresQSE(prev => ({ ...prev, [id]: score }));
  };

  const handleCommentChange = (type: 'comp' | 'apt' | 'qse', id: string, val: string) => {
    if (type === 'comp') setCommentairesCompetences(prev => ({ ...prev, [id]: val }));
    if (type === 'apt') setCommentairesAptitudes(prev => ({ ...prev, [id]: val }));
    if (type === 'qse') setCommentairesQSE(prev => ({ ...prev, [id]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!periode) return;

    submitEvaluation({
      periodeId: periode.id,
      competencesTechniques: Number(moyenneGlobale),
      integrationEquipe: Number(moyenneGlobale),
      autonomieRigueur: Number(moyenneGlobale),
      atteinteObjectifs: objectifsStatut === 'DEPASSE' ? 5 : objectifsStatut === 'ATTEINT' ? 4 : 3,
      pointsForts,
      axesAmelioration,
      avisResponsable: appreciationGenerale,
      avisSalarie: commentairesObjectifs,
      recommandation: decisionValidation === 'VALIDATION' ? 'CONFIRMATION' : 'RUPTURE',
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
        objectifsStatut,
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
        decisionValidation,
        dateEffetDecision,
        dateRealisationBilan,
        validationDCH,
        signatureEvalue,
        signatureEvaluateur,
        signatureSuperieur
      }
    });

    setSoumissionReussie(true);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (soumissionReussie) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-[#A30000]/10 text-[#A30000] border-2 border-[#A30000]/20 rounded-full mx-auto flex items-center justify-center shadow-lg">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Évaluation Enregistrée avec Succès !</h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            La Fiche d&apos;Objectifs et d&apos;Évaluation de la Période d&apos;Essai pour <strong>{prenom} {nom}</strong> a été transmise et archivée dans le système Groupe Premium.
          </p>
        </div>

        <div className="bg-card p-4 rounded-xl border border-border text-xs text-left space-y-1.5 max-w-md mx-auto">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Collaborateur :</span>
            <span className="font-semibold text-foreground">{prenom} {nom}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Échéance :</span>
            <span className="font-semibold text-foreground">{periode?.typePeriode === 'DEUX_MOIS' ? 'Bilan 2 Mois' : 'Bilan 5 Mois'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Score calculé :</span>
            <span className="font-bold text-[#A30000]">{moyenneGlobale} / 5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Décision :</span>
            <span className="font-bold text-foreground">{decisionValidation === 'VALIDATION' ? 'Validation Période d’essai' : 'Rupture'}</span>
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
            <span>Jalons</span>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                Fiche Officielle Groupe Premium
              </span>
              <Badge variant="appleRed" className="text-[10px]">
                PS07PR02IN02FO02 v3.0
              </Badge>
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
            {periodes.map(p => (
              <option key={p.id} value={p.id}>
                {p.salarieNom} — {p.typePeriode === 'DEUX_MOIS' ? '2 Mois' : '5 Mois'}
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

          <Button
            size="sm"
            onClick={handleSubmit}
            className="bg-[#A30000] hover:bg-[#850000] text-white flex items-center gap-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Enregistrer</span>
          </Button>
        </div>
      </div>


      {/* ========================================================================= */}
      {/* THE OFFICIAL DOCUMENT PAPER CONTAINER                     */}
      {/* ========================================================================= */}
      <form
        id="fiche-evaluation-print"
        onSubmit={handleSubmit}
        className="print-document bg-white text-black shadow-lg border border-zinc-400 p-6 md:p-8 space-y-6 print:border-none print:shadow-none print:p-0"
      >
        
        {/* Document Header Table */}
        <div className="border border-black grid grid-cols-12 text-center text-xs">
          {/* Logo Box */}
          <div className="col-span-4 p-4 border-r border-black flex flex-col items-center justify-center bg-white">
            <div className="tracking-[0.25em] text-[10px] text-zinc-600 font-semibold uppercase">
              <img src="/logo-groupe-premium.png" alt="Logo Premium RH" width={190} height={80} className="mx-auto" /> 
            </div>
            <div className="text-xl font-black text-zinc-900 tracking-wider">
           
            </div>
          </div>

          {/* Title & Reference Box */}
          <div className="col-span-8 flex flex-col justify-between">
            <div className="p-3 font-bold text-sm md:text-base border-b border-black uppercase text-zinc-800 flex items-center justify-center text-center">
              FICHE D’OBJECTIFS ET D’EVALUATION DE LA PERIODE D’ESSAI
            </div>
            <div className="grid grid-cols-3 text-[11px] font-medium divide-x divide-black py-1.5 bg-zinc-50">
              <div className="px-2">Référence : <span className="font-bold font-mono">PS07PR02IN02FO02</span></div>
              <div className="px-2">Etat : <span className="font-bold">Mise à Jour</span></div>
              <div className="px-2">Version n° : <span className="font-bold font-mono">3.0</span></div>
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* SECTION 1: Renseignements du collaborateur                    */}
        {/* ============================================================== */}
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
                  onChange={(e) => setDateEvaluation(e.target.value)} 
                  className="flex-1 border-b border-zinc-400 focus:border-black outline-none px-1 py-0.5 text-xs font-mono"
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
                  className="w-4 h-4 accent-[#A30000]"
                />
                <span>Dépassés</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="radio" 
                  name="objectifs" 
                  checked={objectifsStatut === 'ATTEINT'}
                  onChange={() => setObjectifsStatut('ATTEINT')}
                  className="w-4 h-4 accent-[#A30000]"
                />
                <span>Atteints</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="radio" 
                  name="objectifs" 
                  checked={objectifsStatut === 'PARTIELLEMENT_ATTEINT'}
                  onChange={() => setObjectifsStatut('PARTIELLEMENT_ATTEINT')}
                  className="w-4 h-4 accent-[#A30000]"
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

        {/* ------------------------------------------------------------- */}
        {/* SECTION 2: Grille d’évaluation & Légende                     */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-4">
          <div className="bg-[#A30000] text-white font-bold text-center py-1.5 uppercase text-xs tracking-wider">
            Grille d’évaluation
          </div>

          {/* Légende Box (Exact copy from Image 1) */}
          <div className="border border-black grid grid-cols-12 text-xs">
            <div className="col-span-3 p-3 font-bold border-r border-black flex items-center bg-zinc-50">
              Légende :
            </div>
            <div className="col-span-9 divide-y divide-black text-[11px]">
              <div className="p-1 px-3"><span className="font-bold">1 :</span> Performance exceptionnelle</div>
              <div className="p-1 px-3"><span className="font-bold">2 :</span> Performance supérieure aux besoins du poste</div>
              <div className="p-1 px-3"><span className="font-bold">3 :</span> Performance correspondant aux besoins du poste</div>
              <div className="p-1 px-3"><span className="font-bold">4 :</span> Performance acceptable nécessitant une amélioration</div>
              <div className="p-1 px-3"><span className="font-bold">5 :</span> Performance insuffisante et inférieure aux besoins du poste</div>
            </div>
          </div>

          {/* Category 1: Compétences professionnelles & techniques */}
          <div className="space-y-2 pt-2">
            <h3 className="font-bold text-xs uppercase tracking-wide text-zinc-900">
              Compétences professionnelles & techniques
            </h3>

            <div className="border border-black overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-100 border-b border-black text-center font-bold">
                    <th className="p-2 border-r border-black w-5/12 text-left">Critères</th>
                    <th className="p-2 border-r border-black w-3/12">Évaluation (1 à 5)</th>
                    <th className="p-2 w-4/12 text-left">Commentaires</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black">
                  {competencesProItems.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/50">
                      <td className="p-2 border-r border-black font-medium leading-tight">
                        {item.label}
                      </td>
                      <td className="p-2 border-r border-black text-center">
                        <div className="flex items-center justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((score) => (
                            <label key={score} className="flex items-center gap-0.5 cursor-pointer text-[11px]">
                              <input
                                type="radio"
                                name={`score-${item.id}`}
                                value={score}
                                checked={scoresCompetences[item.id] === score}
                                onChange={() => handleScoreChange('comp', item.id, score)}
                                className="w-3.5 h-3.5 accent-[#A30000]"
                              />
                              <span className="font-bold">{score}</span>
                            </label>
                          ))}
                        </div>
                      </td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={commentairesCompetences[item.id] || ''}
                          onChange={(e) => handleCommentChange('comp', item.id, e.target.value)}
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

          {/* Category 2: Aptitudes personnelles & comportement professionnel */}
          <div className="space-y-2 pt-4">
            <h3 className="font-bold text-xs uppercase tracking-wide text-zinc-900">
              Aptitudes personnelles & comportement professionnel
            </h3>

            <div className="border border-black overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-100 border-b border-black text-center font-bold">
                    <th className="p-2 border-r border-black w-5/12 text-left">Critères</th>
                    <th className="p-2 border-r border-black w-3/12">Évaluation (1 à 5)</th>
                    <th className="p-2 w-4/12 text-left">Commentaires</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black">
                  {aptitudesPersoItems.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/50">
                      <td className="p-2 border-r border-black font-medium leading-tight">
                        {item.label}
                      </td>
                      <td className="p-2 border-r border-black text-center">
                        <div className="flex items-center justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((score) => (
                            <label key={score} className="flex items-center gap-0.5 cursor-pointer text-[11px]">
                              <input
                                type="radio"
                                name={`score-${item.id}`}
                                value={score}
                                checked={scoresAptitudes[item.id] === score}
                                onChange={() => handleScoreChange('apt', item.id, score)}
                                className="w-3.5 h-3.5 accent-[#A30000]"
                              />
                              <span className="font-bold">{score}</span>
                            </label>
                          ))}
                        </div>
                      </td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={commentairesAptitudes[item.id] || ''}
                          onChange={(e) => handleCommentChange('apt', item.id, e.target.value)}
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

          {/* Category 3: Bonnes pratiques QSE */}
          <div className="space-y-2 pt-4">
            <h3 className="font-bold text-xs uppercase tracking-wide text-zinc-900">
              Bonnes pratiques QSE
            </h3>

            <div className="border border-black overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-100 border-b border-black text-center font-bold">
                    <th className="p-2 border-r border-black w-5/12 text-left">Critères</th>
                    <th className="p-2 border-r border-black w-3/12">Évaluation (1 à 5)</th>
                    <th className="p-2 w-4/12 text-left">Commentaires</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black">
                  {qseItems.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/50">
                      <td className="p-2 border-r border-black font-medium leading-tight">
                        {item.label}
                      </td>
                      <td className="p-2 border-r border-black text-center">
                        <div className="flex items-center justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((score) => (
                            <label key={score} className="flex items-center gap-0.5 cursor-pointer text-[11px]">
                              <input
                                type="radio"
                                name={`score-${item.id}`}
                                value={score}
                                checked={scoresQSE[item.id] === score}
                                onChange={() => handleScoreChange('qse', item.id, score)}
                                className="w-3.5 h-3.5 accent-[#A30000]"
                              />
                              <span className="font-bold">{score}</span>
                            </label>
                          ))}
                        </div>
                      </td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={commentairesQSE[item.id] || ''}
                          onChange={(e) => handleCommentChange('qse', item.id, e.target.value)}
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
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 3: Appréciations générales des performances (Image 3) */}
        {/* ------------------------------------------------------------- */}
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
              <label className="font-bold block text-zinc-900">
                Principaux points forts observés :
              </label>
              <textarea
                rows={2}
                value={pointsForts}
                onChange={(e) => setPointsForts(e.target.value)}
                className="w-full p-2 border border-zinc-300 rounded focus:border-black outline-none text-xs leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold block text-zinc-900">
                Axes d’amélioration identifiés :
              </label>
              <textarea
                rows={2}
                value={axesAmelioration}
                onChange={(e) => setAxesAmelioration(e.target.value)}
                className="w-full p-2 border border-zinc-300 rounded focus:border-black outline-none text-xs leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 4: Recommandation (Image 3)                          */}
        {/* ------------------------------------------------------------- */}
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

          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs items-center">
            <label className="flex items-center gap-2 cursor-pointer font-bold select-none">
              <input
                type="radio"
                name="decision"
                checked={decisionValidation === 'VALIDATION'}
                onChange={() => setDecisionValidation('VALIDATION')}
                className="w-4 h-4 accent-[#A30000]"
              />
              <span>Validation période d’essai</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold select-none">
              <input
                type="radio"
                name="decision"
                checked={decisionValidation === 'RUPTURE'}
                onChange={() => setDecisionValidation('RUPTURE')}
                className="w-4 h-4 accent-[#A30000]"
              />
              <span>Rupture période d’essai</span>
            </label>

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

        {/* ------------------------------------------------------------- */}
        {/* SECTION 5: Validation & Signatures (Image 2)                  */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-4 pt-2">
          <div className="border border-black grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-black text-center text-xs">
            {/* Box 1: Validation DCH */}
            <div className="p-3 flex flex-col justify-between h-36">
              <div>
                <div className="font-bold">Validation DCH</div>
                <div className="text-[11px] text-zinc-700">Mme Saida KARDOUSSI</div>
              </div>
              <div className="py-2 border border-dashed border-zinc-400 rounded bg-zinc-50/50 flex flex-col items-center justify-center">
                <span className="text-[10px] text-emerald-700 font-bold uppercase flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Visa DRH Validé
                </span>
                <span className="text-[9px] text-zinc-500 font-mono">GROUPE PREMIUM DCH</span>
              </div>
            </div>

            {/* Box 2: Évalué */}
            <div className="p-3 flex flex-col justify-between h-36">
              <div>
                <div className="font-bold">Evalué</div>
                <div className="text-[11px] text-zinc-700">Nom : {prenom} {nom}</div>
              </div>
              <div className="py-2 border border-dashed border-zinc-400 rounded bg-zinc-50/50 flex flex-col items-center justify-center">
                <span className="text-[10px] font-serif italic text-zinc-800 font-bold">
                  {signatureEvalue || `${prenom} ${nom}`}
                </span>
                <span className="text-[9px] text-zinc-400">Signature Collaborateur</span>
              </div>
            </div>

            {/* Box 3: Évaluateur */}
            <div className="p-3 flex flex-col justify-between h-36">
              <div>
                <div className="font-bold">Evaluateur</div>
                <div className="text-[11px] text-zinc-700">Nom : {nomEvaluateur}</div>
              </div>
              <div className="py-2 border border-dashed border-zinc-400 rounded bg-zinc-50/50 flex flex-col items-center justify-center">
                <span className="text-[10px] font-serif italic text-zinc-800 font-bold">
                  {signatureEvaluateur}
                </span>
                <span className="text-[9px] text-zinc-400">Signature Évaluateur N+1</span>
              </div>
            </div>

            {/* Box 4: Supérieur Hiérarchique */}
            <div className="p-3 flex flex-col justify-between h-36">
              <div>
                <div className="font-bold">Supérieur hiérarchique</div>
                <div className="text-[11px] text-zinc-700">Nom : {superieurHierarchique}</div>
              </div>
              <div className="py-2 border border-dashed border-zinc-400 rounded bg-zinc-50/50 flex flex-col items-center justify-center">
                <span className="text-[10px] font-serif italic text-zinc-800 font-bold">
                  {signatureSuperieur}
                </span>
                <span className="text-[9px] text-zinc-400">Visa Direction</span>
              </div>
            </div>
          </div>

          {/* Date de réalisation du bilan */}
          <div className="flex items-center gap-3 text-xs pt-1">
            <span className="font-bold">Date de réalisation du bilan :</span>
            <input
              type="date"
              value={dateRealisationBilan}
              onChange={(e) => setDateRealisationBilan(e.target.value)}
              className="border-b border-black px-2 py-0.5 text-xs outline-none font-mono"
            />
          </div>
        </div>

        {/* Form Bottom Submit / Save Buttons */}
        <div className="pt-6 border-t border-zinc-300 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="text-xs text-zinc-600">
            Fiche certifiée conforme à la procédure <span className="font-mono font-semibold">PS07PR02IN02FO02</span>
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

            <Button
              type="submit"
              className="bg-[#A30000] hover:bg-[#850000] text-white flex items-center gap-1.5 cursor-pointer text-xs font-semibold"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Enregistrer & Soumettre l’Évaluation</span>
            </Button>
          </div>
        </div>

      </form>
    </div>
  );
}
