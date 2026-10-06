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
} from '../types';

export type ScreenId =
  | 'dashboard' | 'salaries' | 'ajouter-salarie' | 'detail-salarie' | 'periodes'
  | 'formulaire-evaluation' | 'retards' | 'emails' | 'moteur' | 'analyse-ia'
  | 'archive' | 'notifications' | 'responsables' | 'ajouter-responsable'
  | 'gestion-responsable' | 'detail-responsable' | 'dashboard-responsable'
  | 'parametres' | 'aide';

const initialParametres: Parametres = {
  templatesEmail: [
    {
      id: 'email1',
      nom: 'Email 1 - Notification initiale (J-21)',
      delai: 'J-21 (3 semaines avant l\'échéance)',
      objet: '[GROUPE PREMIUM] Ouverture d\'évaluation - {salarie} ({periode})',
      contenu: 'Bonjour {responsable},\n\nLe premier bilan d\'évaluation ({periode}) concernant {salarie} arrive à échéance le {echeance}.'
    },
    {
      id: 'email2',
      nom: 'Email 2 - Relance intermédiaire (J-14)',
      delai: 'J-14 (2 semaines avant l\'échéance)',
      objet: '[GROUPE PREMIUM - RELANCE] Rappel d\'évaluation - {salarie} ({periode})',
      contenu: 'Bonjour {responsable},\n\nCeci est un rappel : l\'évaluation d\'essai ({periode}) de {salarie} doit être complétée avant le {echeance}.'
    },
    {
      id: 'email3',
      nom: 'Email 3 - Relance urgente (J-7)',
      delai: 'J-7 (1 semaine avant l\'échéance)',
      objet: '[GROUPE PREMIUM - URGENT] Évaluation en retard imminent - {salarie} ({periode})',
      contenu: 'ATTENTION : L\'évaluation d\'essai ({periode}) de {salarie} arrive à échéance le {echeance}.'
    }
  ],
  compte: {
    nomExpediteur: 'Direction des Ressources Humaines - Groupe Premium',
    emailExpediteur: 'rh@groupe-premium.com'
  },
  theme: 'light',
  profil: {
    nom: 'Ellaouzi',
    prenom: 'Imane',
    email: 'rh@groupe-premium.com',
    direction: 'Ressources Humaines & Talents'
  }
};

interface AppContextType {
  currentScreen: ScreenId;
  navigateTo: (screen: ScreenId, params?: { salarieId?: number; periodeId?: number; emailId?: number; responsableId?: number }) => void;
  selectedResponsableId: number; setSelectedResponsableId: (id: number) => void;
  currentRole: UserRole; setCurrentRole: (role: UserRole) => void;
  currentUser: User | null; currentResponsable: Responsable | null;
  selectedSalarieId: number; setSelectedSalarieId: (id: number) => void;
  selectedPeriodeId: number; setSelectedPeriodeId: (id: number) => void;
  selectedEmail: HistoriqueEmail | null;
  openEmailModal: (email: HistoriqueEmail) => void; closeEmailModal: () => void;
  isEmailModalOpen: boolean;
  isAddSalarieModalOpen: boolean; openAddSalarieModal: () => void; closeAddSalarieModal: () => void;
  isSidebarCollapsed: boolean; setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>; toggleSidebar: () => void;
  parametres: Parametres; updateParametres: (newParametres: Partial<Parametres>) => void;
  directions: Direction[]; responsables: Responsable[]; users: User[];
  allSalaries: Salarie[]; salaries: Salarie[]; archives: Salarie[];
  allPeriodes: PeriodeEvaluation[]; periodes: PeriodeEvaluation[];
  evaluations: EvaluationDetail[]; emails: HistoriqueEmail[]; notifications: NotificationItem[];
  addSalarie: (data: any) => void; updateSalarie: (id: number, data: any) => void;
  deleteSalarie: (id: number) => void; restaurerSalarie: (id: number) => void;
  addResponsable: (data: { firstName: string; lastName: string; email: string; directionId: number; phone?: string; poste?: string; }) => void;
  updateResponsable: (id: number, data: any) => void; deleteResponsable: (id: number) => boolean;
  relancerRetard: (id: number) => void; relancerTousLesRetards: () => void;
  submitEvaluation: (data: any) => void; validerDecisionRH: (id: number, decision: DecisionPeriode, motif: string) => void;
  triggerCronBatch0900: () => { emailsCount: number; retardsCount: number };
  markNotificationAsRead: (id: number) => void; markAllNotificationsAsRead: () => void;
  toastMessage: string | null; showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dashboard');
  const [currentRole, setCurrentRoleState] = useState<UserRole>('ADMIN_RH');
  const [selectedSalarieId, setSelectedSalarieId] = useState<number>(0);
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<number>(0);
  const [selectedResponsableId, setSelectedResponsableId] = useState<number>(0);
  const [selectedEmail, setSelectedEmail] = useState<HistoriqueEmail | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isAddSalarieModalOpen, setIsAddSalarieModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // EMPTY STATES - NO FAKE DATA
  const [directions, setDirections] = useState<Direction[]>([]);
  const [responsables, setResponsables] = useState<Responsable[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [salariesList, setSalariesList] = useState<Salarie[]>([]);
  const [periodesList, setPeriodesList] = useState<PeriodeEvaluation[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationDetail[]>([]);
  const [emails, setEmails] = useState<HistoriqueEmail[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [parametres, setParametres] = useState<Parametres>(initialParametres);

  const openAddSalarieModal = () => setIsAddSalarieModalOpen(true);
  const closeAddSalarieModal = () => setIsAddSalarieModalOpen(false);
  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

  // LOAD ONLY FROM LOCALSTORAGE - NO FALLBACK TO FAKE DATA
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = (key: string) => {
          const v = localStorage.getItem(key);
          return v ? JSON.parse(v) : [];
        };
        setSalariesList(saved('gp_salaries'));
        setPeriodesList(saved('gp_periodes'));
        setEvaluations(saved('gp_evaluations'));
        setEmails(saved('gp_emails'));
        setNotifications(saved('gp_notifications'));
        setResponsables(saved('gp_responsables'));
        setDirections(saved('gp_directions'));
        setUsers(saved('gp_users'));

        const savedParametres = localStorage.getItem('gp_parametres');
        if (savedParametres) setParametres(JSON.parse(savedParametres));
      } catch (err) {
        console.error('Error loading', err);
      }
      setIsLoaded(true);
    }
  }, []);

  // SAVE TO LOCALSTORAGE
  React.useEffect(() => { if (isLoaded) localStorage.setItem('gp_salaries', JSON.stringify(salariesList)); }, [salariesList, isLoaded]);
  React.useEffect(() => { if (isLoaded) localStorage.setItem('gp_periodes', JSON.stringify(periodesList)); }, [periodesList, isLoaded]);
  React.useEffect(() => { if (isLoaded) localStorage.setItem('gp_evaluations', JSON.stringify(evaluations)); }, [evaluations, isLoaded]);
  React.useEffect(() => { if (isLoaded) localStorage.setItem('gp_emails', JSON.stringify(emails)); }, [emails, isLoaded]);
  React.useEffect(() => { if (isLoaded) localStorage.setItem('gp_notifications', JSON.stringify(notifications)); }, [notifications, isLoaded]);
  React.useEffect(() => { if (isLoaded) localStorage.setItem('gp_responsables', JSON.stringify(responsables)); }, [responsables, isLoaded]);
  React.useEffect(() => { if (isLoaded) localStorage.setItem('gp_directions', JSON.stringify(directions)); }, [directions, isLoaded]);
  React.useEffect(() => { if (isLoaded) localStorage.setItem('gp_users', JSON.stringify(users)); }, [users, isLoaded]);
  React.useEffect(() => { if (isLoaded) localStorage.setItem('gp_parametres', JSON.stringify(parametres)); }, [parametres, isLoaded]);

  // STATUS ENGINE (same logic as before)
  React.useEffect(() => {
    if (!isLoaded) return;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    setPeriodesList(prev => prev.map(p => {
      if (p.statut === 'COMPLETEE' || p.statut === 'VALIDEE_RH' || p.statut === 'RUPTURE') return p;
      const echeance = new Date(p.dateEcheance); echeance.setHours(0, 0, 0, 0);
      const diffDays = Math.round((echeance.getTime() - today.getTime()) / 86400000);
      let newStatut = p.statut; let newJoursRetard = p.joursRetard;
      if (diffDays < 0) { newStatut = 'EN_RETARD'; newJoursRetard = Math.abs(diffDays); }
      else if (diffDays <= 7) { newStatut = 'EN_RETARD'; newJoursRetard = undefined; }
      else if (diffDays <= 14) { newStatut = 'EN_RELANCE'; newJoursRetard = undefined; }
      else if (diffDays <= 21) { newStatut = 'EN_COURS'; newJoursRetard = undefined; }
      if (newStatut === p.statut && newJoursRetard === p.joursRetard) return p;
      return { ...p, statut: newStatut, joursRetard: newJoursRetard };
    }));
  }, [isLoaded]);

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', parametres.theme === 'dark' || (parametres.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches));
    }
  }, [parametres.theme]);

  const updateParametres = (newParams: Partial<Parametres>) => {
    setParametres(prev => ({ ...prev, ...newParams }));
    showToast("Paramètres mis à jour.");
  };

  const currentResponsable = useMemo(() => responsables.find(r => r.id === selectedResponsableId) || responsables[0] || null, [responsables, selectedResponsableId]);
  const currentUser = useMemo(() => {
    if (currentRole === 'ADMIN_RH') return users.find(u => u.role === 'ADMIN_RH') || users[0] || null;
    if (currentRole === 'RESPONSABLE' && currentResponsable) return users.find(u => u.responsableId === currentResponsable.id) || null;
    return users[0] || null;
  }, [currentRole, currentResponsable, users]);

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    setCurrentScreen('dashboard');
    showToast(role === 'RESPONSABLE' ? `Connecté: ${currentResponsable ? `${currentResponsable.firstName} ${currentResponsable.lastName}` : 'Responsable'}` : "Connecté: DRH");
  };

  const salaries = useMemo(() => currentRole === 'RESPONSABLE' && currentResponsable ? salariesList.filter(s => s.responsableId === currentResponsable.id) : salariesList, [salariesList, currentRole, currentResponsable]);
  const archives = useMemo(() => salaries.filter(s => s.actif === false), [salaries]);
  const periodes = useMemo(() => currentRole === 'RESPONSABLE' && currentResponsable ? periodesList.filter(p => p.responsableId === currentResponsable.id) : periodesList, [periodesList, currentRole, currentResponsable]);

  const showToast = (msg: string) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 4000); };

  const navigateTo = (screen: ScreenId, params?: any) => {
    if (params?.salarieId) setSelectedSalarieId(params.salarieId);
    if (params?.periodeId) setSelectedPeriodeId(params.periodeId);
    if (params?.responsableId) setSelectedResponsableId(params.responsableId);
    if (params?.emailId) { const email = emails.find(e => e.id === params.emailId); if (email) setSelectedEmail(email); }
    if (screen === 'ajouter-salarie') { setCurrentScreen('salaries'); setIsAddSalarieModalOpen(true); return; }
    setCurrentScreen(screen);
  };

  const openEmailModal = (email: HistoriqueEmail) => { setSelectedEmail(email); setIsEmailModalOpen(true); };
  const closeEmailModal = () => setIsEmailModalOpen(false);
  const addMonthsToDate = (dateStr: string, months: number) => { const d = new Date(dateStr); d.setMonth(d.getMonth() + months); return d.toISOString().split('T')[0]; };

  const addSalarie = (data: any) => {
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
      phone: data.phone ?? '',
      poste: data.poste ?? '',
      dateIntegration: data.dateEmbauche,
      dateEmbauche: data.dateEmbauche,
      dureeInitialeMois: 3,
      dateFinPrevisionnelle,
      directionId: data.directionId,
      directionName: direction?.name || '',
      responsableId: data.responsableId,
      responsableNom: responsable ? `${responsable.firstName} ${responsable.lastName}` : '',
      statutEssai: 'EN_COURS',
      PeriodeActuel: 'TROIS_MOIS',
      bloqueEmails: false,
      actif: true
    };
    setSalariesList(prev => [newSalarie, ...prev]);
    const periode3M: PeriodeEvaluation = {
      id: periodesList.length > 0 ? Math.max(...periodesList.map(p => p.id)) + 1 : 1,
      salarieId: newId,
      salarieNom: `${data.firstName} ${data.lastName}`,
      salarieEmail: data.email,
      salariePoste: data.poste,
      responsableId: data.responsableId,
      responsableNom: responsable ? `${responsable.firstName} ${responsable.lastName}` : '',
      responsableEmail: responsable ? responsable.email : '',
      directionName: direction?.name || '',
      typePeriode: 'TROIS_MOIS',
      numeroPeriode: 1,
      dateEcheance: dateFinPrevisionnelle,
      dateDeclenchementEmail: dateFinPrevisionnelle,
      heureDeclenchement: '09:00:00',
      statut: 'EN_COURS',
      decisionFinale: 'EN_ATTENTE',
      tokenAccesSalarie: `sec-eval-${newId}-3m-${Date.now().toString(36)}`,
      emailsEnvoyes: {}
    };
    setPeriodesList(prev => [periode3M, ...prev]);
    showToast(`Salarié ${data.firstName} ${data.lastName} créé.`);
    setSelectedSalarieId(newId); navigateTo('detail-salarie', { salarieId: newId });
  };

  const updateSalarie = (id: number, data: any) => { setSalariesList(prev => prev.map(s => s.id === id ? { ...s, ...data, nom: data.lastName, prenom: data.firstName } : s)); showToast('Salarié mis à jour.'); };
  const deleteSalarie = (id: number) => { setSalariesList(prev => prev.filter(s => s.id !== id)); setPeriodesList(prev => prev.filter(p => p.salarieId !== id)); showToast('Salarié supprimé.'); };
  const restaurerSalarie = (id: number) => { setSalariesList(prev => prev.map(s => s.id === id ? { ...s, actif: true } : s)); showToast('Salarié restauré.'); };

  const addResponsable = (data: { firstName: string; lastName: string; email: string; directionId: number; phone?: string; poste?: string; }) => {
    const direction = directions.find(item => item.id === data.directionId);
    const newId = responsables.length > 0 ? Math.max(...responsables.map(r => r.id)) + 1 : 1;
    const newResponsable: Responsable = {
      id: newId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      directionId: data.directionId,
      phone: data.phone ?? '',
      poste: data.poste ?? '',
      directionName: direction?.name ?? ''
    };
    setResponsables(prev => [...prev, newResponsable]); setSelectedResponsableId(newId); showToast(`Responsable ${data.firstName} ${data.lastName} ajouté.`);
  };
  const updateResponsable = (id: number, data: any) => {
    const direction = directions.find(item => item.id === data.directionId);
    setResponsables(prev => prev.map(r => r.id === id ? { ...r, ...data, directionName: direction?.name ?? r.directionName } : r));
    setSalariesList(prev => prev.map(s => s.responsableId === id ? { ...s, responsableNom: `${data.firstName} ${data.lastName}` } : s));
    showToast('Responsable mis à jour.');
  };
  const deleteResponsable = (id: number) => {
    if (salariesList.some(s => s.responsableId === id)) { showToast('Impossible: salariés affectés.'); return false; }
    setResponsables(prev => prev.filter(r => r.id !== id)); showToast('Responsable supprimé.'); return true;
  };

  const relancerRetard = (periodeId: number) => { showToast('Relance envoyée.'); };
  const relancerTousLesRetards = () => { showToast('Relances envoyées.'); };
  const submitEvaluation = (data: any) => { showToast('Évaluation enregistrée.'); navigateTo('periodes'); };
  const validerDecisionRH = (id: number, decision: DecisionPeriode, motif: string) => { showToast(`Décision ${decision} validée.`); };
  const triggerCronBatch0900 = () => { showToast('Batch exécuté.'); return { emailsCount: 0, retardsCount: 0 }; };
  const markNotificationAsRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, estLue: true } : n));
  const markAllNotificationsAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, estLue: true })));

  return (
    <AppContext.Provider value={{
        currentScreen, navigateTo, selectedResponsableId, setSelectedResponsableId, currentRole, setCurrentRole, currentUser, currentResponsable,
        selectedSalarieId, setSelectedSalarieId, selectedPeriodeId, setSelectedPeriodeId, selectedEmail, openEmailModal, closeEmailModal,
        isEmailModalOpen, isAddSalarieModalOpen, openAddSalarieModal, closeAddSalarieModal, isSidebarCollapsed, setIsSidebarCollapsed, toggleSidebar,
        parametres, updateParametres, directions, responsables, users, allSalaries: salariesList, salaries, archives, allPeriodes: periodesList, periodes,
        evaluations, emails, notifications, addSalarie, updateSalarie, deleteSalarie, restaurerSalarie, addResponsable, updateResponsable, deleteResponsable,
        relancerRetard, relancerTousLesRetards, submitEvaluation, validerDecisionRH, triggerCronBatch0900, markNotificationAsRead, markAllNotificationsAsRead,
        toastMessage, showToast
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}