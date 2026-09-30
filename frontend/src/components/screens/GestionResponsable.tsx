"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  UserPlus,
  Search,
  Mail,
  Pencil,
  Trash2,
  LayoutList,
  LayoutGrid,
  User,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Responsable {
  id: number;
  nom: string;
  email: string;
}

interface FormState {
  prenom: string;
  nom: string;
  email: string;
}

const EMPTY_FORM: FormState = { prenom: '', nom: '', email: '' };

const INITIAL_RESPONSABLES: Responsable[] = Array.from({ length: 40 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return {
    id: i + 1,
    nom: `RESPONSABLE TEST ${n}`,
    email: `responsable${n}@example.com`
  };
});

const getInitials = (nom: string) =>
  nom
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

export default function GestionResponsable() {
  const { salaries = [], navigateTo } = useApp();

  const [responsables, setResponsables] = useState<Responsable[]>(INITIAL_RESPONSABLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [selectedResp, setSelectedResp] = useState<Responsable | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  const filteredResponsables = responsables.filter(r =>
    r.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSubs = (resp: Responsable) =>
    salaries.filter(s => s.responsableNom?.toLowerCase() === resp.nom.toLowerCase());

  const openAddModal = () => {
    setFormData(EMPTY_FORM);
    setFormError('');
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setFormData(EMPTY_FORM);
    setFormError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = formData.email.trim();
    const nomComplet = `${formData.prenom.trim()} ${formData.nom.trim()}`.trim();

    if (responsables.some(r => r.email.toLowerCase() === email.toLowerCase())) {
      setFormError('Un responsable avec cette adresse e-mail existe déjà.');
      return;
    }

    const nextId = responsables.reduce((max, r) => Math.max(max, r.id), 0) + 1;
    setResponsables(prev => [{ id: nextId, nom: nomComplet, email }, ...prev]);
    closeAddModal();
  };

  const askDelete = (resp: Responsable) => {
    setSelectedResp(resp);
    setShowDeleteModal(true);
  };

  const inputClass =
    'w-full text-xs pl-9 pr-3 py-2 bg-zinc-50/80 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white focus:outline-none transition-all';

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Gestion des Responsables
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Annuaire des responsables (Premium Africa), supervision des équipes et suivi des évaluations.
          </p>
        </div>

        <Button
          onClick={openAddModal}
          className="btn-gardient text-white shadow-2xs rounded-xl text-xs font-medium px-4 h-9 flex items-center gap-2 cursor-pointer transition-all"
        >
          <UserPlus className="w-4 h-4" strokeWidth={1.75} />
          <span>Ajouter un responsable</span>
        </Button>
      </div>

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

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-400 whitespace-nowrap">
              {filteredResponsables.length} responsable{filteredResponsables.length > 1 ? 's' : ''}
            </span>

            <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-50 p-0.5">
              <button
                type="button"
                title="Vue liste"
                aria-label="Vue liste"
                onClick={() => setViewMode('list')}
                className={`h-7 w-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-2xs text-red-600' : 'text-zinc-400 hover:text-zinc-700'
                }`}
              >
                <LayoutList className="w-4 h-4" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                title="Vue cartes"
                aria-label="Vue cartes"
                onClick={() => setViewMode('cards')}
                className={`h-7 w-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                  viewMode === 'cards' ? 'bg-white shadow-2xs text-red-600' : 'text-zinc-400 hover:text-zinc-700'
                }`}
              >
                <LayoutGrid className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>

        {filteredResponsables.length === 0 ? (
          <Card className="p-12 text-center text-xs text-zinc-500 font-medium border border-zinc-200/80 shadow-2xs">
            Aucun responsable ne correspond à votre recherche.
          </Card>
        ) : viewMode === 'list' ? (
          <Card className="overflow-hidden border border-zinc-200/80 shadow-2xs">
            <table className="w-full table-fixed text-left text-xs border-collapse">
              <colgroup>
                <col style={{ width: '28%' }} />
                <col style={{ width: '28%' }} />
                <col style={{ width: '28%' }} />
                <col style={{ width: '16%' }} />
              </colgroup>
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 whitespace-nowrap truncate">Responsable</th>
                  <th className="py-3.5 px-4 whitespace-nowrap truncate">Email</th>
                  <th className="py-3.5 px-4 whitespace-nowrap truncate">Collaborateurs rattachés</th>
                  <th className="py-3.5 px-4 whitespace-nowrap truncate text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white text-zinc-900">
                {filteredResponsables.map((resp) => {
                  const subs = getSubs(resp);

                  return (
                    <tr key={resp.id} className="hover:bg-red-50/30 transition-colors group">
                      <td className="py-3 px-4 align-middle whitespace-nowrap overflow-hidden">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 shrink-0 rounded-xl bg-zinc-100 border border-zinc-200/60 text-zinc-900 font-bold flex items-center justify-center text-[11px] group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-colors duration-300">
                            {getInitials(resp.nom)}
                          </div>
                          <span title={resp.nom} className="font-semibold tracking-tight truncate">
                            {resp.nom}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 align-middle whitespace-nowrap overflow-hidden">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span title={resp.email} className="truncate font-mono text-[11px] text-zinc-700">
                            {resp.email}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 align-middle whitespace-nowrap overflow-hidden">
                        {subs.length > 0 ? (
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            <span className="text-[11px] font-mono font-bold text-zinc-900 shrink-0">{subs.length}</span>
                            {subs.slice(0, 2).map((collab) => (
                              <span
                                key={collab.id}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-50 text-zinc-600 border border-zinc-200/60 truncate"
                              >
                                {collab.firstName} {collab.lastName}
                              </span>
                            ))}
                            {subs.length > 2 && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-100 text-zinc-500 font-medium shrink-0">
                                +{subs.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-400 italic">Aucun collaborateur rattaché</span>
                        )}
                      </td>
                      <td className="py-3 px-4 align-middle whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
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
                            onClick={() => askDelete(resp)}
                            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2.5 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResponsables.map((resp) => {
              const subs = getSubs(resp);

              return (
                <Card key={resp.id} className="p-5 rounded-2xl border border-zinc-200/80 bg-white shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-zinc-100 border border-zinc-200/60 text-zinc-900 font-bold flex items-center justify-center text-xs shadow-2xs group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-colors duration-300">
                          {getInitials(resp.nom)}
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
                      onClick={() => askDelete(resp)}
                      className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2.5 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {showAddModal && (
        <div
          onClick={closeAddModal}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/20 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-md w-full p-6 space-y-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-zinc-900">Ajouter un responsable</h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Créer un profil de Responsable N+1 pour la gestion des évaluations d&apos;équipe.
                </p>
              </div>
              <button
                type="button"
                aria-label="Fermer"
                onClick={closeAddModal}
                className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="prenom" className="text-xs font-medium text-zinc-900">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                    <input
                      id="prenom"
                      type="text"
                      name="prenom"
                      required
                      placeholder="e.g. Thomas"
                      value={formData.prenom}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="nom" className="text-xs font-medium text-zinc-900">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                    <input
                      id="nom"
                      type="text"
                      name="nom"
                      required
                      placeholder="e.g. Bernard"
                      value={formData.nom}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-medium text-zinc-900">
                  Adresse e-mail du Responsable <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    placeholder="responsable@premium.africa"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                {formError && (
                  <p className="text-[11px] text-red-600 font-medium">{formError}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={closeAddModal}
                  className="rounded-xl text-xs cursor-pointer"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="btn-gardient text-white rounded-xl text-xs cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Enregistrer le responsable
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

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