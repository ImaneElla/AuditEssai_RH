"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../ui/stat-card';
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  UserPlus, 
  Search, 
  Mail, 
  Pencil, 
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// --- Données des Responsables ---
const INITIAL_RESPONSABLES = [
  { id: 1, nom: "RESPONSABLE TEST 01", email: "responsable01@example.com" },
  { id: 2, nom: "RESPONSABLE TEST 02", email: "responsable02@example.com" },
  { id: 3, nom: "RESPONSABLE TEST 03", email: "responsable03@example.com" },
  { id: 4, nom: "RESPONSABLE TEST 04", email: "responsable04@example.com" },
  { id: 5, nom: "RESPONSABLE TEST 05", email: "responsable05@example.com" },
  { id: 6, nom: "RESPONSABLE TEST 06", email: "responsable06@example.com" },
  { id: 7, nom: "RESPONSABLE TEST 07", email: "responsable07@example.com" },
  { id: 8, nom: "RESPONSABLE TEST 08", email: "responsable08@example.com" },
  { id: 9, nom: "RESPONSABLE TEST 09", email: "responsable09@example.com" },
  { id: 10, nom: "RESPONSABLE TEST 10", email: "responsable10@example.com" },
  { id: 11, nom: "RESPONSABLE TEST 11", email: "responsable11@example.com" },
  { id: 12, nom: "RESPONSABLE TEST 12", email: "responsable12@example.com" },
  { id: 13, nom: "RESPONSABLE TEST 13", email: "responsable13@example.com" },
  { id: 14, nom: "RESPONSABLE TEST 14", email: "responsable14@example.com" },
  { id: 15, nom: "RESPONSABLE TEST 15", email: "responsable15@example.com" },
  { id: 16, nom: "RESPONSABLE TEST 16", email: "responsable16@example.com" },
  { id: 17, nom: "RESPONSABLE TEST 17", email: "responsable17@example.com" },
  { id: 18, nom: "RESPONSABLE TEST 18", email: "responsable18@example.com" },
  { id: 19, nom: "RESPONSABLE TEST 19", email: "responsable19@example.com" },
  { id: 20, nom: "RESPONSABLE TEST 20", email: "responsable20@example.com" },
  { id: 21, nom: "RESPONSABLE TEST 21", email: "responsable21@example.com" },
  { id: 22, nom: "RESPONSABLE TEST 22", email: "responsable22@example.com" },
  { id: 23, nom: "RESPONSABLE TEST 23", email: "responsable23@example.com" },
  { id: 24, nom: "RESPONSABLE TEST 24", email: "responsable24@example.com" },
  { id: 25, nom: "RESPONSABLE TEST 25", email: "responsable25@example.com" },
  { id: 26, nom: "RESPONSABLE TEST 26", email: "responsable26@example.com" },
  { id: 27, nom: "RESPONSABLE TEST 27", email: "responsable27@example.com" },
  { id: 28, nom: "RESPONSABLE TEST 28", email: "responsable28@example.com" },
  { id: 29, nom: "RESPONSABLE TEST 29", email: "responsable29@example.com" },
  { id: 30, nom: "RESPONSABLE TEST 30", email: "responsable30@example.com" },
  { id: 31, nom: "RESPONSABLE TEST 31", email: "responsable31@example.com" },
  { id: 32, nom: "RESPONSABLE TEST 32", email: "responsable32@example.com" },
  { id: 33, nom: "RESPONSABLE TEST 33", email: "responsable33@example.com" },
  { id: 34, nom: "RESPONSABLE TEST 34", email: "responsable34@example.com" },
  { id: 35, nom: "RESPONSABLE TEST 35", email: "responsable35@example.com" },
  { id: 36, nom: "RESPONSABLE TEST 36", email: "responsable36@example.com" },
  { id: 37, nom: "RESPONSABLE TEST 37", email: "responsable37@example.com" },
  { id: 38, nom: "RESPONSABLE TEST 38", email: "responsable38@example.com" },
  { id: 39, nom: "RESPONSABLE TEST 39", email: "responsable39@example.com" },
  { id: 40, nom: "RESPONSABLE TEST 40", email: "responsable40@example.com" },
];

export default function GestionResponsable() {
  const { salaries = [], periodes = [], navigateTo } = useApp();

  const [responsables, setResponsables] = useState(INITIAL_RESPONSABLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResp, setSelectedResp] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // KPIs
  const aFaire = periodes.filter(p => p.statut === 'EN_COURS' || p.statut === 'A_TRAITER');
  const soumises = periodes.filter(p => p.statut === 'COMPLETEE' || p.statut === 'VALIDEE_RH');
  const retards = periodes.filter(p => p.statut === 'EN_RETARD');

  const filteredResponsables = responsables.filter(r => 
    r.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Gestion des Responsables
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Annuaire des responsables (Premium Africa), supervision des équipes et suivi des évaluations.
          </p>
        </div>

        {/* Navigation directe vers la section Ajouter un Responsable */}
        <Button 
          onClick={() => navigateTo('ajouter-responsable')}
          className=" text-white shadow-2xs rounded-xl text-xs font-medium px-4 h-9 flex items-center gap-2 cursor-pointer transition-all"
        >
          <UserPlus className="w-4 h-4" strokeWidth={1.75} />
          <span>Ajouter un responsable</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Mes salariés"
          value={salaries.length}
          description="collaborateurs affectés"
          icon={Users}
          status="Équipe"
          onClick={() => navigateTo("salaries")}
          accent="red"
        />

        <StatCard
          title="Évaluations à faire"
          value={aFaire.length}
          description="jalons 2M et 5M"
          icon={Clock}
          status="À traiter"
          onClick={() => navigateTo("periodes")}
          accent="red"
        />

        <StatCard
          title="Évaluations soumises"
          value={soumises.length}
          description="transmises à la RH"
          icon={CheckCircle2}
          status="Soumis"
          onClick={() => navigateTo("periodes")}
          accent="red"
        />

        <StatCard
          title="Retards équipe"
          value={retards.length}
          description={
            retards.length > 0
              ? "actions à régulariser"
              : "aucun retard signalé"
          }
          icon={AlertTriangle}
          status={retards.length > 0 ? "À régulariser" : "À jour"}
          onClick={() => navigateTo("retards")}
          accent={retards.length > 0 ? "red" : "green"}
        />
      </div>

      {/* Annuaire */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-zinc-50/80 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 focus:bg-white transition-all text-zinc-900 placeholder:text-zinc-400"
            />
          </div>

          <span className="text-xs font-mono text-zinc-400">
            {filteredResponsables.length} responsable{filteredResponsables.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Responsables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResponsables.map((resp) => {
            const subs = salaries.filter(s => s.responsableNom?.toLowerCase() === resp.nom.toLowerCase());
            
            return (
              <Card key={resp.id} className="p-5 rounded-2xl border border-zinc-200/80 bg-white shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-zinc-100 border border-zinc-200/60 text-zinc-900 font-bold flex items-center justify-center text-xs shadow-2xs group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-colors duration-300">
                        {resp.nom.split(' ').slice(0, 2).map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-zinc-900 tracking-tight leading-tight">
                          {resp.nom}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="py-3 border-y border-zinc-100">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate font-mono text-[11px] text-zinc-700">{resp.email}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-zinc-600 text-[11px]">Collaborateurs rattachés</span>
                      <span className="text-[11px] font-mono font-bold text-zinc-900">{subs.length}</span>
                    </div>

                    {subs.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {subs.slice(0, 2).map((collab) => (
                          <span key={collab.id} className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-50 text-zinc-600 border border-zinc-200/60">
                            {collab.firstName} {collab.lastName}
                          </span>
                        ))}
                        {subs.length > 2 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-100 text-zinc-500 font-medium">
                            +{subs.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-[10px] text-zinc-400 italic">Aucun collaborateur rattaché</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigateTo('ajouter-responsable')}
                    className="text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 h-8 px-2.5 rounded-lg cursor-pointer flex items-center gap-1"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Modifier</span>
                  </Button>

                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => { setSelectedResp(resp); setShowDeleteModal(true); }}
                    className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2.5 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modal Suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/20 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-semibold tracking-tight text-zinc-900">Supprimer le responsable</h3>
            </div>
            <p className="text-xs text-zinc-500">
              Êtes-vous sûr de vouloir supprimer <strong className="text-zinc-900">{selectedResp?.nom}</strong> ({selectedResp?.email}) ?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setShowDeleteModal(false); setSelectedResp(null); }}
                className="rounded-xl text-xs cursor-pointer"
              >
                Annuler
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setResponsables(prev => prev.filter(r => r.id !== selectedResp?.id));
                  setShowDeleteModal(false);
                  setSelectedResp(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs cursor-pointer"
              >
                Confirmer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}