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
  | 'notifications'
  | 'responsables'
  | 'ajouter-responsable'
  | 'gestion-responsable'
  | 'detail-responsable'
  | 'dashboard-responsable';

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
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;

  // Raw & Filtered Data by Role
  directions: Direction[];
  responsables: Responsable[];
  users: User[];
  allSalaries: Salarie[];
  salaries: Salarie[]; // Filtered by currentRole (Marc Delattre sees only his team)
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
    }
  ) => void;
  deleteSalarie: (salarieId: number) => void;
  addResponsable: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    poste: string;
    directionId: number;
  }) => void;
  updateResponsable: (
    responsableId: number,
    data: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      poste: string;
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
    recommandation: 'CONFIRMATION' | 'RENOUVELLEMENT' | 'RUPTURE';
    signatureResponsable: string;
    formulaireComplet?: FormulaireEvaluationData;
  }) => void;
  validerDecisionRH: (periodeId: number, decision: DecisionPeriode, motif: string) => void;
  triggerCronBatch0900: () => { emailsCount: number; retardsCount: number };
  markNotificationAsRead: (id: number) => void;
  markAllNotificationsAsRead: () => void;
  
  // Toast notifications for UI feedback
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

  const [directions] = useState<Direction[]>(initialDirections);
  const [responsables, setResponsables] = useState<Responsable[]>(initialResponsables);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [salariesList, setSalariesList] = useState<Salarie[]>(initialSalaries);
  const [periodesList, setPeriodesList] = useState<PeriodeEvaluation[]>(initialPeriodes);
  const [evaluations, setEvaluations] = useState<EvaluationDetail[]>(initialEvaluations);
  const [emails, setEmails] = useState<HistoriqueEmail[]>(initialEmails);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  // Active Responsable when role == RESPONSABLE (Marc Delattre, id 1)
  const currentResponsable = useMemo(() => {
    return responsables.find(r => r.id === 1) || responsables[0];
  }, [responsables]);

  const currentUser = useMemo(() => {
    if (currentRole === 'ADMIN_RH') {
      return users.find(u => u.role === 'ADMIN_RH') || users[0];
    }
    if (currentRole === 'RESPONSABLE') {
      return users.find(u => u.responsableId === currentResponsable.id) || users[1];
    }
    return users[0];
  }, [currentRole, currentResponsable, users]);

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    if (role === 'RESPONSABLE') {
      setCurrentScreen('dashboard');
      showToast("Connecté en tant que Responsable : Marc Delattre (Équipe Patrimoine)");
    } else {
      setCurrentScreen('dashboard');
      showToast("Connecté en tant que DRH / Administrateur (Accès complet)");
    }
  };

  // Filter salaries by currentRole
  // RESPONSABLE only sees his assigned subordinates
  const salaries = useMemo(() => {
    if (currentRole === 'RESPONSABLE') {
      return salariesList.filter(s => s.responsableId === currentResponsable.id);
    }
    return salariesList;
  }, [salariesList, currentRole, currentResponsable]);

  // Filter periodes by currentRole
  const periodes = useMemo(() => {
    if (currentRole === 'RESPONSABLE') {
      return periodesList.filter(p => p.responsableId === currentResponsable.id);
    }
    return periodesList;
  }, [periodesList, currentRole, currentResponsable]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const navigateTo = (screen: ScreenId, params?: { salarieId?: number; periodeId?: number; emailId?: number; responsableId?: number }) => {
    // Règle métier : Le responsable ne peut PAS accéder aux écrans d'administration RH
    const rhOnlyScreens: ScreenId[] = [
      'ajouter-salarie',
      'responsables',
      'gestion-responsable',
      'detail-responsable',
      'ajouter-responsable',
      'moteur',
      'emails',
    ];
    if (currentRole === 'RESPONSABLE' && rhOnlyScreens.includes(screen)) {
      showToast("Accès restreint : Cette fonctionnalité administrative est réservée à la DRH.");
      setCurrentScreen('dashboard');
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
    const dateFinPrevisionnelle = addMonthsToDate(data.dateEmbauche, data.dureeInitialeMois);
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
      dureeInitialeMois: data.dureeInitialeMois,
      dateFinPrevisionnelle,
      directionId: data.directionId,
      directionName: direction ? direction.name : 'Direction Générale',
      responsableId: data.responsableId,
      responsableNom: responsable ? `${responsable.firstName} ${responsable.lastName}` : 'Directeur Non Assigné',
      statutEssai: 'EN_COURS',
      jalonActuel: 'DEUX_MOIS'
    };

    setSalariesList(prev => [newSalarie, ...prev]);

    const date2M = addMonthsToDate(data.dateEmbauche, 2);
    const date5M = addMonthsToDate(data.dateEmbauche, 5);

    const newPeriode2MId = periodesList.length > 0 ? Math.max(...periodesList.map(p => p.id)) + 1 : 10;
    const newPeriode5MId = newPeriode2MId + 1;

    const periode2M: PeriodeEvaluation = {
      id: newPeriode2MId,
      salarieId: newId,
      salarieNom: `${data.firstName} ${data.lastName}`,
      salarieEmail: data.email,
      salariePoste: data.poste,
      responsableId: data.responsableId,
      responsableNom: responsable ? `${responsable.firstName} ${responsable.lastName}` : '',
      responsableEmail: responsable ? responsable.email : '',
      directionName: direction ? direction.name : '',
      typePeriode: 'DEUX_MOIS',
      dateEcheance: date2M,
      dateDeclenchementEmail: date2M,
      heureDeclenchement: '09:00:00',
      statut: 'PLANIFIEE',
      decisionFinale: 'EN_ATTENTE',
      tokenAccesSalarie: `sec-eval-${newId}-2m-${Date.now().toString(36)}`
    };

    const periode5M: PeriodeEvaluation = {
      id: newPeriode5MId,
      salarieId: newId,
      salarieNom: `${data.firstName} ${data.lastName}`,
      salarieEmail: data.email,
      salariePoste: data.poste,
      responsableId: data.responsableId,
      responsableNom: responsable ? `${responsable.firstName} ${responsable.lastName}` : '',
      responsableEmail: responsable ? responsable.email : '',
      directionName: direction ? direction.name : '',
      typePeriode: 'CINQ_MOIS',
      dateEcheance: date5M,
      dateDeclenchementEmail: date5M,
      heureDeclenchement: '09:00:00',
      statut: 'PLANIFIEE',
      decisionFinale: 'EN_ATTENTE',
      tokenAccesSalarie: `sec-eval-${newId}-5m-${Date.now().toString(36)}`
    };

    setPeriodesList(prev => [periode2M, periode5M, ...prev]);

    const newNotif: NotificationItem = {
      id: Date.now(),
      titre: `Nouveau salarié enregistré : ${data.firstName} ${data.lastName} (${matricule})`,
      message: `Périodes d'essai configurées automatiquement : Jalons 2 mois (${date2M}) et 5 mois (${date5M}).`,
      type: 'EVALUATION',
      priorite: 'MOYENNE',
      dateCreation: new Date().toISOString().split('T')[0],
      heureCreation: new Date().toLocaleTimeString('fr-FR'),
      estLue: false,
      cibleRole: 'ADMIN_RH',
      lienEcran: 'salaries',
      targetId: newId
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`Salarié ${data.firstName} ${data.lastName} (${matricule}) créé avec succès.`);
    setSelectedSalarieId(newId);
    navigateTo('detail-salarie', { salarieId: newId });
  };

  const relancerRetard = (periodeId: number) => {
    const periode = periodesList.find(p => p.id === periodeId);
    if (!periode) return;

    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('fr-FR');

    setPeriodesList(prev => prev.map(p => {
      if (p.id === periodeId) {
        return {
          ...p,
          dateDernierRappel: today
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
      objet: `[RELANCE RH URGENTE J+${periode.joursRetard || 2}] Évaluation en retard - ${periode.salarieNom}`,
      typeEmail: 'RAPPEL_RETARD_J2',
      dateEnvoi: today,
      heureEnvoi: nowTime,
      statut: 'DELIVRE',
      batchCron: false,
      contenuCorps: `Madame, Monsieur,\n\nLe pôle Ressources Humaines de Groupe Premium vous informe que le bilan d'évaluation (${periode.typePeriode === 'DEUX_MOIS' ? '2 Mois' : '5 Mois'}) concernant ${periode.salarieNom} accuse un retard de ${periode.joursRetard || 2} jours.\n\nCe retard bloque la sécurisation juridique de la période d'essai. Merci de renseigner impérativement le formulaire sous 24h.\n\nLien vers votre espace manager : https://portail.groupe-premium.com/evaluations/${periode.id}`
    };

    setEmails(prev => [newEmail, ...prev]);

    const newNotif: NotificationItem = {
      id: Date.now(),
      titre: `Relance envoyée à ${periode.responsableNom}`,
      message: `Email de relance retard pour l'évaluation de ${periode.salarieNom} envoyé avec succès.`,
      type: 'RETARD',
      priorite: 'HAUTE',
      dateCreation: today,
      heureCreation: nowTime,
      estLue: false,
      cibleRole: 'ADMIN_RH',
      lienEcran: 'emails'
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`Relance envoyée immédiatement à ${periode.responsableNom}`);
  };

  const relancerTousLesRetards = () => {
    const enRetard = periodesList.filter(p => p.statut === 'EN_RETARD');
    enRetard.forEach(p => relancerRetard(p.id));
    showToast(`${enRetard.length} relance(s) envoyée(s) aux responsables en retard.`);
  };

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
    recommandation: 'CONFIRMATION' | 'RENOUVELLEMENT' | 'RUPTURE';
    signatureResponsable: string;
    formulaireComplet?: FormulaireEvaluationData;
  }) => {
    const today = new Date().toISOString().split('T')[0];
    const avgScore = Number(((data.competencesTechniques + data.integrationEquipe + data.autonomieRigueur + data.atteinteObjectifs) / 4).toFixed(1));

    setPeriodesList(prev => prev.map(p => {
      if (p.id === data.periodeId) {
        return {
          ...p,
          statut: 'COMPLETEE',
          noteGlobale: avgScore,
          decisionFinale: data.recommandation,
          joursRetard: undefined
        };
      }
      return p;
    }));

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

    const targetPeriode = periodesList.find(p => p.id === data.periodeId);

    const newNotif: NotificationItem = {
      id: Date.now(),
      titre: `Évaluation complétée pour ${targetPeriode?.salarieNom || 'le salarié'}`,
      message: `Recommandation : ${data.recommandation} (Score : ${avgScore}/5). Fiche officielle enregistrée.`,
      type: 'EVALUATION',
      priorite: 'MOYENNE',
      dateCreation: today,
      heureCreation: new Date().toLocaleTimeString('fr-FR'),
      estLue: false,
      cibleRole: 'ADMIN_RH',
      lienEcran: 'periodes',
      targetId: data.periodeId
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`Fiche d'évaluation officielle enregistrée avec succès.`);
    navigateTo('periodes');
  };

  const validerDecisionRH = (periodeId: number, decision: DecisionPeriode, motif: string) => {
    if (currentRole !== 'ADMIN_RH') {
      showToast("Seule la Direction RH possède l'autorisation de valider définitivement la période d'essai.");
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    const targetPeriode = periodesList.find(p => p.id === periodeId);
    if (!targetPeriode) return;

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

    setSalariesList(prev => prev.map(s => {
      if (s.id === targetPeriode.salarieId) {
        let newStatut = s.statutEssai;
        let newJalon = s.jalonActuel;
        if (targetPeriode.typePeriode === 'CINQ_MOIS' || decision === 'CONFIRMATION') {
          if (decision === 'CONFIRMATION') {
            newStatut = 'CONFIRMEE';
            newJalon = 'TERMINE';
          } else if (decision === 'RENOUVELLEMENT') {
            newStatut = 'RENOUVELEE';
          } else if (decision === 'RUPTURE') {
            newStatut = 'RUPTURE';
            newJalon = 'TERMINE';
          }
        } else if (targetPeriode.typePeriode === 'DEUX_MOIS') {
          newJalon = 'CINQ_MOIS';
        }
        return {
          ...s,
          statutEssai: newStatut,
          jalonActuel: newJalon
        };
      }
      return s;
    }));

    const confirmEmail: HistoriqueEmail = {
      id: Date.now(),
      salarieId: targetPeriode.salarieId,
      salarieNom: targetPeriode.salarieNom,
      destinataire: targetPeriode.salarieEmail,
      destinataireNom: targetPeriode.salarieNom,
      roleDestinataire: 'SALARIE',
      objet: `[GROUPE PREMIUM] Notification officielle : Décision ${decision}`,
      typeEmail: 'CONFIRMATION_RH',
      dateEnvoi: today,
      heureEnvoi: new Date().toLocaleTimeString('fr-FR'),
      statut: 'DELIVRE',
      batchCron: false,
      contenuCorps: `Bonjour ${targetPeriode.salarieNom},\n\nLa Direction des Ressources Humaines de Groupe Premium vous notifie la validation officielle de votre bilan (${targetPeriode.typePeriode === 'DEUX_MOIS' ? '2 Mois' : '5 Mois'}).\n\nDécision : ${decision}\nMotif : ${motif}\n\nFélicitations pour votre engagement au sein de Groupe Premium.`
    };
    setEmails(prev => [confirmEmail, ...prev]);

    showToast(`Décision RH (${decision}) validée et notifiée.`);
  };

  const triggerCronBatch0900 = () => {
    const today = new Date().toISOString().split('T')[0];
    let emailsGenerated = 0;
    let retardsDetected = 0;

    const newlyOverduePeriodes = periodesList.filter(p => {
      return (p.statut === 'EN_ATTENTE' || p.statut === 'PLANIFIEE') && p.dateEcheance < today;
    });

    retardsDetected = newlyOverduePeriodes.length;

    if (newlyOverduePeriodes.length > 0) {
      setPeriodesList(prev => prev.map(p => {
        if (newlyOverduePeriodes.some(overdue => overdue.id === p.id)) {
          const diffDays = Math.floor((new Date(today).getTime() - new Date(p.dateEcheance).getTime()) / (1000 * 3600 * 24));
          return {
            ...p,
            statut: 'EN_RETARD',
            joursRetard: Math.max(diffDays, 3)
          };
        }
        return p;
      }));
    }

    const newCronNotif: NotificationItem = {
      id: Date.now(),
      titre: "Exécution batch 09:00:00 (Moteur Automatique)",
      message: `Cycle automatique complété : ${retardsDetected} évaluation(s) analysée(s), emails d'échéance et relances transmis.`,
      type: 'CRON_SYSTEME',
      priorite: 'BASSE',
      dateCreation: today,
      heureCreation: '09:00:00',
      estLue: false,
      cibleRole: 'ADMIN_RH',
      lienEcran: 'retards'
    };

    setNotifications(prev => [newCronNotif, ...prev]);
    showToast(`Batch automatique 09:00 exécuté avec succès.`);

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
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebar,
        directions,
        responsables,
        users,
        allSalaries: salariesList,
        salaries,
        allPeriodes: periodesList,
        periodes,
        evaluations,
        emails,
        notifications,
        addSalarie,
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
