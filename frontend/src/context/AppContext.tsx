"use client";

import React, { createContext, useContext, useState, useMemo } from 'react';
import { 
  UserRole, 
  Direction, 
  Responsable, 
  Salarie, 
  PeriodeEvaluation, 
  EvaluationDetail, 
  HistoriqueEmail, 
  NotificationItem,
  DecisionPeriode,
  User,
  Parametres,
  TemplateEmailSetting,
  CompteSetting,
  ThemeMode,
  ProfilSetting,
  TypeEmail,
  FormulaireEvaluationData
} from '../types';
import { 
  initialDirections, 
  initialResponsables, 
  initialSalaries, 
  initialPeriodes, 
  initialEvaluations, 
  initialEmails, 
  initialNotifications,
  initialUsers 
} from '../data/mockData';

export type ScreenId = 
  | 'dashboard'
  | 'salaries'
  | 'ajouter-salarie'
  | 'detail-salarie'
  | 'periodes'
  | 'formulaire-evaluation'
  | 'retards'
  | 'emails'
  | 'moteur'
  | 'analyse-ia'
  | 'archive'
  | 'notifications'
  | 'responsables'
  | 'ajouter-responsable'
  | 'gestion-responsable'
  | 'detail-responsable'
  | 'dashboard-responsable'
  | 'parametres'
  | 'aide';

const initialParametres: Parametres = {
  templatesEmail: [
    {
      id: 'email1',
      nom: 'Email 1 - Notification initiale (J-21)',
      delai: 'J-21 (3 semaines avant l\'échéance)',
      objet: '[GROUPE PREMIUM] Ouverture d\'évaluation - {salarie} ({periode})',
      contenu: 'Bonjour {responsable},\n\nLe premier bilan d\'évaluation ({periode}) concernant {salarie} arrive à échéance le {echeance}.\n\nMerci de préparer et compléter la fiche d\'évaluation dans votre espace manager.\n\nDirection des Ressources Humaines - Groupe Premium'
    },
    {
      id: 'email2',
      nom: 'Email 2 - Relance intermédiaire (J-14)',
      delai: 'J-14 (2 semaines avant l\'échéance)',
      objet: '[GROUPE PREMIUM - RELANCE] Rappel d\'évaluation - {salarie} ({periode})',
      contenu: 'Bonjour {responsable},\n\nCeci est un rappel : l\'évaluation d\'essai ({periode}) de {salarie} doit être complétée avant le {echeance}.\n\nMerci de valider le formulaire sous les plus brefs délais.\n\nDirection des Ressources Humaines - Groupe Premium'
    },
    {
      id: 'email3',
      nom: 'Email 3 - Relance urgente (J-7)',
      delai: 'J-7 (1 semaine avant l\'échéance)',
      objet: '[GROUPE PREMIUM - URGENT] Évaluation en retard imminent - {salarie} ({periode})',
      contenu: 'ATTENTION : L\'évaluation d\'essai ({periode}) de {salarie} arrive à échéance le {echeance}.\n\nCe bilan est obligatoire pour la sécurisation juridique du contrat. Veuillez renseigner le formulaire aujourd\'hui même.\n\nDirection des Ressources Humaines - Groupe Premium'
    }
  ],
  compte: {
    nomExpediteur: 'Direction des Ressources Humaines - Groupe Premium',
    emailExpediteur: 'rh@groupe-premium.com'
  },
  theme: 'light',
  profil: {
    nom: 'Benali',
    prenom: 'Imane',
    email: 'rh@groupe-premium.com',
    direction: 'Ressources Humaines & Talents'
  }
};

interface AppContextType {
  currentScreen: ScreenId;
  navigateTo: (screen: ScreenId, params?: { salarieId?: number; periodeId?: number; emailId?: number; responsableId?: number }) => void;
  selectedResponsableId: number;
  setSelectedResponsableId: (id: number) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: User | null;
  currentResponsable: Responsable | null;
  selectedSalarieId: number;
  setSelectedSalarieId: (id: number) => void;
  selectedPeriodeId: number;
  setSelectedPeriodeId: (id: number) => void;
  selectedEmail: HistoriqueEmail | null;
  openEmailModal: (email: HistoriqueEmail) => void;
  closeEmailModal: () => void;
  isEmailModalOpen: boolean;
  isAddSalarieModalOpen: boolean;
  openAddSalarieModal: () => void;
  closeAddSalarieModal: () => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;

  // Settings / Paramètres
  parametres: Parametres;
  updateParametres: (newParametres: Partial<Parametres>) => void;

  // Raw & Filtered Data by Role
  directions: Direction[];
  responsables: Responsable[];
  users: User[];
  allSalaries: Salarie[];
  salaries: Salarie[]; // Filtered by currentRole
  archives: Salarie[];
  allPeriodes: PeriodeEvaluation[];
  periodes: PeriodeEvaluation[]; // Filtered by currentRole
  evaluations: EvaluationDetail[];
  emails: HistoriqueEmail[];
  notifications: NotificationItem[];

  // Mutations
  addSalarie: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    poste: string;
    dateEmbauche: string;
    dureeInitialeMois: number;
    directionId: number;
    responsableId: number;
    matricule?: string;
  }) => void;
  updateSalarie: (
    salarieId: number,
    data: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      poste?: string;
      responsableId?: number;
      directionName?: string;
      responsableNom?: string;
    }
  ) => void;
  deleteSalarie: (salarieId: number) => void;
  restaurerSalarie: (salarieId: number) => void;
  addResponsable: (data: {
    firstName: string;
    lastName: string;
    email: string;
    directionId: number;
  }) => void;
  updateResponsable: (
    responsableId: number,
    data: {
      firstName: string;
      lastName: string;
      email: string;
   
      directionId: number;
    }
  ) => void;
  deleteResponsable: (responsableId: number) => boolean;
  relancerRetard: (periodeId: number) => void;
  relancerTousLesRetards: () => void;
  submitEvaluation: (data: {
    periodeId: number;
    competencesTechniques: number;
    integrationEquipe: number;
    autonomieRigueur: number;
    atteinteObjectifs: number;
    pointsForts: string;
    axesAmelioration: string;
    avisResponsable: string;
    avisSalarie?: string;
    recommandation: 'VALIDATION' | 'CONFIRMATION' | 'RENOUVELLEMENT' | 'TITULARISATION' | 'RUPTURE';
    signatureResponsable: string;
    motifRupture?: string;
    formulaireComplet?: FormulaireEvaluationData;
  }) => void;
  validerDecisionRH: (periodeId: number, decision: DecisionPeriode, motif: string) => void;
  triggerCronBatch0900: () => { emailsCount: number; retardsCount: number };
  markNotificationAsRead: (id: number) => void;
  markAllNotificationsAsRead: () => void;
  
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dashboard');
  const [currentRole, setCurrentRoleState] = useState<UserRole>('ADMIN_RH');
  const [selectedSalarieId, setSelectedSalarieId] = useState<number>(1);
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<number>(1);
  const [selectedResponsableId, setSelectedResponsableId] = useState<number>(1);
  const [selectedEmail, setSelectedEmail] = useState<HistoriqueEmail | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  const [isAddSalarieModalOpen, setIsAddSalarieModalOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const openAddSalarieModal = () => setIsAddSalarieModalOpen(true);
  const closeAddSalarieModal = () => setIsAddSalarieModalOpen(false);

  const [parametres, setParametres] = useState<Parametres>(initialParametres);

  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

  const [directions] = useState<Direction[]>(initialDirections);
  const [responsables, setResponsables] = useState<Responsable[]>(initialResponsables);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [salariesList, setSalariesList] = useState<Salarie[]>(initialSalaries);
  const [periodesList, setPeriodesList] = useState<PeriodeEvaluation[]>(initialPeriodes);
  const [evaluations, setEvaluations] = useState<EvaluationDetail[]>(initialEvaluations);
  const [emails, setEmails] = useState<HistoriqueEmail[]>(initialEmails);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const [isLoaded, setIsLoaded] = useState(false);

  // Charger depuis localStorage lors du premier montage (avec mise à jour auto des données de démo)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedSalaries = localStorage.getItem('gp_salaries');
        if (savedSalaries) {
          const parsed: Salarie[] = JSON.parse(savedSalaries);
          const hasCompleteData = parsed.length >= initialSalaries.length && parsed.some(s => s.lastName === 'Ellaouzi' || s.lastName === 'Fikri');
          if (hasCompleteData) {
            setSalariesList(parsed);
          } else {
            setSalariesList(initialSalaries);
            localStorage.setItem('gp_salaries', JSON.stringify(initialSalaries));
          }
        } else {
          setSalariesList(initialSalaries);
          localStorage.setItem('gp_salaries', JSON.stringify(initialSalaries));
        }

        const savedPeriodes = localStorage.getItem('gp_periodes');
        if (savedPeriodes) {
          const parsed: PeriodeEvaluation[] = JSON.parse(savedPeriodes);
          const hasCompleteData = parsed.length >= initialPeriodes.length && parsed.some(p => p.salarieNom.includes('Ellaouzi') || p.salarieNom.includes('Fikri'));
          if (hasCompleteData) {
            setPeriodesList(parsed);
          } else {
            setPeriodesList(initialPeriodes);
            localStorage.setItem('gp_periodes', JSON.stringify(initialPeriodes));
          }
        } else {
          setPeriodesList(initialPeriodes);
          localStorage.setItem('gp_periodes', JSON.stringify(initialPeriodes));
        }

        const savedEvaluations = localStorage.getItem('gp_evaluations');
        if (savedEvaluations) {
          const parsed = JSON.parse(savedEvaluations);
          setEvaluations(parsed.length > 0 ? parsed : initialEvaluations);
        } else {
          setEvaluations(initialEvaluations);
          localStorage.setItem('gp_evaluations', JSON.stringify(initialEvaluations));
        }

        const savedEmails = localStorage.getItem('gp_emails');
        if (savedEmails) {
          const parsed: HistoriqueEmail[] = JSON.parse(savedEmails);
          const hasCompleteData = parsed.length >= initialEmails.length && parsed.some(e => e.salarieNom.includes('Ellaouzi') || e.salarieNom.includes('Fikri'));
          if (hasCompleteData) {
            setEmails(parsed);
          } else {
            setEmails(initialEmails);
            localStorage.setItem('gp_emails', JSON.stringify(initialEmails));
          }
        } else {
          setEmails(initialEmails);
          localStorage.setItem('gp_emails', JSON.stringify(initialEmails));
        }

        const savedNotifications = localStorage.getItem('gp_notifications');
        if (savedNotifications) {
          const parsed: NotificationItem[] = JSON.parse(savedNotifications);
          const hasCompleteData = parsed.length >= initialNotifications.length && parsed.some(n => n.message.includes('Ellaouzi') || n.message.includes('Fikri'));
          if (hasCompleteData) {
            setNotifications(parsed);
          } else {
            setNotifications(initialNotifications);
            localStorage.setItem('gp_notifications', JSON.stringify(initialNotifications));
          }
        } else {
          setNotifications(initialNotifications);
          localStorage.setItem('gp_notifications', JSON.stringify(initialNotifications));
        }

        const savedResponsables = localStorage.getItem('gp_responsables');
        if (savedResponsables) {
          const parsed: Responsable[] = JSON.parse(savedResponsables);
          const hasCompleteData = parsed.length >= initialResponsables.length && parsed.some(r => r.lastName === 'El Amrani' || r.lastName === 'Benjelloun');
          if (hasCompleteData) {
            setResponsables(parsed);
          } else {
            setResponsables(initialResponsables);
            localStorage.setItem('gp_responsables', JSON.stringify(initialResponsables));
          }
        } else {
          setResponsables(initialResponsables);
          localStorage.setItem('gp_responsables', JSON.stringify(initialResponsables));
        }

        const savedParametres = localStorage.getItem('gp_parametres');
        if (savedParametres) setParametres(JSON.parse(savedParametres));
      } catch (err) {
        console.error('Error loading data from localStorage', err);
      }
      setIsLoaded(true);
    }
  }, []);

  // Sauvegarder automatiquement dans localStorage à chaque modification
  React.useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('gp_salaries', JSON.stringify(salariesList));
    }
  }, [salariesList, isLoaded]);

  React.useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('gp_periodes', JSON.stringify(periodesList));
    }
  }, [periodesList, isLoaded]);

  React.useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('gp_evaluations', JSON.stringify(evaluations));
    }
  }, [evaluations, isLoaded]);

  React.useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('gp_emails', JSON.stringify(emails));
    }
  }, [emails, isLoaded]);

  React.useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('gp_notifications', JSON.stringify(notifications));
    }
  }, [notifications, isLoaded]);

  React.useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('gp_responsables', JSON.stringify(responsables));
    }
  }, [responsables, isLoaded]);

  React.useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('gp_parametres', JSON.stringify(parametres));
    }
  }, [parametres, isLoaded]);

  // ─────────────────────────────────────────────────────────────────
  // DYNAMIC STATUS ENGINE: recalculate statut on every render based
  // on dateEcheance vs today using the J-21 / J-14 / J-7 rules:
  //   diffDays > 21       → statut stays as-is (not yet triggered)
  //   21 >= diffDays > 14 → EN_COURS   (Email 1 window)
  //   14 >= diffDays > 7  → EN_RELANCE (Email 2 window)
  //    7 >= diffDays >= 0 → EN_RETARD  (Email 3 / critique)
  //   diffDays < 0        → EN_RETARD  + joursRetard = |diffDays|
  // ─────────────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!isLoaded) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    setPeriodesList(prev => prev.map(p => {
      // Ne pas recalculer les périodes terminées / validées / rupture
      if (
        p.statut === 'COMPLETEE' ||
        p.statut === 'VALIDEE_RH' ||
        p.statut === 'RUPTURE'
      ) return p;

      const echeance = new Date(p.dateEcheance);
      echeance.setHours(0, 0, 0, 0);
      const diffDays = Math.round((echeance.getTime() - today.getTime()) / 86400000);

      let newStatut = p.statut;
      let newJoursRetard: number | undefined = p.joursRetard;

      if (diffDays < 0) {
        // Période dépassée → EN_RETARD critique
        newStatut = 'EN_RETARD';
        newJoursRetard = Math.abs(diffDays);
      } else if (diffDays <= 7) {
        // J-7 ou moins → EN_RETARD (critique, évaluation urgente)
        newStatut = 'EN_RETARD';
        newJoursRetard = undefined;
      } else if (diffDays <= 14) {
        // J-14 à J-8 → EN_RELANCE
        newStatut = 'EN_RELANCE';
        newJoursRetard = undefined;
      } else if (diffDays <= 21) {
        // J-21 à J-15 → EN_COURS
        newStatut = 'EN_COURS';
        newJoursRetard = undefined;
      }
      // diffDays > 21 → on garde le statut existant (pas encore déclenché)

      if (newStatut === p.statut && newJoursRetard === p.joursRetard) return p;
      return { ...p, statut: newStatut, joursRetard: newJoursRetard };
    }));
  }, [isLoaded]); // run once after load; statuts are recalculated fresh on each page load


  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      if (parametres.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (parametres.theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [parametres.theme]);

  const updateParametres = (newParams: Partial<Parametres>) => {
    setParametres(prev => ({ ...prev, ...newParams }));
    showToast("Paramètres mis à jour avec succès.");
  };

  // Active Responsable when role == RESPONSABLE
  const currentResponsable = useMemo(() => {
    if (!responsables || responsables.length === 0) return null;
    return (
      responsables.find(r => r.id === selectedResponsableId) ||
      responsables.find(r => r.id === 1) ||
      responsables[0] ||
      null
    );
  }, [responsables, selectedResponsableId]);

  const currentUser = useMemo(() => {
    if (currentRole === 'ADMIN_RH') {
      return users.find(u => u.role === 'ADMIN_RH') || users[0] || null;
    }
    if (currentRole === 'RESPONSABLE') {
      if (currentResponsable) {
        const found = users.find(u => u.responsableId === currentResponsable.id);
        if (found) return found;
      }
      return users.find(u => u.role === 'RESPONSABLE') || users[1] || users[0] || null;
    }
    return users[0] || null;
  }, [currentRole, currentResponsable, users]);

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    if (role === 'RESPONSABLE') {
      setCurrentScreen('dashboard');
      const name = currentResponsable ? `${currentResponsable.firstName} ${currentResponsable.lastName}` : 'Responsable';
      showToast(`Connecté en tant que Responsable : ${name}`);
    } else {
      setCurrentScreen('dashboard');
      showToast("Connecté en tant que DRH / Administrateur");
    }
  };

  const salaries = useMemo(() => {
    if (currentRole === 'RESPONSABLE' && currentResponsable) {
      return salariesList.filter(s => s.responsableId === currentResponsable.id);
    }
    return salariesList;
  }, [salariesList, currentRole, currentResponsable]);

  const archives = useMemo(
    () => salaries.filter(salarie => salarie.actif === false),
    [salaries]
  );

  const periodes = useMemo(() => {
    if (currentRole === 'RESPONSABLE' && currentResponsable) {
      return periodesList.filter(p => p.responsableId === currentResponsable.id);
    }
    return periodesList;
  }, [periodesList, currentRole, currentResponsable]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const navigateTo = (screen: ScreenId, params?: { salarieId?: number; periodeId?: number; emailId?: number; responsableId?: number }) => {
    const rhOnlyScreens: ScreenId[] = [
      'ajouter-salarie',
      'responsables',
      'gestion-responsable',
      'detail-responsable',
      'ajouter-responsable',
      'moteur',
      'analyse-ia',
      'archive',
      'emails',
    ];
    if (currentRole === 'RESPONSABLE' && rhOnlyScreens.includes(screen)) {
      showToast("Accès restreint : Cette fonctionnalité est réservée à la DRH.");
      setCurrentScreen('dashboard');
      return;
    }

    if (screen === 'ajouter-salarie') {
      setCurrentScreen('salaries');
      setIsAddSalarieModalOpen(true);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (params?.salarieId) setSelectedSalarieId(params.salarieId);
    if (params?.periodeId) setSelectedPeriodeId(params.periodeId);
    if (params?.responsableId) setSelectedResponsableId(params.responsableId);
    if (params?.emailId) {
      const email = emails.find(e => e.id === params.emailId);
      if (email) setSelectedEmail(email);
    }
    setCurrentScreen(screen);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openEmailModal = (email: HistoriqueEmail) => {
    setSelectedEmail(email);
    setIsEmailModalOpen(true);
  };

  const closeEmailModal = () => {
    setIsEmailModalOpen(false);
  };

  const addMonthsToDate = (dateStr: string, months: number): string => {
    const d = new Date(dateStr);
    d.setMonth(d.getMonth() + months);
    return d.toISOString().split('T')[0];
  };

  // Add Salarié -> Creates ONLY Période 1 (3 mois) per EPIC 2 logic
  const addSalarie = (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    poste: string;
    dateEmbauche: string;
    dureeInitialeMois: number;
    directionId: number;
    responsableId: number;
    matricule?: string;
  }) => {
    const direction = directions.find(d => d.id === data.directionId);
    const responsable = responsables.find(r => r.id === data.responsableId);
    const newId = salariesList.length > 0 ? Math.max(...salariesList.map(s => s.id)) + 1 : 1;
    const dateFinPrevisionnelle = addMonthsToDate(data.dateEmbauche, 3);
    const matricule = data.matricule || `GP-${new Date().getFullYear()}-${String(newId).padStart(3, '0')}`;

    const newSalarie: Salarie = {
      id: newId,
      matricule,
      nom: data.lastName,
      prenom: data.firstName,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      poste: data.poste,
      dateIntegration: data.dateEmbauche,
      dateEmbauche: data.dateEmbauche,
      dureeInitialeMois: data.dureeInitialeMois || 3,
      dateFinPrevisionnelle,
      directionId: data.directionId,
      directionName: direction ? direction.name : 'Direction Générale',
      responsableId: data.responsableId,
      responsableNom: responsable ? `${responsable.firstName} ${responsable.lastName}` : 'Directeur Non Assigné',
      statutEssai: 'EN_COURS',
      PeriodeActuel: 'TROIS_MOIS',
      bloqueEmails: false,
      actif: true
    };

    setSalariesList(prev => [newSalarie, ...prev]);

    const date3M = addMonthsToDate(data.dateEmbauche, 3);
    const newPeriode3MId = periodesList.length > 0 ? Math.max(...periodesList.map(p => p.id)) + 1 : 10;

    const periode3M: PeriodeEvaluation = {
      id: newPeriode3MId,
      salarieId: newId,
      salarieNom: `${data.firstName} ${data.lastName}`,
      salarieEmail: data.email,
      salariePoste: data.poste,
      responsableId: data.responsableId,
      responsableNom: responsable ? `${responsable.firstName} ${responsable.lastName}` : '',
      responsableEmail: responsable ? responsable.email : '',
      directionName: direction ? direction.name : '',
      typePeriode: 'TROIS_MOIS',
      numeroPeriode: 1,
      dateEcheance: date3M,
      dateDeclenchementEmail: date3M,
      heureDeclenchement: '09:00:00',
      statut: 'EN_COURS',
      decisionFinale: 'EN_ATTENTE',
      tokenAccesSalarie: `sec-eval-${newId}-3m-${Date.now().toString(36)}`,
      emailsEnvoyes: {}
    };

    setPeriodesList(prev => [periode3M, ...prev]);

    const newNotif: NotificationItem = {
      id: Date.now(),
      titre: `Nouveau salarié enregistré : ${data.firstName} ${data.lastName} (${matricule})`,
      message: `Période 1 (3 mois) configurée automatiquement pour le ${date3M}.`,
      type: 'EVALUATION',
      priorite: 'MOYENNE',
      dateCreation: new Date().toISOString().split('T')[0],
      heureCreation: new Date().toLocaleTimeString('fr-FR'),
      estLue: false,
      cibleRole: 'TOUS',
      lienEcran: 'detail-salarie',
      targetId: newId
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`Salarié ${data.firstName} ${data.lastName} (${matricule}) créé. Période 1 (3M) générée.`);
    setSelectedSalarieId(newId);
    navigateTo('detail-salarie', { salarieId: newId });
  };

  const updateSalarie = (
    salarieId: number,
    data: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      poste?: string;
      responsableId?: number;
      directionName?: string;
      responsableNom?: string;
    }
  ) => {
    const responsable = data.responsableId === undefined
      ? undefined
      : responsables.find(item => item.id === data.responsableId);

    setSalariesList(prev => prev.map(salarie => salarie.id === salarieId
      ? {
          ...salarie,
          ...data,
          nom: data.lastName,
          prenom: data.firstName,
          responsableNom: responsable
            ? `${responsable.firstName} ${responsable.lastName}`
            : data.responsableNom ?? salarie.responsableNom,
        }
      : salarie));
    showToast('Les informations du salarié ont été mises à jour.');
  };

  const deleteSalarie = (salarieId: number) => {
    const periodeIds = periodesList
      .filter(periode => periode.salarieId === salarieId)
      .map(periode => periode.id);
    setSalariesList(prev => prev.filter(salarie => salarie.id !== salarieId));
    setPeriodesList(prev => prev.filter(periode => periode.salarieId !== salarieId));
    setEvaluations(prev => prev.filter(evaluation => !periodeIds.includes(evaluation.periodeId)));
    showToast('Le salarié a été supprimé.');
  };

  const restaurerSalarie = (salarieId: number) => {
    setSalariesList(prev => prev.map(salarie =>
      salarie.id === salarieId ? { ...salarie, actif: true } : salarie
    ));
    showToast('Le salarié a été restauré dans la liste active.');
  };

  const addResponsable = (data: {
    firstName: string;
    lastName: string;
    email: string;
    directionId: number;
  }) => {
    const direction = directions.find(item => item.id === data.directionId);
    const newId = responsables.length > 0
      ? Math.max(...responsables.map(responsable => responsable.id)) + 1
      : 1;
    const newResponsable: Responsable = {
      id: newId,
      ...data,
      directionName: direction?.name ?? 'Direction Générale',
    };
    setResponsables(prev => [...prev, newResponsable]);
    setSelectedResponsableId(newId);
    showToast(`Responsable ${data.firstName} ${data.lastName} ajouté.`);
  };

  const updateResponsable = (
    responsableId: number,
    data: {
      firstName: string;
      lastName: string;
      email: string;
      directionId: number;
    }
  ) => {
    const direction = directions.find(item => item.id === data.directionId);
    setResponsables(prev => prev.map(responsable => responsable.id === responsableId
      ? { ...responsable, ...data, directionName: direction?.name ?? responsable.directionName }
      : responsable));
    setSalariesList(prev => prev.map(salarie => salarie.responsableId === responsableId
      ? { ...salarie, responsableNom: `${data.firstName} ${data.lastName}` }
      : salarie));
    showToast('Les informations du responsable ont été mises à jour.');
  };

  const deleteResponsable = (responsableId: number) => {
    if (salariesList.some(salarie => salarie.responsableId === responsableId)) {
      showToast('Ce responsable ne peut pas être supprimé tant que des salariés lui sont affectés.');
      return false;
    }
    setResponsables(prev => prev.filter(responsable => responsable.id !== responsableId));
    setUsers(prev => prev.filter(user => user.responsableId !== responsableId));
    if (selectedResponsableId === responsableId) {
      setSelectedResponsableId(responsables.find(responsable => responsable.id !== responsableId)?.id ?? 0);
    }
    showToast('Le responsable a été supprimé.');
    return true;
  };

  const relancerRetard = (periodeId: number) => {
    const periode = periodesList.find(p => p.id === periodeId);
    if (!periode) return;
    const salarie = salariesList.find(s => s.id === periode.salarieId);
    if (salarie?.bloqueEmails) {
      showToast("Emails bloqués pour ce salarié (statut Rupture).");
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('fr-FR');

    setPeriodesList(prev => prev.map(p => {
      if (p.id === periodeId) {
        return {
          ...p,
          dateDernierRappel: today,
          statut: 'EN_RELANCE'
        };
      }
      return p;
    }));

    const newEmail: HistoriqueEmail = {
      id: Date.now(),
      salarieId: periode.salarieId,
      salarieNom: periode.salarieNom,
      destinataire: periode.responsableEmail,
      destinataireNom: periode.responsableNom,
      roleDestinataire: 'RESPONSABLE',
      objet: `[RELANCE RH] Évaluation en relance - ${periode.salarieNom}`,
      typeEmail: 'EMAIL_2_EN_RELANCE',
      dateEnvoi: today,
      heureEnvoi: nowTime,
      statut: 'DELIVRE',
      batchCron: false,
      contenuCorps: `Madame, Monsieur,\n\nLe pôle Ressources Humaines de Groupe Premium vous informe que le bilan d'évaluation (${periode.typePeriode === 'TROIS_MOIS' ? '3 Mois' : '6 Mois'}) concernant ${periode.salarieNom} est en relance (échéance : ${periode.dateEcheance}).\n\nMerci de renseigner le formulaire d'évaluation.`
    };

    setEmails(prev => [newEmail, ...prev]);
    showToast(`Relance envoyée à ${periode.responsableNom}`);
  };

  const relancerTousLesRetards = () => {
    const relances = periodesList.filter(p => p.statut === 'EN_RELANCE' || p.statut === 'EN_RETARD');
    relances.forEach(p => relancerRetard(p.id));
    showToast(`${relances.length} relance(s) envoyée(s).`);
  };

  // Submit Evaluation (Epic 4, 5, 6)
  const submitEvaluation = (data: {
    periodeId: number;
    competencesTechniques: number;
    integrationEquipe: number;
    autonomieRigueur: number;
    atteinteObjectifs: number;
    pointsForts: string;
    axesAmelioration: string;
    avisResponsable: string;
    avisSalarie?: string;
    recommandation: 'VALIDATION' | 'CONFIRMATION' | 'RENOUVELLEMENT' | 'TITULARISATION' | 'RUPTURE';
    signatureResponsable: string;
    motifRupture?: string;
    formulaireComplet?: FormulaireEvaluationData;
  }) => {
    const today = new Date().toISOString().split('T')[0];
    const nowDateTime = `${today} ${new Date().toLocaleTimeString('fr-FR')}`;
    const avgScore = Number(((data.competencesTechniques + data.integrationEquipe + data.autonomieRigueur + data.atteinteObjectifs) / 4).toFixed(1));

    const targetPeriode = periodesList.find(p => p.id === data.periodeId);
    if (!targetPeriode) return;

    const salarie = salariesList.find(s => s.id === targetPeriode.salarieId);

    const isRupture = data.recommandation === 'RUPTURE';

    // 1. Update target period
    setPeriodesList(prev => prev.map(p => {
      if (p.id === data.periodeId) {
        return {
          ...p,
          statut: isRupture ? 'RUPTURE' : 'COMPLETEE',
          dateValidationEvaluateur: nowDateTime, // EPIC 4: Date validation auto
          noteGlobale: avgScore,
          decisionFinale: data.recommandation,
          motifDecision: isRupture ? (data.motifRupture || 'Rupture durant la période d\'essai') : undefined,
          joursRetard: undefined,
          etapeValide: true,
          etapeEV: true,
          etapeEvaluation: true,
          etapeSH: true
        };
      }
      return p;
    }));

    // 2. EPIC 6: Rupture logic vs EPIC 5: Validation logic
    if (isRupture) {
      // Bloquer tous les emails et passer le salarié en RUPTURE
      setSalariesList(prev => prev.map(s => {
        if (s.id === targetPeriode.salarieId) {
          return {
            ...s,
            statutEssai: 'RUPTURE',
            bloqueEmails: true,
            actif: false,
            PeriodeActuel: 'TERMINE'
          };
        }
        return s;
      }));

      showToast(`Évaluation enregistrée : RUPTURE de la période d'essai pour ${targetPeriode.salarieNom}. Emails bloqués.`);
    } else {
      // EPIC 5: Cascade - Validation Période 1 (3 mois) -> Création automatique Période 2 (6 mois)
      const isPeriod1 = targetPeriode.typePeriode === 'TROIS_MOIS' || targetPeriode.numeroPeriode === 1;

      if (isPeriod1 && salarie) {
        const date6M = addMonthsToDate(salarie.dateEmbauche, 6);
        const newPeriode6MId = Math.max(...periodesList.map(p => p.id)) + 1;

        const periode6M: PeriodeEvaluation = {
          id: newPeriode6MId,
          salarieId: salarie.id,
          salarieNom: `${salarie.firstName} ${salarie.lastName}`,
          salarieEmail: salarie.email,
          salariePoste: salarie.poste,
          responsableId: salarie.responsableId,
          responsableNom: targetPeriode.responsableNom,
          responsableEmail: targetPeriode.responsableEmail,
          directionName: targetPeriode.directionName,
          typePeriode: 'SIX_MOIS',
          numeroPeriode: 2,
          dateEcheance: date6M,
          dateDeclenchementEmail: date6M,
          heureDeclenchement: '09:00:00',
          statut: 'EN_COURS',
          decisionFinale: 'EN_ATTENTE',
          tokenAccesSalarie: `sec-eval-${salarie.id}-6m-${Date.now().toString(36)}`,
          emailsEnvoyes: {}
        };

        setPeriodesList(prev => [periode6M, ...prev]);

        setSalariesList(prev => prev.map(s => {
          if (s.id === salarie.id) {
            return {
              ...s,
              PeriodeActuel: 'SIX_MOIS'
            };
          }
          return s;
        }));

        showToast(`Période 1 (3M) validée. Période 2 (6M) générée automatiquement pour le ${date6M}.`);
      } else {
        // EPIC 5: Période 2 complétée → archivage si confirmation / titularisation
        const isConfirmation =
          data.recommandation === 'TITULARISATION' ||
          data.recommandation === 'CONFIRMATION' ||
          data.recommandation === 'VALIDATION';

        if (isConfirmation && salarie) {
          setSalariesList(prev =>
            prev.map(s =>
              s.id === targetPeriode.salarieId
                ? {
                    ...s,
                    statutEssai: 'CONFIRMEE',
                    bloqueEmails: true,
                    actif: false,
                    PeriodeActuel: 'TERMINE',
                  }
                : s
            )
          );
          showToast(
            `Évaluation confirmée pour ${targetPeriode.salarieNom}. Le dossier a été archivé.`
          );
        } else {
          showToast(`Fiche d'évaluation de la Période 2 (6M) enregistrée.`);
        }
      }
    }

    // Add evaluation detail record
    const newEvalDetail: EvaluationDetail = {
      id: Date.now(),
      periodeId: data.periodeId,
      competencesTechniques: data.competencesTechniques,
      integrationEquipe: data.integrationEquipe,
      autonomieRigueur: data.autonomieRigueur,
      atteinteObjectifs: data.atteinteObjectifs,
      pointsForts: data.pointsForts,
      axesAmelioration: data.axesAmelioration,
      avisResponsable: data.avisResponsable,
      avisSalarie: data.avisSalarie,
      recommandation: data.recommandation,
      dateEvaluation: today,
      signatureResponsable: data.signatureResponsable,
      donneesFormulaireComplet: data.formulaireComplet
    };

    setEvaluations(prev => [newEvalDetail, ...prev.filter(e => e.periodeId !== data.periodeId)]);

    // Notification → ADMIN_RH : un responsable a soumis un formulaire d'évaluation
    const periodeLabel = targetPeriode.typePeriode === 'TROIS_MOIS' ? 'Bilan 3 Mois' : 'Bilan 6 Mois';
    const recommandationLabel = {
      VALIDATION: 'Validation',
      CONFIRMATION: 'Confirmation',
      RENOUVELLEMENT: 'Renouvellement',
      TITULARISATION: 'Titularisation',
      RUPTURE: 'Rupture de période'
    }[data.recommandation] ?? data.recommandation;

    const evalNotif: NotificationItem = {
      id: Date.now() + 1,
      titre: `Évaluation complétée — ${targetPeriode.salarieNom}`,
      message: `${targetPeriode.responsableNom} a soumis la fiche d'évaluation (${periodeLabel}) pour ${targetPeriode.salarieNom}. Décision : ${recommandationLabel}. Note globale : ${avgScore}/5.`,
      type: 'EVALUATION',
      priorite: isRupture ? 'HAUTE' : 'MOYENNE',
      dateCreation: today,
      heureCreation: new Date().toLocaleTimeString('fr-FR'),
      estLue: false,
      cibleRole: 'ADMIN_RH',
      lienEcran: 'detail-salarie',
      targetId: targetPeriode.salarieId
    };

    setNotifications(prev => [evalNotif, ...prev]);

    // Redirection : vers les Archives si le salarié est archivé, sinon vers les Périodes
    const isPeriod2 = !(targetPeriode.typePeriode === 'TROIS_MOIS' || targetPeriode.numeroPeriode === 1);
    const isConfirmationFinal =
      isPeriod2 &&
      (data.recommandation === 'TITULARISATION' ||
        data.recommandation === 'CONFIRMATION' ||
        data.recommandation === 'VALIDATION');

    if (isRupture || isConfirmationFinal) {
      navigateTo('archive');
    } else {
      navigateTo('periodes');
    }
  };

const validerDecisionRH = (periodeId: number, decision: DecisionPeriode, motif: string) => {
  if (currentRole !== 'ADMIN_RH') {
    showToast("Seule la Direction RH peut valider la période d'essai.");
    return;
  }
  const today = new Date().toISOString().split('T')[0];
  const nowTime = new Date().toLocaleTimeString('fr-FR');
  const targetPeriode = periodesList.find(p => p.id === periodeId);
  if (!targetPeriode) return;

  // ───── FIN DE PÉRIODE D'ESSAI (RUPTURE) ─────
  if (decision === 'RUPTURE') {
    const isPeriod1 =
      targetPeriode.typePeriode === 'TROIS_MOIS' ||
      targetPeriode.typePeriode === 'DEUX_MOIS' ||
      targetPeriode.numeroPeriode === 1;

    // 1. La période passe en RUPTURE ; si c'est la Période 1, la période de 6 mois est bloquée
    setPeriodesList(prev => {
      const updated = prev.map<PeriodeEvaluation>(p =>
        p.id === periodeId
          ? {
              ...p,
              statut: 'RUPTURE',
              decisionFinale: 'RUPTURE',
              motifDecision: motif,
              dateValidationRH: today,
              joursRetard: undefined
            }
          : p
      );

      if (!isPeriod1) return updated;

      return updated.filter(p => {
        const is6M =
          p.typePeriode === 'SIX_MOIS' ||
          p.typePeriode === 'CINQ_MOIS' ||
          p.numeroPeriode === 2;
        const terminee = p.statut === 'COMPLETEE' || p.statut === 'VALIDEE_RH';
        // on retire la période 6 mois de ce salarié si elle n'est pas déjà terminée
        return !(p.salarieId === targetPeriode.salarieId && is6M && !terminee);
      });
    });

    // 2. Le salarié passe en RUPTURE : emails bloqués, dossier terminé
    setSalariesList(prev => prev.map(s =>
      s.id === targetPeriode.salarieId
        ? {
            ...s,
            statutEssai: 'RUPTURE',
            bloqueEmails: true,
            actif: false,
            PeriodeActuel: 'TERMINE'
          }
        : s
    ));

    // 3. Trace dans le journal des emails (envoyé au responsable)
    const finEmail: HistoriqueEmail = {
      id: Date.now(),
      salarieId: targetPeriode.salarieId,
      salarieNom: targetPeriode.salarieNom,
      destinataire: targetPeriode.responsableEmail,
      destinataireNom: targetPeriode.responsableNom,
      roleDestinataire: 'RESPONSABLE',
      objet: `[GROUPE PREMIUM] Fin de la période d'essai - ${targetPeriode.salarieNom}`,
      typeEmail: 'CONFIRMATION_RH',
      dateEnvoi: today,
      heureEnvoi: nowTime,
      statut: 'DELIVRE',
      batchCron: false,
      contenuCorps: `Bonjour ${targetPeriode.responsableNom},\n\nLa Direction des Ressources Humaines confirme la fin de la période d'essai de ${targetPeriode.salarieNom}.\n\nMotif : ${motif}\n\nDirection des Ressources Humaines - Groupe Premium`
    };
    setEmails(prev => [finEmail, ...prev]);

    // 4. Notification
    const finNotif: NotificationItem = {
      id: Date.now() + 1,
      titre: `Fin de période d'essai — ${targetPeriode.salarieNom}`,
      message: `La décision RH est enregistrée. Les relances automatiques sont arrêtées${isPeriod1 ? " et la période de 6 mois est bloquée" : ''}.`,
      type: 'EVALUATION',
      priorite: 'HAUTE',
      dateCreation: today,
      heureCreation: nowTime,
      estLue: false,
      cibleRole: 'TOUS',
      lienEcran: 'detail-salarie',
      targetId: targetPeriode.salarieId
    };
    setNotifications(prev => [finNotif, ...prev]);

    showToast(`Fin de période d'essai enregistrée pour ${targetPeriode.salarieNom}.`);
    return;
  }

  // ───── AUTRES DÉCISIONS (comportement existant) ─────
  setPeriodesList(prev => prev.map(p => {
    if (p.id === periodeId) {
      return {
        ...p,
        statut: 'VALIDEE_RH',
        decisionFinale: decision,
        motifDecision: motif,
        dateValidationRH: today
      };
    }
    return p;
  }));

  if (decision === 'CONFIRMATION' || decision === 'TITULARISATION' || decision === 'VALIDATION') {
    setSalariesList(prev => prev.map(s =>
      s.id === targetPeriode.salarieId
        ? {
            ...s,
            statutEssai: 'CONFIRMEE',
            bloqueEmails: true,
            actif: false,
            PeriodeActuel: 'TERMINE',
          }
        : s
    ));
  }

  showToast(`Décision RH (${decision}) validée pour ${targetPeriode.salarieNom}. Dossier archivé.`);
};

  // EPIC 1: Automated email check (3 emails at J-21, J-14, J-7)
  const triggerCronBatch0900 = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    let emailsGenerated = 0;
    let retardsDetected = 0;

    const newEmails: HistoriqueEmail[] = [];

    setPeriodesList(prev => prev.map(p => {
      const salarie = salariesList.find(s => s.id === p.salarieId);
      // Skip completed, validated, or rupture periods, or blocked employees
      if (p.statut === 'COMPLETEE' || p.statut === 'VALIDEE_RH' || p.statut === 'RUPTURE' || salarie?.bloqueEmails) {
        return p;
      }

      const echeance = new Date(p.dateEcheance);
      const diffTime = echeance.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));

      let newStatut = p.statut;
      const tracker = { ...(p.emailsEnvoyes || {}) };

      const periodeLabel = p.typePeriode === 'TROIS_MOIS' ? '3 mois' : '6 mois';

      // 1. Email 3 (J-7) -> EN_RETARD
      if (diffDays <= 7 && !tracker.email3) {
        newStatut = 'EN_RETARD';
        retardsDetected++;
        tracker.email3 = todayStr;
        emailsGenerated++;

        const tmpl = parametres.templatesEmail.find(t => t.id === 'email3');
        const body = (tmpl?.contenu || '')
          .replace('{salarie}', p.salarieNom)
          .replace('{echeance}', p.dateEcheance)
          .replace('{responsable}', p.responsableNom)
          .replace('{periode}', periodeLabel);

        newEmails.push({
          id: Date.now() + emailsGenerated,
          salarieId: p.salarieId,
          salarieNom: p.salarieNom,
          destinataire: p.responsableEmail,
          destinataireNom: p.responsableNom,
          roleDestinataire: 'RESPONSABLE',
          objet: (tmpl?.objet || '').replace('{salarie}', p.salarieNom).replace('{periode}', periodeLabel),
          typeEmail: 'EMAIL_3_EN_RETARD',
          dateEnvoi: todayStr,
          heureEnvoi: '09:00:00',
          statut: 'DELIVRE',
          batchCron: true,
          contenuCorps: body
        });
      }
      // 2. Email 2 (J-14) -> EN_RELANCE
      else if (diffDays <= 14 && diffDays > 7 && !tracker.email2) {
        newStatut = 'EN_RELANCE';
        tracker.email2 = todayStr;
        emailsGenerated++;

        const tmpl = parametres.templatesEmail.find(t => t.id === 'email2');
        const body = (tmpl?.contenu || '')
          .replace('{salarie}', p.salarieNom)
          .replace('{echeance}', p.dateEcheance)
          .replace('{responsable}', p.responsableNom)
          .replace('{periode}', periodeLabel);

        newEmails.push({
          id: Date.now() + emailsGenerated,
          salarieId: p.salarieId,
          salarieNom: p.salarieNom,
          destinataire: p.responsableEmail,
          destinataireNom: p.responsableNom,
          roleDestinataire: 'RESPONSABLE',
          objet: (tmpl?.objet || '').replace('{salarie}', p.salarieNom).replace('{periode}', periodeLabel),
          typeEmail: 'EMAIL_2_EN_RELANCE',
          dateEnvoi: todayStr,
          heureEnvoi: '09:00:00',
          statut: 'DELIVRE',
          batchCron: true,
          contenuCorps: body
        });
      }
      // 3. Email 1 (J-21) -> EN_COURS
      else if (diffDays <= 21 && diffDays > 14 && !tracker.email1) {
        newStatut = 'EN_COURS';
        tracker.email1 = todayStr;
        emailsGenerated++;

        const tmpl = parametres.templatesEmail.find(t => t.id === 'email1');
        const body = (tmpl?.contenu || '')
          .replace('{salarie}', p.salarieNom)
          .replace('{echeance}', p.dateEcheance)
          .replace('{responsable}', p.responsableNom)
          .replace('{periode}', periodeLabel);

        newEmails.push({
          id: Date.now() + emailsGenerated,
          salarieId: p.salarieId,
          salarieNom: p.salarieNom,
          destinataire: p.responsableEmail,
          destinataireNom: p.responsableNom,
          roleDestinataire: 'RESPONSABLE',
          objet: (tmpl?.objet || '').replace('{salarie}', p.salarieNom).replace('{periode}', periodeLabel),
          typeEmail: 'EMAIL_1_EN_COURS',
          dateEnvoi: todayStr,
          heureEnvoi: '09:00:00',
          statut: 'DELIVRE',
          batchCron: true,
          contenuCorps: body
        });
      }

      return {
        ...p,
        statut: newStatut,
        emailsEnvoyes: tracker,
        joursRetard: newStatut === 'EN_RETARD' ? Math.abs(diffDays) : undefined
      };
    }));

    if (newEmails.length > 0) {
      setEmails(prev => [...newEmails, ...prev]);
    }

    const newCronNotif: NotificationItem = {
      id: Date.now(),
      titre: "Cycle d'envoi automatique (3 Emails J-21 / J-14 / J-7)",
      message: `${emailsGenerated} email(s) envoyé(s) automatiquement aux responsables.`,
      type: 'CRON_SYSTEME',
      priorite: 'BASSE',
      dateCreation: todayStr,
      heureCreation: '09:00:00',
      estLue: false,
      cibleRole: 'ADMIN_RH'
    };

    setNotifications(prev => [newCronNotif, ...prev]);
    showToast(`Batch emails automatique exécuté (${emailsGenerated} envoyés).`);

    return { emailsCount: emailsGenerated, retardsCount: retardsDetected };
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, estLue: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, estLue: true })));
    showToast("Toutes les notifications marquées comme lues.");
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        navigateTo,
        selectedResponsableId,
        setSelectedResponsableId,
        currentRole,
        setCurrentRole,
        currentUser,
        currentResponsable,
        selectedSalarieId,
        setSelectedSalarieId,
        selectedPeriodeId,
        setSelectedPeriodeId,
        selectedEmail,
        openEmailModal,
        closeEmailModal,
        isEmailModalOpen,
        isAddSalarieModalOpen,
        openAddSalarieModal,
        closeAddSalarieModal,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebar,
        parametres,
        updateParametres,
        directions,
        responsables,
        users,
        allSalaries: salariesList,
        salaries,
        archives,
        allPeriodes: periodesList,
        periodes,
        evaluations,
        emails,
        notifications,
        addSalarie,
        updateSalarie,
        deleteSalarie,
        restaurerSalarie,
        addResponsable,
        updateResponsable,
        deleteResponsable,
        relancerRetard,
        relancerTousLesRetards,
        submitEvaluation,
        validerDecisionRH,
        triggerCronBatch0900,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

