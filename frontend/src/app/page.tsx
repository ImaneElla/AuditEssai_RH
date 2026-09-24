'use client';

import { useApp } from '@/context/AppContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import EmailModal from '@/components/EmailModal';
import DashboardScreen from '@/components/screens/DashboardScreen';
import SalariesListScreen from '@/components/screens/SalariesListScreen';
import RetardsScreen from '@/components/screens/RetardsScreen';
import AjouterSalarieScreen from '@/components/screens/AjouterSalarieScreen';
import DetailSalarieScreen from '@/components/screens/DetailSalarieScreen';
import EmailsScreen from '@/components/screens/EmailsScreen';
import PeriodesScreen from '@/components/screens/PeriodesScreen';
import FormulaireEvaluationScreen from '@/components/screens/FormulaireEvaluationScreen';

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
      case 'moteur':
        return <DashboardScreen />;
      case 'periodes':
        return <PeriodesScreen />;
      case 'formulaire-evaluation':
        return <FormulaireEvaluationScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans antialiased">
      {/* Sidebar for connected users (Admin RH and Responsable) */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <Header />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderScreen()}
          </div>
        </main>
      </div>

      {/* Global Email Preview Modal */}
      <EmailModal />
    </div>
  );
}