"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserPlus, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle2, 
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function AjouterSalarieScreen() {
  const { directions, responsables, addSalarie, navigateTo } = useApp();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('06 ');
  const [poste, setPoste] = useState('');
  const [directionId, setDirectionId] = useState<number>(directions[0]?.id || 1);
  const [responsableId, setResponsableId] = useState<number>(responsables[0]?.id || 1);
  const [dateEmbauche, setDateEmbauche] = useState<string>('2026-10-01');
  const [dureeInitialeMois, setDureeInitialeMois] = useState<number>(4);

  const handleNameChange = (fn: string, ln: string) => {
    setFirstName(fn);
    setLastName(ln);
    if (fn.trim() && ln.trim()) {
      const cleanFn = fn.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');
      const cleanLn = ln.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');
      setEmail(`${cleanFn}.${cleanLn}@groupe-premium.com`);
    }
  };

  const addMonths = (dateStr: string, months: number): string => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      d.setMonth(d.getMonth() + months);
      return d.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const calculated2M = addMonths(dateEmbauche, 2);
  const calculated5M = addMonths(dateEmbauche, 5);
  const calculatedFin = addMonths(dateEmbauche, dureeInitialeMois);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !poste || !dateEmbauche) {
      alert("Veuillez renseigner tous les champs obligatoires.");
      return;
    }

    addSalarie({
      firstName,
      lastName,
      email,
      phone,
      poste,
      dateEmbauche,
      dureeInitialeMois,
      directionId,
      responsableId
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-foreground tracking-tight">
            Créer un Salarié & Automatiser le Suivi d&apos;Essai
          </h2>
          <p className="text-xs text-muted-foreground">
            L&apos;enregistrement calcule automatiquement les jalons d&apos;évaluation à 2 mois et 5 mois et programme les envois à 09:00.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateTo('salaries')}
          className="cursor-pointer"
        >
          Annuler
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Identité */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border/70">
            <div className="w-7 h-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shadow-2xs">
              1
            </div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight">
              Identité du Collaborateur
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Prénom <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex : Alexandre"
                value={firstName}
                onChange={(e) => handleNameChange(e.target.value, lastName)}
                className="w-full text-xs px-3 py-2 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:bg-card focus:outline-none transition-all text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Nom <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex : Moreau"
                value={lastName}
                onChange={(e) => handleNameChange(firstName, e.target.value)}
                className="w-full text-xs px-3 py-2 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:bg-card focus:outline-none transition-all text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Email Professionnel <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
                <input
                  type="email"
                  required
                  placeholder="prenom.nom@groupe-premium.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:bg-card focus:outline-none font-mono text-foreground"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Téléphone Professionnel
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
                <input
                  type="text"
                  placeholder="06 XX XX XX XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:bg-card focus:outline-none text-foreground"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Step 2: Affectation Métier */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border/70">
            <div className="w-7 h-7 rounded-xl bg-secondary text-foreground flex items-center justify-center font-bold text-xs shadow-2xs">
              2
            </div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight">
              Affectation Métier & Manager Référent
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Intitulé du Poste <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex : Conseiller Patrimonial Senior"
                value={poste}
                onChange={(e) => setPoste(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:bg-card focus:outline-none text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Direction de Rattachement <span className="text-primary">*</span>
              </label>
              <select
                value={directionId}
                onChange={(e) => setDirectionId(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-foreground cursor-pointer"
              >
                {directions.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Responsable Évaluateur (N+1) <span className="text-primary">*</span>
              </label>
              <select
                value={responsableId}
                onChange={(e) => setResponsableId(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-foreground cursor-pointer"
              >
                {responsables.map(r => (
                  <option key={r.id} value={r.id}>{r.firstName} {r.lastName} ({r.poste})</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Step 3: Période d'essai & Calcul Automatique */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border/70">
            <div className="w-7 h-7 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shadow-2xs">
              3
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-tight">
                Paramétrage de la Période d&apos;Essai & Calcul des Échéances
              </h3>
              <p className="text-[11px] text-muted-foreground">Convention collective & accords Groupe Premium</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Date d&apos;Embauche <span className="text-primary">*</span>
              </label>
              <input
                type="date"
                required
                value={dateEmbauche}
                onChange={(e) => setDateEmbauche(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none font-mono text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Durée Initiale Contractuelle
              </label>
              <select
                value={dureeInitialeMois}
                onChange={(e) => setDureeInitialeMois(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-foreground cursor-pointer"
              >
                <option value={2}>2 mois (Employé / Opérateur)</option>
                <option value={3}>3 mois (Technicien / Agent de maîtrise)</option>
                <option value={4}>4 mois (Cadre - Standard Groupe Premium)</option>
              </select>
            </div>
          </div>

          {/* Apple SF Style Milestone Calculation Card */}
          <div className="mt-4 p-4 rounded-2xl bg-secondary/40 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Zap className="w-4 h-4" strokeWidth={1.75} />
                <span>Calculateur Automatique de Jalons Groupe Premium</span>
              </div>
              <Badge variant="appleRed" className="text-[10px] font-mono px-2 py-0">
                Batch 09:00 Activé
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-card border border-border shadow-2xs">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                  <span>Jalon 1</span>
                  <Badge variant="appleBlue" className="text-[10px]">2 Mois</Badge>
                </div>
                <p className="font-bold text-foreground text-sm font-mono">{calculated2M || '—'}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Mail auto envoyé à <strong className="text-foreground">09:00:00</strong>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-card border border-border shadow-2xs">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                  <span>Jalon 2 (Critique)</span>
                  <Badge variant="applePurple" className="text-[10px]">5 Mois</Badge>
                </div>
                <p className="font-bold text-foreground text-sm font-mono">{calculated5M || '—'}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Bilan final avant confirmation
                </p>
              </div>

              <div className="p-3 rounded-xl bg-card border border-border shadow-2xs">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                  <span>Terme Initial</span>
                  <Badge variant="appleGreen" className="text-[10px]">Fin Essai</Badge>
                </div>
                <p className="font-bold text-foreground text-sm font-mono">{calculatedFin || '—'}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Durée contractuelle : {dureeInitialeMois} mois
                </p>
              </div>
            </div>

            <div className="text-[11px] text-muted-foreground pt-1 flex items-center gap-1.5 border-t border-border/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-apple-green" strokeWidth={2} />
              <span>
                Détection automatique des retards : déclenchement d&apos;alerte si formulaire non retourné à <strong className="text-foreground">J+2</strong>.
              </span>
            </div>
          </div>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigateTo('salaries')}
            className="cursor-pointer"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="flex items-center gap-2 shadow-xs cursor-pointer px-6"
          >
            <UserPlus className="w-4 h-4" strokeWidth={1.75} />
            <span>Enregistrer le salarié et programmer le suivi</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
