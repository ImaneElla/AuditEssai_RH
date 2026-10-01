'use client';

import { useApp } from '@/context/AppContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import EmailModal from '@/components/EmailModal';
import DashboardScreen from '@/components/screens/DashboardAdmin';
import SalariesListScreen from '@/components/screens/SalariesListScreen';
import RetardsScreen from '@/components/screens/RetardsScreen';
import AjouterSalarieScreen from '@/components/screens/AjouterSalarieScreen';
import DetailSalarieScreen from '@/components/screens/DetailSalarieScreen';
import EmailsScreen from '@/components/screens/EmailsScreen';
import PeriodesScreen from '@/components/screens/PeriodesScreen';
import FormulaireEvaluationScreen from '@/components/screens/FormulaireEvaluationScreen';
import AjouterResponsable from '@/components/screens/AjouterResponsable';
import GestionResponsable from '@/components/screens/GestionResponsable';
import DashboardResponsable from '@/components/screens/DashboardResponsable';
import NotificationsScreen from '@/components/screens/NotificationsScreen';
import ParametresScreen from '@/components/screens/ParametresScreen';
import AideScreen from '@/components/screens/AideScreen';

export default function Page() {
  const { currentScreen } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'salaries':
        return <SalariesListScreen />;
      case 'retards':
        return <RetardsScreen />;
      case 'ajouter-salarie':
        return <AjouterSalarieScreen />;
      case 'detail-salarie':
        return <DetailSalarieScreen />;
      case 'emails':
        return <EmailsScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'moteur':
        return <DashboardScreen />;
      case 'responsables':
      case 'gestion-responsable':
        return <GestionResponsable />;
      case 'periodes':
        return <PeriodesScreen />;
      case 'formulaire-evaluation':
        return <FormulaireEvaluationScreen />;
      case 'ajouter-responsable':
        return <AjouterResponsable />;
      case 'dashboard-responsable':
        return <DashboardResponsable />;
      case 'parametres':
        return <ParametresScreen />;
      case 'aide':
        return <AideScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="app-shell flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans antialiased print:block print:h-auto print:overflow-visible print:bg-white">
      {/* Sidebar for connected users (Admin RH and Responsable) */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 print:block print:h-auto print:overflow-visible">
        <Header />
        
        {/* Main Content Area */}
        <main className="app-main flex-1 overflow-y-auto p-6 md:p-8 bg-background print:p-0 print:overflow-visible print:h-auto print:bg-white">
          <div className="app-main-inner max-w-7xl mx-auto space-y-6 print:max-w-none print:mx-0 print:space-y-0">
            {renderScreen()}
          </div>
        </main>
      </div>

      {/* Global Email Preview Modal */}
      <EmailModal />
    </div>
  );
}