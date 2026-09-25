'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserPlus, ArrowLeft, Mail, User, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FormState {
  prenom: string;
  nom: string;
  email: string;
}

export default function AjouterResponsable() {
  const { navigateTo } = useApp();
  const [formData, setFormData] = useState<FormState>({
    prenom: '',
    nom: '',
    email: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans pb-10">
      {/* En-tête */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateTo('responsables')}
            className="h-9 w-9 border-border hover:bg-secondary cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Ajouter un Responsable
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Créer un profil de Responsable N+1 pour la gestion des évaluations d'équipe
            </p>
          </div>
        </div>
      </div>

      {isSubmitted ? (
        <Card className="p-8 text-center border-emerald-200 bg-emerald-50/30">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Responsable ajouté avec succès</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Un courriel d&apos;invitation a été envoyé à l&apos;adresse <strong className="text-foreground">{formData.email}</strong>.
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <Button 
              variant="outline"
              className="text-xs cursor-pointer border-border"
              onClick={() => navigateTo('responsables')}
            >
              Retour à la liste
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white text-xs cursor-pointer"
              onClick={() => {
                setIsSubmitted(false);
                setFormData({ prenom: '', nom: '', email: '' });
              }}
            >
              Ajouter un autre responsable
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulaire Principal */}
          <Card className="lg:col-span-2 p-6 border-border/80 shadow-2xs">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Prénom */}
                <div className="space-y-1.5">
                  <label htmlFor="prenom" className="text-xs font-medium text-foreground">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                    <input
                      id="prenom"
                      type="text"
                      name="prenom"
                      required
                      placeholder="e.g. Thomas"
                      value={formData.prenom}
                      onChange={handleChange}
                      className="w-full text-xs pl-9 pr-3 py-2 bg-secondary/30 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Nom */}
                <div className="space-y-1.5">
                  <label htmlFor="nom" className="text-xs font-medium text-foreground">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                    <input
                      id="nom"
                      type="text"
                      name="nom"
                      required
                      placeholder="e.g. Bernard"
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full text-xs pl-9 pr-3 py-2 bg-secondary/30 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Email (Obligatoire) */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-medium text-foreground">
                  Adresse e-mail du Responsable <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    placeholder="responsable@premium.africa"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full text-xs pl-9 pr-3 py-2 bg-secondary/30 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigateTo('responsables')}
                  className="text-xs cursor-pointer border-border"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="btn-gardient text-white text-xs cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Enregistrer le responsable
                </Button>
              </div>
            </form>
          </Card>

          {/* Carte d'Aperçu Synthétique */}
          <div className="space-y-4">
            <Card className="p-5 border-border/80 bg-zinc-50/50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Aperçu du Responsable
              </h3>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-600 font-bold text-sm">
                  {formData.prenom || formData.nom 
                    ? `${formData.prenom.charAt(0)}${formData.nom.charAt(0)}`.toUpperCase() 
                    : '?'}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">
                    {formData.prenom || formData.nom ? `${formData.prenom} ${formData.nom}` : 'Nouveau Responsable'}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Responsable 
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-muted-foreground border-t border-border/60 pt-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{formData.email || 'Adresse email obligatoire'}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}