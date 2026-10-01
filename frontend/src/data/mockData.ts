import { 
  Direction, 
  Responsable, 
  Salarie, 
  PeriodeEvaluation, 
  EvaluationDetail, 
  HistoriqueEmail, 
  NotificationItem,
  User 
} from '../types';

export const initialUsers: User[] = [
  {
    id: 1,
    email: "rh@groupe-premium.com",
    role: "ADMIN_RH",
    nom: "Benali",
    prenom: "Imane"
  },
  {
    id: 2,
    email: "marc.delattre@groupe-premium.com",
    role: "RESPONSABLE",
    nom: "Delattre",
    prenom: "Marc",
    responsableId: 1
  },
  {
    id: 3,
    email: "claire.vaneau@groupe-premium.com",
    role: "RESPONSABLE",
    nom: "Vaneau",
    prenom: "Claire",
    responsableId: 2
  },
  {
    id: 4,
    email: "alexandre.renoir@groupe-premium.com",
    role: "RESPONSABLE",
    nom: "Renoir",
    prenom: "Alexandre",
    responsableId: 3
  }
];

export const initialDirections: Direction[] = [
  { id: 1, name: "Gestion de Patrimoine & Conseil Privé", code: "GPCP", description: "Conseil en investissement et gestion de fortune" },
  { id: 2, name: "Asset Management & Produits", code: "AMP", description: "Structuration et distribution de fonds d'investissement" },
  { id: 3, name: "Direction Financière & Risques", code: "DFR", description: "Audit, comptabilité, gestion financière et conformité" },
  { id: 4, name: "Réseau Commercial & Partenariats", code: "RCP", description: "Développement du réseau de conseillers indépendants" },
  { id: 5, name: "Systèmes d'Information & Digital (DSI)", code: "DSI", description: "Infrastructures cloud, data, sécurité et logiciels internes" },
  { id: 6, name: "Ressources Humaines & Talents", code: "DRH", description: "Recrutement, développement RH, gestion des compétences" }
];

export const initialResponsables: Responsable[] = [];

export const initialSalaries: Salarie[] = [];

export const initialPeriodes: PeriodeEvaluation[] = [];

export const initialEvaluations: EvaluationDetail[] = [];

export const initialEmails: HistoriqueEmail[] = [];

export const initialNotifications: NotificationItem[] = [];
