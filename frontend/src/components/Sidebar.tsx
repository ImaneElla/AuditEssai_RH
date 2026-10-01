/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from 'react';
import { useApp, ScreenId } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CalendarCheck,
  AlertTriangle,
  Bell,
  Briefcase,
  ShieldCheck,
  ChevronRight,
  PanelLeft,
  Settings,
  Info
} from 'lucide-react';
import Image from 'next/image';

export default function Sidebar() {
  const {
    currentScreen,
    navigateTo,
    periodes,
    salaries,
    notifications,
    currentRole,
    isSidebarCollapsed,
    toggleSidebar
  } = useApp();

  const [isAdminOpen] = useState(true);

  const isRH = currentRole === 'ADMIN_RH';
  const retardsCount = periodes.filter(p => p.statut === 'EN_RETARD').length;
  const unreadNotifsCount = notifications.filter(n => !n.estLue).length;
  const enCoursCount = salaries.filter(s => s.statutEssai === 'EN_COURS' || s.statutEssai === 'RENOUVELEE').length;

  const primaryItems = [
    { id: 'dashboard', label: isRH ? 'Tableau de Bord RH' : 'Tableau de Bord', icon: LayoutDashboard, roleVisibility: ['ADMIN_RH', 'RESPONSABLE'] },
    { id: 'salaries', label: isRH ? 'Gestion des salariés' : 'Mes salariés affectés', icon: Users, badge: isRH ? enCoursCount : salaries.length, roleVisibility: ['ADMIN_RH', 'RESPONSABLE'] },
    { id: 'gestion-responsable', label: 'Gestion des responsables', icon: Briefcase, roleVisibility: ['ADMIN_RH'] },
    { id: 'periodes', label: isRH ? 'Périodes d\'évaluation' : 'Évaluations à réaliser', icon: CalendarCheck, roleVisibility: ['ADMIN_RH', 'RESPONSABLE'] },
    { id: 'retards', label: isRH ? 'Suivi des retards' : 'Retards équipe', icon: AlertTriangle, badge: retardsCount > 0 ? `${retardsCount}` : undefined, badgeVariant: 'destructive', roleVisibility: ['ADMIN_RH', 'RESPONSABLE'] },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined, badgeVariant: 'destructive', roleVisibility: ['ADMIN_RH', 'RESPONSABLE'] },
    { id: 'parametres', label: 'Paramètres', icon: Settings, roleVisibility: ['ADMIN_RH', 'RESPONSABLE'] },
    { id: 'aide', label: 'Aide & Support', icon: Info, roleVisibility: ['ADMIN_RH', 'RESPONSABLE'] }
  ] as any;

  const adminItems: { id: ScreenId; label: string; icon: typeof UserPlus }[] = [
  ];

  const renderItem = (item: any) => {
    const isActive = currentScreen === item.id;
    const Icon = item.icon;
    return (
      <button
        key={item.id}
        onClick={() => navigateTo(item.id)}
        title={isSidebarCollapsed ? item.label : undefined}
        className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'} rounded-xl text-sm font-medium transition-all duration-200 group cursor-pointer relative overflow-hidden
          ${isActive
            ? 'bg-gradient-to-br from-[#A50000] via-[#8B0000] to-[#5C0000] text-white shadow-[0_4px_18px_rgba(139,0,0,0.35)] border border-[#8B0000]'
            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 border border-transparent'
          }`}
      >
        {isActive && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.14] via-transparent to-black/15 pointer-events-none" />
            <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none" />
          </>
        )}

        <div className={`flex items-center ${isSidebarCollapsed ? '' : 'gap-3'} relative z-10`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all relative
            ${isActive ? 'bg-gradient-to-br from-white/20 to-white/5 text-white border border-white/10' : 'bg-white border border-zinc-200 text-zinc-500 group-hover:text-[#8B0000] group-hover:border-[#8B0000]/20'}`}>
            <Icon className="w-4 h-4" strokeWidth={isActive ? 2.2 : 1.75} />
            {isSidebarCollapsed && item.badge && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">{typeof item.badge === 'number' && item.badge > 9 ? '9+' : item.badge}</span>
            )}
          </div>
          {!isSidebarCollapsed && <span className="tracking-tight truncate">{item.label}</span>}
        </div>

        {!isSidebarCollapsed && (
          <div className="flex items-center gap-1.5 relative z-10">
            {item.badge !== undefined && (
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium border
                ${isActive
                  ? 'bg-white/20 text-white border-white/10 backdrop-blur-sm'
                  : item.badgeVariant === 'destructive'
                    ? 'bg-gradient-to-br from-red-50 to-red-100 text-red-700 border-red-200'
                    : 'bg-zinc-100 text-zinc-600 border-zinc-200 group-hover:bg-gradient-to-br group-hover:from-[#8B0000] group-hover:to-[#5C0000] group-hover:text-white group-hover:border-[#8B0000]'
                }`}>
                {item.badge}
              </span>
            )}
            {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/60" strokeWidth={2.5} />}
          </div>
        )}
      </button>
    );
  };

  return (
    <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-white dark:bg-[#000000] text-zinc-900 dark:text-white border-r border-zinc-200/80 dark:border-white/10 flex flex-col shrink-0 h-screen sticky top-0 select-none font-sans overflow-hidden transition-all duration-300 print:hidden`}>

      {/* Brand Header */}
      <div className={`p-3.5 border-b border-zinc-200/60 dark:border-white/10 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
        {isSidebarCollapsed ? (
          <div onClick={() => navigateTo('dashboard')} className="w-11 h-11 rounded-xl bg-gradient-to-br from-white to-zinc-50 dark:from-[#1c1c1e] dark:to-[#2c2c2e] border border-zinc-200 dark:border-white/10 shadow-sm flex items-center justify-center p-1.5 cursor-pointer hover:border-[#8B0000]/30 hover:shadow-md transition-all">
            <Image src="/logo-groupe-premium.png" alt="GP" width={36} height={36} className="object-contain" priority />
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div onClick={() => navigateTo('dashboard')} className="p-1 flex items-center cursor-pointer ml-10">
              <Image src="/logo-groupe-premium.png" alt="Groupe Premium" width={132} height={30} className="object-contain" priority />
            </div>
            <button onClick={toggleSidebar} className="w-8 h-8 rounded-lg text-zinc-400 dark:text-zinc-400 hover:text-white hover:bg-gradient-to-br hover:from-[#8B0000] hover:to-[#5C0000] flex items-center justify-center cursor-pointer transition-all">
              <PanelLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Role */}
      <div className={`px-3 py-2.5 bg-gradient-to-r from-zinc-50 to-zinc-50/40 dark:from-[#1c1c1e]/80 dark:to-[#1c1c1e]/40 border-b border-zinc-200/60 dark:border-white/10 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${isRH ? 'bg-gradient-to-br from-[#8B0000] to-[#5C0000] border border-[#8B0000]/40' : 'bg-white dark:bg-[#2c2c2e] border border-zinc-200 dark:border-white/10'}`}>
            {isRH ? <ShieldCheck className="w-4 h-4 text-white" /> : <Briefcase className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />}
          </div>
          {!isSidebarCollapsed && (
            <div>
              <span className="text-zinc-500 dark:text-zinc-400 text-[10px] block leading-none font-medium">Rôle Connecté</span>
              <span className="font-semibold text-zinc-900 dark:text-white text-xs">{isRH ? 'DRH / Admin' : 'Responsable'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {!isSidebarCollapsed && <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">General</div>}

        {primaryItems.filter((item: any) => item.roleVisibility.includes(isRH ? 'ADMIN_RH' : 'RESPONSABLE')).map(renderItem)}

        {isRH && (
          <>
            {isAdminOpen && (
              <div className="space-y-1">
                {adminItems.map(renderItem)}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer User */}
      <div className={`p-3 border-t border-zinc-200/60 dark:border-white/10 bg-white dark:bg-[#000000] flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A50000] to-[#5C0000] text-white font-bold flex items-center justify-center text-xs shadow-sm shadow-[#8B0000]/20">
            {isRH ? 'IE' : 'MD'}
          </div>
          {!isSidebarCollapsed && (
            <div>
              <p className="font-semibold text-zinc-900 dark:text-white text-sm">{isRH ? 'Imane Ellaouzi' : 'Marc Delattre'}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{isRH ? 'DRH Groupe Premium' : 'Responsable'}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}