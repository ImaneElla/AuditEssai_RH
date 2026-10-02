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
    email: "youssef.elamrani@groupe-premium.com",
    role: "RESPONSABLE",
    nom: "El Amrani",
    prenom: "Youssef",
    responsableId: 1
  },
  {
    id: 3,
    email: "salma.benjelloun@groupe-premium.com",
    role: "RESPONSABLE",
    nom: "Benjelloun",
    prenom: "Salma",
    responsableId: 2
  },
  {
    id: 4,
    email: "karim.tazi@groupe-premium.com",
    role: "RESPONSABLE",
    nom: "Tazi",
    prenom: "Karim",
    responsableId: 3
  },
  {
    id: 5,
    email: "houda.chraibi@groupe-premium.com",
    role: "RESPONSABLE",
    nom: "Chraibi",
    prenom: "Houda",
    responsableId: 4
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

export const initialResponsables: Responsable[] = [
  {
    id: 1,
    firstName: "Youssef",
    lastName: "El Amrani",
    email: "youssef.elamrani@groupe-premium.com",
    phone: "+212 6 61 23 45 67",
    directionId: 1,
    directionName: "Gestion de Patrimoine & Conseil Privé",
    poste: "Directeur de Clientèle Privée"
  },
  {
    id: 2,
    firstName: "Salma",
    lastName: "Benjelloun",
    email: "salma.benjelloun@groupe-premium.com",
    phone: "+212 6 62 34 56 78",
    directionId: 2,
    directionName: "Asset Management & Produits",
    poste: "Responsable Structuration & Fonds"
  },
  {
    id: 3,
    firstName: "Karim",
    lastName: "Tazi",
    email: "karim.tazi@groupe-premium.com",
    phone: "+212 6 63 45 67 89",
    directionId: 4,
    directionName: "Réseau Commercial & Partenariats",
    poste: "Directeur Régional Partenariats"
  },
  {
    id: 4,
    firstName: "Houda",
    lastName: "Chraibi",
    email: "houda.chraibi@groupe-premium.com",
    phone: "+212 6 64 56 78 90",
    directionId: 3,
    directionName: "Direction Financière & Risques",
    poste: "Directrice Audit & Conformité"
  }
];

export const initialSalaries: Salarie[] = [
  {
    id: 1,
    matricule: "GP-2026-001",
    firstName: "Imane",
    lastName: "Ellaouzi",
    email: "imaneellaouzi.05@gmail.com",
    phone: "+212 6 71 12 34 56",
    poste: "Full Stack Developer",
    dateIntegration: "2026-07-01",
    dateEmbauche: "2026-07-01",
    dureeInitialeMois: 3,
    dateFinPrevisionnelle: "2026-10-01",
    directionId: 1,
    directionName: "Gestion de Patrimoine & Conseil Privé",
    responsableId: 2,
    responsableNom: "Saad Fikri",
    statutEssai: "EN_COURS",
    PeriodeActuel: "TROIS_MOIS",
    actif: true
  },
  {
    id: 2,
    matricule: "GP-2026-002",
    firstName: "Saad",
    lastName: "Fikri",
    email: "saad.fikri@groupe-premium.com",
    phone: "+212 6 72 23 45 67",
    poste: "Analyste Financier & Allocation",
    dateIntegration: "2026-07-15",
    dateEmbauche: "2026-07-15",
    dureeInitialeMois: 3,
    dateFinPrevisionnelle: "2026-10-15",
    directionId: 2,
    directionName: "Asset Management & Produits",
    responsableId: 2,
    responsableNom: "Salma Benjelloun",
    statutEssai: "EN_COURS",
    PeriodeActuel: "TROIS_MOIS",
    actif: true
  },
  {
    id: 3,
    matricule: "GP-2026-003",
    firstName: "Hiba",
    lastName: "Alaoui",
    email: "hiba.alaoui@groupe-premium.com",
    phone: "+212 6 73 34 56 78",
    poste: "Chargée de Partenariats B2B",
    dateIntegration: "2026-07-20",
    dateEmbauche: "2026-07-20",
    dureeInitialeMois: 3,
    dateFinPrevisionnelle: "2026-10-23",
    directionId: 4,
    directionName: "Réseau Commercial & Partenariats",
    responsableId: 3,
    responsableNom: "Karim Tazi",
    statutEssai: "RENOUVELEE",
    PeriodeActuel: "TROIS_MOIS",
    actif: true
  },
  {
    id: 4,
    matricule: "GP-2026-004",
    firstName: "Mehdi",
    lastName: "Benzekri",
    email: "mehdi.benzekri@groupe-premium.com",
    phone: "+212 6 74 45 67 89",
    poste: "Ingénieur Patrimonial Senior",
    dateIntegration: "2026-04-02",
    dateEmbauche: "2026-04-02",
    dureeInitialeMois: 6,
    dateFinPrevisionnelle: "2026-10-16",
    directionId: 1,
    directionName: "Gestion de Patrimoine & Conseil Privé",
    responsableId: 1,
    responsableNom: "Youssef El Amrani",
    statutEssai: "EN_COURS",
    PeriodeActuel: "SIX_MOIS",
    actif: true
  },
  {
    id: 5,
    matricule: "GP-2026-005",
    firstName: "Othmane",
    lastName: "Bennani",
    email: "othmane.bennani@groupe-premium.com",
    phone: "+212 6 75 56 78 90",
    poste: "Responsable Conformité & Risques",
    dateIntegration: "2026-01-01",
    dateEmbauche: "2026-01-01",
    dureeInitialeMois: 3,
    dateFinPrevisionnelle: "2026-04-01",
    directionId: 3,
    directionName: "Direction Financière & Risques",
    responsableId: 4,
    responsableNom: "Houda Chraibi",
    statutEssai: "CONFIRMEE",
    PeriodeActuel: "TERMINE",
    actif: true
  },
  {
    id: 6,
    matricule: "GP-2026-006",
    firstName: "Kenza",
    lastName: "Berrada",
    email: "kenza.berrada@groupe-premium.com",
    phone: "+212 6 76 67 89 01",
    poste: "Consultante Clientèle Privée",
    dateIntegration: "2026-08-01",
    dateEmbauche: "2026-08-01",
    dureeInitialeMois: 3,
    dateFinPrevisionnelle: "2026-11-01",
    directionId: 1,
    directionName: "Gestion de Patrimoine & Conseil Privé",
    responsableId: 1,
    responsableNom: "Youssef El Amrani",
    statutEssai: "EN_COURS",
    PeriodeActuel: "TROIS_MOIS",
    actif: true
  }
];

export const initialPeriodes: PeriodeEvaluation[] = [
  {
    id: 1,
    salarieId: 1,
    salarieNom: "Imane Ellaouzi",
    salarieEmail: "imaneellaouzi.05@gmail.com",
    salariePoste: "Full Stack Developer",
    responsableId: 2,
    responsableNom: "Saad Fikri",
    responsableEmail: "saad.fikri@groupe-premium.com",
    directionName: "Gestion de Patrimoine & Conseil Privé",
    typePeriode: "TROIS_MOIS",
    numeroPeriode: 1,
    dateEcheance: "2026-10-01",
    dateDeclenchementEmail: "2026-09-10",
    heureDeclenchement: "09:00:00",
    dateDernierRappel: "2026-09-24",
    statut: "EN_RETARD",
    joursRetard: 1,
    decisionFinale: "EN_ATTENTE",
    tokenAccesSalarie: "sec-eval-1-3m-demo",
    emailsEnvoyes: {
      email1: "2026-09-10",
      email2: "2026-09-17",
      email3: "2026-09-24"
    }
  },
  {
    id: 2,
    salarieId: 2,
    salarieNom: "Saad Fikri",
    salarieEmail: "saad.fikri@groupe-premium.com",
    salariePoste: "Analyste Financier & Allocation",
    responsableId: 2,
    responsableNom: "Salma Benjelloun",
    responsableEmail: "salma.benjelloun@groupe-premium.com",
    directionName: "Asset Management & Produits",
    typePeriode: "TROIS_MOIS",
    numeroPeriode: 1,
    dateEcheance: "2026-10-15",
    dateDeclenchementEmail: "2026-09-24",
    heureDeclenchement: "09:00:00",
    dateDernierRappel: "2026-10-01",
    statut: "EN_RELANCE",
    decisionFinale: "EN_ATTENTE",
    tokenAccesSalarie: "sec-eval-2-3m-demo",
    emailsEnvoyes: {
      email1: "2026-09-24",
      email2: "2026-10-01"
    }
  },
  {
    id: 3,
    salarieId: 3,
    salarieNom: "Hiba Alaoui",
    salarieEmail: "hiba.alaoui@groupe-premium.com",
    salariePoste: "Chargée de Partenariats B2B",
    responsableId: 3,
    responsableNom: "Karim Tazi",
    responsableEmail: "karim.tazi@groupe-premium.com",
    directionName: "Réseau Commercial & Partenariats",
    typePeriode: "TROIS_MOIS",
    numeroPeriode: 1,
    dateEcheance: "2026-10-23",
    dateDeclenchementEmail: "2026-10-02",
    heureDeclenchement: "09:00:00",
    statut: "EN_COURS",
    decisionFinale: "EN_ATTENTE",
    tokenAccesSalarie: "sec-eval-3-3m-demo",
    emailsEnvoyes: {
      email1: "2026-10-02"
    }
  },
  {
    id: 4,
    salarieId: 4,
    salarieNom: "Mehdi Benzekri",
    salarieEmail: "mehdi.benzekri@groupe-premium.com",
    salariePoste: "Ingénieur Patrimonial Senior",
    responsableId: 1,
    responsableNom: "Youssef El Amrani",
    responsableEmail: "youssef.elamrani@groupe-premium.com",
    directionName: "Gestion de Patrimoine & Conseil Privé",
    typePeriode: "SIX_MOIS",
    numeroPeriode: 2,
    dateEcheance: "2026-10-16",
    dateDeclenchementEmail: "2026-09-25",
    heureDeclenchement: "09:00:00",
    statut: "EN_RELANCE",
    decisionFinale: "EN_ATTENTE",
    tokenAccesSalarie: "sec-eval-4-6m-demo",
    emailsEnvoyes: {
      email1: "2026-09-25",
      email2: "2026-10-02"
    }
  },
  {
    id: 5,
    salarieId: 5,
    salarieNom: "Othmane Bennani",
    salarieEmail: "othmane.bennani@groupe-premium.com",
    salariePoste: "Responsable Conformité & Risques",
    responsableId: 4,
    responsableNom: "Houda Chraibi",
    responsableEmail: "houda.chraibi@groupe-premium.com",
    directionName: "Direction Financière & Risques",
    typePeriode: "TROIS_MOIS",
    numeroPeriode: 1,
    dateEcheance: "2026-04-01",
    dateDeclenchementEmail: "2026-03-11",
    heureDeclenchement: "09:00:00",
    dateValidationEvaluateur: "2026-03-28 14:30:00",
    dateValidationRH: "2026-03-30",
    statut: "COMPLETEE",
    noteGlobale: 4.9,
    decisionFinale: "VALIDATION",
    etapeValide: true,
    etapeEV: true,
    etapeEvaluation: true,
    etapeSH: true,
    emailsEnvoyes: {
      email1: "2026-03-11",
      email2: "2026-03-21"
    }
  },
  {
    id: 6,
    salarieId: 6,
    salarieNom: "Kenza Berrada",
    salarieEmail: "kenza.berrada@groupe-premium.com",
    salariePoste: "Consultante Clientèle Privée",
    responsableId: 1,
    responsableNom: "Youssef El Amrani",
    responsableEmail: "youssef.elamrani@groupe-premium.com",
    directionName: "Gestion de Patrimoine & Conseil Privé",
    typePeriode: "TROIS_MOIS",
    numeroPeriode: 1,
    dateEcheance: "2026-11-01",
    dateDeclenchementEmail: "2026-10-11",
    heureDeclenchement: "09:00:00",
    statut: "EN_COURS",
    decisionFinale: "EN_ATTENTE",
    tokenAccesSalarie: "sec-eval-6-3m-demo",
    emailsEnvoyes: {}
  }
];


export const initialEvaluations: EvaluationDetail[] = [
  {
    id: 101,
    periodeId: 5,
    competencesTechniques: 5,
    integrationEquipe: 4.8,
    autonomieRigueur: 5,
    atteinteObjectifs: 4.8,
    pointsForts: "Excellente maîtrise réglementaire, rigueur exemplaire et autonomie confirmée dans le pilotage des audits de contrôle.",
    axesAmelioration: "Poursuivre la montée en compétence sur les nouveaux modules de conformité digitale.",
    avisResponsable: "Othmane a démontré des qualités professionnelles et humaines exceptionnelles. Période d'essai validée avec félicitations.",
    recommandation: "VALIDATION",
    dateEvaluation: "2025-11-28",
    signatureResponsable: "Houda CHRAIBI",
    signatureSalarie: "Othmane BENNANI"
  }
];

export const initialEmails: HistoriqueEmail[] = [
  {
    id: 1,
    salarieId: 1,
    salarieNom: "Imane Ellaouzi",
    destinataire: "saad.fikri@groupe-premium.com",
    destinataireNom: "Saad Fikri",
    roleDestinataire: "RESPONSABLE",
    objet: "[URGENT J+1] Bilan de Période d'Essai en retard — Imane Ellaouzi",
    typeEmail: "EMAIL_3_EN_RETARD",
    dateEnvoi: "2026-09-24",
    heureEnvoi: "09:00:00",
    statut: "DELIVRE",
    batchCron: true,
    contenuCorps: "Bonjour Saad,\n\nNous constatons que le bilan d'évaluation de période d'essai (3 Mois) pour Imane Ellaouzi est arrivé à échéance le 01/10/2026 et n'a pas encore été finalisé.\n\nMerci de vous connecter à la plateforme pour remplir et soumettre la fiche d'évaluation dans les plus brefs délais.\n\nCordialement,\nDirection des Ressources Humaines — Groupe Premium"
  },
  {
    id: 2,
    salarieId: 2,
    salarieNom: "Saad Fikri",
    destinataire: "salma.benjelloun@groupe-premium.com",
    destinataireNom: "Salma Benjelloun",
    roleDestinataire: "RESPONSABLE",
    objet: "[Rappel J-14] Bilan de Période d'Essai — Saad Fikri",
    typeEmail: "EMAIL_2_EN_RELANCE",
    dateEnvoi: "2026-10-01",
    heureEnvoi: "09:00:10",
    statut: "OUVERT",
    batchCron: true,
    contenuCorps: "Bonjour Salma,\n\nCeci est un rappel automatique : l'échéance du bilan de période d'essai pour Saad Fikri arrive à terme dans 14 jours (le 15/10/2026).\n\nMerci d'organiser l'entretien de bilan et de compléter la fiche d'évaluation sur le portail RH.\n\nBien cordialement,\nDirection des Ressources Humaines — Groupe Premium"
  },
  {
    id: 3,
    salarieId: 3,
    salarieNom: "Hiba Alaoui",
    destinataire: "karim.tazi@groupe-premium.com",
    destinataireNom: "Karim Tazi",
    roleDestinataire: "RESPONSABLE",
    objet: "[Ouverture Bilan 3M] Période d'Essai — Hiba Alaoui",
    typeEmail: "EMAIL_1_EN_COURS",
    dateEnvoi: "2026-10-02",
    heureEnvoi: "09:00:05",
    statut: "OUVERT",
    batchCron: true,
    contenuCorps: "Bonjour Karim,\n\nLe parcours d'intégration de Hiba Alaoui arrive à son 3ème mois. Le formulaire officiel d'évaluation de la période d'essai est désormais ouvert sur votre espace manager.\n\nÉchéance : 23/10/2026.\n\nDirection des Ressources Humaines — Groupe Premium"
  },
  {
    id: 4,
    salarieId: 4,
    salarieNom: "Mehdi Benzekri",
    destinataire: "youssef.elamrani@groupe-premium.com",
    destinataireNom: "Youssef El Amrani",
    roleDestinataire: "RESPONSABLE",
    objet: "[Relance J-14] Bilan 6 Mois — Mehdi Benzekri",
    typeEmail: "EMAIL_2_EN_RELANCE",
    dateEnvoi: "2026-10-02",
    heureEnvoi: "09:00:20",
    statut: "DELIVRE",
    batchCron: true,
    contenuCorps: "Bonjour Youssef,\n\nLa 2ème période d'essai (Bilan 6 mois) de Mehdi Benzekri arrive à son terme le 16/10/2026. Merci de réaliser l'entretien de titularisation et de formuler votre avis final.\n\nDirection des Ressources Humaines — Groupe Premium"
  },
  {
    id: 5,
    salarieId: 5,
    salarieNom: "Othmane Bennani",
    destinataire: "othmane.bennani@groupe-premium.com",
    destinataireNom: "Othmane Bennani",
    roleDestinataire: "SALARIE",
    objet: "[Validation] Confirmation de Période d'Essai — Groupe Premium",
    typeEmail: "CONFIRMATION_RH",
    dateEnvoi: "2026-03-30",
    heureEnvoi: "16:45:00",
    statut: "OUVERT",
    batchCron: false,
    contenuCorps: "Cher Othmane,\n\nNous avons le plaisir de vous confirmer la validation définitive de votre période d'essai au poste de Responsable Conformité & Risques au sein du Groupe Premium.\n\nFélicitations pour votre engagement et bienvenue officiellement dans l'équipe.\n\nDirection des Ressources Humaines"
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    titre: "Alerte Retard : Bilan d'Imane Ellaouzi",
    message: "Le bilan d'évaluation 3 mois d'Imane Ellaouzi est en retard de 1 jour. Une relance automatique a été transmise à Saad Fikri.",
    type: "RETARD",
    priorite: "URGENTE",
    dateCreation: "2026-10-02",
    heureCreation: "09:00",
    estLue: false,
    cibleRole: "ADMIN_RH",
    lienEcran: "retards",
    targetId: 1
  },
  {
    id: 2,
    titre: "Relance programmée J-14 : Saad Fikri",
    message: "Le rappel automatique J-14 a été délivré à Salma Benjelloun pour le bilan 3 mois de Saad Fikri (échéance le 15/10/2026).",
    type: "CRON_SYSTEME",
    priorite: "MOYENNE",
    dateCreation: "2026-10-01",
    heureCreation: "09:00",
    estLue: false,
    cibleRole: "TOUS",
    lienEcran: "periodes",
    targetId: 2
  },
  {
    id: 3,
    titre: "Évaluation validée : Othmane Bennani",
    message: "Houda Chraibi a validé le bilan de Othmane Bennani avec la mention 'Validation' et une note de 4.9/5.",
    type: "VALIDATION",
    priorite: "MOYENNE",
    dateCreation: "2026-03-28",
    heureCreation: "14:35",
    estLue: true,
    cibleRole: "ADMIN_RH",
    lienEcran: "detail-salarie",
    targetId: 5
  },
  {
    id: 4,
    titre: "Nouveau salarié intégré : Imane Ellaouzi",
    message: "Imane Ellaouzi a été intégrée au pôle Gestion de Patrimoine (Full Stack Developer). Échéance bilan 3M : 01/10/2026.",
    type: "EVALUATION",
    priorite: "BASSE",
    dateCreation: "2026-07-01",
    heureCreation: "10:00",
    estLue: true,
    cibleRole: "TOUS",
    lienEcran: "salaries",
    targetId: 1
  }
];
