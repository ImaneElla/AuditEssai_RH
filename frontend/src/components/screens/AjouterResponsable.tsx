'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { UserPlus, ArrowLeft, Mail, Building2, User, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  directionId: number | '';
}

const inputClass =
  'w-full text-xs pl-9 pr-3 py-2 bg-zinc-50/80 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 rounded-xl text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none';

const labelClass = 'text-xs font-medium text-zinc-900 dark:text-zinc-100';

export default function AjouterResponsable() {
  const { navigateTo, addResponsable, directions = [] } = useApp();

  const [formData, setFormData] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    directionId: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (directions.length > 0 && formData.directionId === '') {
      setFormData((prev) => ({ ...prev, directionId: directions[0].id }));
    }
  }, [directions, formData.directionId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'directionId' ? Number(value) : value
    }));
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      setError('Veuillez renseigner le nom, prénom et une adresse e-mail.');
      return;
    }

    if (!formData.directionId) {
      setError('Veuillez sélectionner une direction.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Adresse e-mail invalide.');
      return;
    }

    addResponsable({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      directionId: formData.directionId as number,
      directionName: directions.find((d) => d.id === formData.directionId)?.name || ''
    } as any);

    setIsSubmitted(true);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setError('');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      directionId: directions.length > 0 ? directions[0].id : ''
    });
  };

  const selectedDirection = useMemo(() => {
    return directions.find((d) => d.id === formData.directionId)?.name || 'Direction non sélectionnée';
  }, [directions, formData.directionId]);

  const initials =
    formData.firstName || formData.lastName
      ? `${formData.firstName?.[0] || ''}${formData.lastName?.[0] || ''}`.toUpperCase()
      : '?';

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans pb-10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateTo('responsables')}
            className="h-9 w-9 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Ajouter un Responsable
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Créer un profil de Responsable N+1 pour la gestion des évaluations
            </p>
          </div>
        </div>
      </div>

      {isSubmitted ? (
        /* Success state */
        <Card className="p-8 text-center border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Responsable ajouté avec succès
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Le profil de{' '}
            <strong className="text-zinc-900 dark:text-zinc-100">
              {formData.firstName} {formData.lastName}
            </strong>{' '}
            ({formData.email}) a été enregistré.
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <Button
              variant="outline"
              className="text-xs cursor-pointer rounded-xl"
              onClick={() => navigateTo('responsables')}
            >
              Retour à l&apos;annuaire
            </Button>
            <Button className="btn-gardient text-white text-xs cursor-pointer rounded-xl" onClick={resetForm}>
              Ajouter un autre
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <Card className="lg:col-span-2 p-6 border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs rounded-2xl bg-white dark:bg-zinc-900">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Prénom + Nom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      name="firstName"
                      required
                      placeholder="Thomas"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      name="lastName"
                      required
                      placeholder="Bernard"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Email (full width) */}
              <div className="space-y-1.5">
                <label className={labelClass}>
                  Adresse e-mail <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <input
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

              {/* Row 3: Direction (full width) */}
              <div className="space-y-1.5">
                <label className={labelClass}>
                  Direction / Pôle <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <select
                    name="directionId"
                    value={formData.directionId}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {directions.length === 0 && <option value="">Chargement...</option>}
                    {directions.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>
              )}

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigateTo('responsables')}
                  className="text-xs cursor-pointer border-zinc-200 dark:border-zinc-800 rounded-xl"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="btn-gardient text-white text-xs cursor-pointer flex items-center gap-1.5 shadow-2xs rounded-xl"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Enregistrer le responsable
                </Button>
              </div>
            </form>
          </Card>

          {/* Preview */}
          <div className="space-y-4">
            <Card className="p-5 border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-2xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
                Aperçu du Responsable
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-sm">
                  {initials}
                </div>
                <div className="text-xs">
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">
                    {formData.firstName} {formData.lastName || 'Nom'}
                  </p>
                  <p className="text-zinc-500">{selectedDirection}</p>
                </div>
              </div>
              <div className="space-y-2.5 text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{formData.email || 'Adresse email requise'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{selectedDirection}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}