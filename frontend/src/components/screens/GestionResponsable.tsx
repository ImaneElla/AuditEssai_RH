"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Responsable } from '../../types';
import {
  AlertTriangle,
  UserPlus,
  Search,
  Mail,
  Building2,
  Pencil,
  Trash2,
  LayoutList,
  LayoutGrid,
  User,
  X,
  CheckCircle2,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FormState {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  directionId: number;
}

const EMPTY_FORM: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  directionId: 1
};

const getInitials = (firstName: string, lastName: string) => {
  const f = firstName ? firstName[0] : '';
  const l = lastName ? lastName[0] : '';
  return (f + l).toUpperCase() || 'R';
};

export default function GestionResponsable() {
  const {
    responsables = [],
    salaries = [],
    directions = [],
    addResponsable,
    updateResponsable,
    deleteResponsable
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [selectedResp, setSelectedResp] = useState<Responsable | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  const filteredResponsables = responsables.filter((r) => {
    const fullName = `${r.firstName || ''} ${r.lastName || ''}`.toLowerCase();
    const query = searchTerm.toLowerCase();
    return (
      fullName.includes(query) ||
      (r.email || '').toLowerCase().includes(query) ||
      (r.directionName || '').toLowerCase().includes(query)
    );
  });

  const getSubs = (resp: Responsable) =>
    salaries.filter(
      (s) =>
        s.responsableId === resp.id ||
        (s.responsableNom &&
          s.responsableNom.toLowerCase() === `${resp.firstName} ${resp.lastName}`.toLowerCase())
    );

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({
      ...EMPTY_FORM,
      directionId: directions.length > 0 ? directions[0].id : 1
    });
    setFormError('');
    setShowFormModal(true);
  };

  const openEditModal = (resp: Responsable) => {
    setIsEditing(true);
    setFormData({
      id: resp.id,
      firstName: resp.firstName,
      lastName: resp.lastName,
      email: resp.email,
      directionId: resp.directionId || (directions.length > 0 ? directions[0].id : 1)
    });
    setFormError('');
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setFormData(EMPTY_FORM);
    setFormError('');
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'directionId' ? Number(value) : value
    }));
    if (formError) setFormError('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = formData.email.trim();
    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();

    if (!firstName || !lastName || !email) {
      setFormError('Veuillez renseigner le nom, prénom et une adresse e-mail valide.');
      return;
    }

    const exists = responsables.some(
      (r) => r.email.toLowerCase() === email.toLowerCase() && (!isEditing || r.id !== formData.id)
    );
    if (exists) {
      setFormError('Un responsable avec cette adresse e-mail existe déjà.');
      return;
    }

    if (isEditing && formData.id) {
      updateResponsable(formData.id, {
        firstName,
        lastName,
        email,
        directionId: formData.directionId
      });
    } else {
      addResponsable({
        firstName,
        lastName,
        email,
        directionId: formData.directionId
      });
    }

    closeFormModal();
  };

  const askDelete = (resp: Responsable) => {
    setSelectedResp(resp);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!selectedResp) return;
    deleteResponsable(selectedResp.id);
    setShowDeleteModal(false);
    setSelectedResp(null);
  };

  const inputClass =
    'w-full text-xs pl-9 pr-3 py-2 bg-zinc-50/80 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none transition-all';

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Gestion des Responsables
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Annuaire des responsables (N+1), affectation des équipes et supervision des bilans d&apos;essai.
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
            <Search
              className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2"
              strokeWidth={1.75}
            />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou direction..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-zinc-50/80 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-400 focus:bg-white dark:focus:bg-zinc-900 transition-all text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
              {filteredResponsables.length} responsable{filteredResponsables.length > 1 ? 's' : ''}
            </span>

            <div className="flex items-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-0.5">
              <button
                type="button"
                title="Vue liste"
                aria-label="Vue liste"
                onClick={() => setViewMode('list')}
                className={`h-7 w-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-zinc-800 shadow-2xs text-red-600 dark:text-red-400'
                    : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
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
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-zinc-800 shadow-2xs text-red-600 dark:text-red-400'
                    : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                }`}
              >
                <LayoutGrid className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>

        {filteredResponsables.length === 0 ? (
          <Card className="p-12 text-center text-xs text-zinc-500 dark:text-zinc-400 font-medium border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center mx-auto mb-3 text-zinc-400">
              <Users className="w-6 h-6" />
            </div>
            <p className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">Aucun responsable enregistré</p>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">
              {searchTerm
                ? 'Aucun responsable ne correspond à votre recherche.'
                : "Ajoutez un premier responsable pour commencer l'affectation de salariés."}
            </p>
            {!searchTerm && (
              <Button
                onClick={openAddModal}
                size="sm"
                className="mt-4 btn-gardient text-white rounded-xl text-xs cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                Ajouter un premier responsable
              </Button>
            )}
          </Card>
        ) : viewMode === 'list' ? (
          <Card className="overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs">
            <table className="w-full table-fixed text-left text-xs border-collapse">
              <colgroup>
                <col style={{ width: '26%' }} />
                <col style={{ width: '24%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '12%' }} />
              </colgroup>
              <thead className="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 whitespace-nowrap truncate">Responsable</th>
                  <th className="py-3.5 px-4 whitespace-nowrap truncate">Contact</th>
                  <th className="py-3.5 px-4 whitespace-nowrap truncate">Direction / Pôle</th>
                  <th className="py-3.5 px-4 whitespace-nowrap truncate">Équipe</th>
                  <th className="py-3.5 px-4 whitespace-nowrap truncate text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                {filteredResponsables.map((resp) => {
                  const subs = getSubs(resp);
                  const fullName = `${resp.firstName} ${resp.lastName}`;

                  return (
                    <tr key={resp.id} className="hover:bg-red-50/30 dark:hover:bg-red-950/10 transition-colors group">
                      <td className="py-3 px-4 align-middle whitespace-nowrap overflow-hidden">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 shrink-0 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-900 dark:text-zinc-100 font-bold flex items-center justify-center text-[11px] group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-colors duration-300">
                            {getInitials(resp.firstName, resp.lastName)}
                          </div>
                          <div className="truncate">
                            <span title={fullName} className="font-semibold tracking-tight block truncate">
                              {fullName}
                            </span>
                            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block truncate">
                              Responsable N+1
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 align-middle whitespace-nowrap overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span title={resp.email} className="truncate font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
                            {resp.email}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 align-middle whitespace-nowrap overflow-hidden">
                        <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 truncate block">
                          {resp.directionName || 'Direction'}
                        </span>
                      </td>
                      <td className="py-3 px-4 align-middle whitespace-nowrap overflow-hidden">
                        {subs.length > 0 ? (
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            <span className="text-[11px] font-mono font-bold text-zinc-900 dark:text-zinc-100 shrink-0">
                              {subs.length}
                            </span>
                            {subs.slice(0, 2).map((collab) => (
                              <span
                                key={collab.id}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60 truncate"
                              >
                                {collab.firstName} {collab.lastName}
                              </span>
                            ))}
                            {subs.length > 2 && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium shrink-0">
                                +{subs.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 italic">Aucun collaborateur</span>
                        )}
                      </td>
                      <td className="py-3 px-4 align-middle whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(resp)}
                            className="text-xs text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 h-8 px-2.5 rounded-lg cursor-pointer flex items-center gap-1"
                          >
                            <Pencil className="w-3 h-3" />
                            <span>Modifier</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => askDelete(resp)}
                            className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 h-8 px-2 rounded-lg cursor-pointer"
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
              const fullName = `${resp.firstName} ${resp.lastName}`;

              return (
                <Card
                  key={resp.id}
                  className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-900 dark:text-zinc-100 font-bold flex items-center justify-center text-xs shadow-2xs group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-colors duration-300">
                          {getInitials(resp.firstName, resp.lastName)}
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
                            {fullName}
                          </h3>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Responsable N+1</p>
                        </div>
                      </div>
                    </div>

                    <div className="py-3 border-y border-zinc-100 dark:border-zinc-800 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                        <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
                          {resp.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                        <Building2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate text-[11px] text-zinc-700 dark:text-zinc-300">
                          {resp.directionName || 'Direction'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-medium text-zinc-600 dark:text-zinc-400 text-[11px]">
                          Collaborateurs rattachés
                        </span>
                        <span className="text-[11px] font-mono font-bold text-zinc-900 dark:text-zinc-100">
                          {subs.length}
                        </span>
                      </div>

                      {subs.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {subs.slice(0, 3).map((collab) => (
                            <span
                              key={collab.id}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60"
                            >
                              {collab.firstName} {collab.lastName}
                            </span>
                          ))}
                          {subs.length > 3 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium">
                              +{subs.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 italic">
                          Aucun collaborateur rattaché
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(resp)}
                      className="text-xs text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 h-8 px-2.5 rounded-lg cursor-pointer flex items-center gap-1"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Modifier</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => askDelete(resp)}
                      className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 h-8 px-2.5 rounded-lg cursor-pointer"
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

      {/* Modal Ajout / Modification Responsable */}
      {showFormModal && (
        <div
          onClick={closeFormModal}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl max-w-lg w-full p-6 space-y-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {isEditing ? 'Modifier le responsable' : 'Ajouter un responsable'}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {isEditing
                    ? "Mettre à jour les informations du profil et l'affectation du responsable."
                    : "Créer un profil de Responsable N+1 pour la gestion des évaluations d'équipe."}
                </p>
              </div>
              <button
                type="button"
                aria-label="Fermer"
                onClick={closeFormModal}
                className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="resp_prenom" className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                    <input
                      id="resp_prenom"
                      type="text"
                      name="firstName"
                      required
                      placeholder="ex. Thomas"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="resp_nom" className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                    <input
                      id="resp_nom"
                      type="text"
                      name="lastName"
                      required
                      placeholder="ex. Bernard"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="resp_email" className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                  Adresse e-mail <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    id="resp_email"
                    type="email"
                    name="email"
                    required
                    placeholder="responsable@groupe-premium.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="resp_direction" className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                  Direction / Pôle
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <select
                    id="resp_direction"
                    name="directionId"
                    value={formData.directionId}
                    onChange={handleChange}
                    className="w-full text-xs pl-9 pr-3 py-2 bg-zinc-50/80 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 rounded-xl text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none"
                  >
                    {directions.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {formError && (
                <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">{formError}</p>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={closeFormModal}
                  className="rounded-xl text-xs cursor-pointer"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="btn-gardient text-white rounded-xl text-xs cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isEditing ? 'Enregistrer les modifications' : 'Enregistrer le responsable'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmation de Suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Supprimer le responsable
              </h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Vous êtes sûr de vouloir supprimer{' '}
              <strong className="text-zinc-900 dark:text-zinc-100">
                {selectedResp?.firstName} {selectedResp?.lastName}
              </strong>{' '}
              ({selectedResp?.email}) ?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedResp(null);
                }}
                className="rounded-xl text-xs cursor-pointer"
              >
                Annuler
              </Button>
              <Button
                size="sm"
                onClick={confirmDelete}
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