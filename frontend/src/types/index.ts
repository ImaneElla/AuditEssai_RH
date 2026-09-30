export type UserRole = 'ADMIN_RH' | 'RESPONSABLE';

export interface User {
  id: number;
  email: string;
  password?: string;
  role: 'ADMIN_RH' | 'RESPONSABLE';
  nom: string;
  prenom: string;
  responsableId?: number; // Si role == RESPONSABLE, lié à l'id du responsable
}

export interface Direction {
  id: number;
  name: string;
  code: string;
  description: string;
}

export interface Responsable {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  directionId: number;
  directionName: string;
  poste: string;
  photoUrl?: string;
}

export type StatutEssai = 'EN_COURS' | 'RENOUVELEE' | 'CONFIRMEE' | 'RUPTURE';
export type JalonType = 'DEUX_MOIS' | 'CINQ_MOIS' | 'TERMINE';

export interface Salarie {
  divisionName: string | undefined;
  divisionName: ReactNode;
  id: number;
  matricule?: string;
  nom?: string;
  prenom?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  poste: string;
  dateIntegration?: string; // YYYY-MM-DD
  dateEmbauche: string; // YYYY-MM-DD
  dureeInitialeMois: number; // e.g. 4 mois pour cadre (renouvelable)
  dateFinPrevisionnelle: string;
  directionId: number;
  directionName: string;
  responsableId: number;
  responsableNom: string;
  statutEssai: StatutEssai;
  jalonActuel: JalonType;
  photoUrl?: string;
}

export type StatutPeriode = 
  | 'PLANIFIEE' 
  | 'EMAIL_ENVOYE' 
  | 'EN_ATTENTE' 
  | 'EN_RETARD' 
  | 'COMPLETEE' 
  | 'VALIDEE_RH';

export type DecisionPeriode = 'CONFIRMATION' | 'RENOUVELLEMENT' | 'RUPTURE' | 'EN_ATTENTE';

export interface PeriodeEvaluation {
  id: number;
  salarieId: number;
  salarieNom: string;
  salarieEmail: string;
  salariePoste: string;
  responsableId: number;
  responsableNom: string;
  responsableEmail: string;
  directionName: string;
  typePeriode: 'DEUX_MOIS' | 'CINQ_MOIS';
  dateEcheance: string; // Date cible
  dateDeclenchementEmail: string; // Envoyé à 09:00
  heureDeclenchement: string;
  dateDernierRappel?: string;
  statut: StatutPeriode;
  joursRetard?: number; // Calculé si statut == EN_RETARD (> 2 jours)
  noteGlobale?: number; // Sur 5
  decisionFinale?: DecisionPeriode;
  motifDecision?: string;
  dateValidationRH?: string;
  tokenAccesSalarie?: string; // Jeton d'accès sécurisé pour le salarié sans compte
}

// Structure complète calquée fidèlement sur la Fiche Officielle Groupe Premium (PS07PR02IN02FO02 - v3.0)
export interface FormulaireEvaluationData {
  periodeId: number;
  // 1. Renseignements du collaborateur
  nom: string;
  prenom: string;
  dateIntegration: string;
  dateEvaluation: string;
  poste: string;
  directionDivision: string;
  superieurHierarchique: string;
  nomEvaluateur: string;

  // Evaluation des objectifs
  objectifsStatut: 'DEPASSE' | 'ATTEINT' | 'PARTIELLEMENT_ATTEINT';
  commentairesObjectifs: string;

  // Grille d'évaluation (1 à 5 + commentaire par critère)
  // 1. Compétences professionnelles & techniques (10 critères)
  scoresCompetences: { [critereId: string]: number };
  commentairesCompetences: { [critereId: string]: string };

  // 2. Aptitudes personnelles & comportement professionnel (11 critères)
  scoresAptitudes: { [critereId: string]: number };
  commentairesAptitudes: { [critereId: string]: string };

  // 3. Bonnes pratiques QSE (3 critères)
  scoresQSE: { [critereId: string]: number };
  commentairesQSE: { [critereId: string]: string };

  // Appréciations générales des performances
  appreciationGenerale: string;
  pointsForts: string;
  axesAmelioration: string;

  // Recommandation
  recommandationCommentaire: string;
  decisionValidation: 'VALIDATION' | 'RUPTURE';
  dateEffetDecision: string;

  // Signatures
  dateRealisationBilan: string;
  validationDCH: boolean;
  signatureEvalue: string;
  signatureEvaluateur: string;
  signatureSuperieur: string;
}

export interface EvaluationDetail {
  id: number;
  periodeId: number;
  competencesTechniques: number; // 1 à 5
  integrationEquipe: number; // 1 à 5
  autonomieRigueur: number; // 1 à 5
  atteinteObjectifs: number; // 1 à 5
  pointsForts: string;
  axesAmelioration: string;
  avisResponsable: string;
  avisSalarie?: string;
  recommandation: 'CONFIRMATION' | 'RENOUVELLEMENT' | 'RUPTURE';
  dateEvaluation: string;
  signatureResponsable: string;
  signatureSalarie?: string;
  donneesFormulaireComplet?: FormulaireEvaluationData;
}

export type TypeEmail = 
  | 'CONVOCATION_2M' 
  | 'CONVOCATION_5M' 
  | 'RAPPEL_RETARD_J2' 
  | 'ALERTE_CRITIQUE_J5' 
  | 'CONFIRMATION_RH';

export interface HistoriqueEmail {
  id: number;
  salarieId: number;
  salarieNom: string;
  destinataire: string;
  destinataireNom: string;
  roleDestinataire: 'RESPONSABLE' | 'SALARIE' | 'RH';
  objet: string;
  typeEmail: TypeEmail;
  dateEnvoi: string; // YYYY-MM-DD
  heureEnvoi: string; // HH:mm:ss
  statut: 'DELIVRE' | 'OUVERT';
  batchCron: boolean; // True si envoyé par le déclencheur auto de 09:00
  contenuCorps: string;
  lienSecurise?: string; // Lien avec token pour le salarié
}

export interface NotificationItem {
  id: number;
  titre: string;
  message: string;
  type: 'RETARD' | 'EVALUATION' | 'CRON_SYSTEME' | 'VALIDATION';
  priorite: 'BASSE' | 'MOYENNE' | 'HAUTE' | 'URGENTE';
  dateCreation: string;
  heureCreation: string;
  estLue: boolean;
  cibleRole: 'ADMIN_RH' | 'RESPONSABLE' | 'TOUS';
  lienEcran?: string;
  targetId?: number;
}
