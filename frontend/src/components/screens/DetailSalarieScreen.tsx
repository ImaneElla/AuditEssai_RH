"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Building2, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  ShieldCheck, 
  User, 
  Star,
  ExternalLink,
  Pencil,
  Trash2,
  X
} from 'lucide-react';
import { DecisionPeriode } from '../../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function DetailSalarieScreen() {
  const { 
    selectedSalarieId, 
    salaries, 
    periodes, 
    evaluations, 
    emails, 
    navigateTo, 
    openEmailModal, 
    relancerRetard, 
    validerDecisionRH,
    currentRole,
    setSalaries
  } = useApp();

  const [activeTab, setActiveTab] = useState<'PARCOURS' | 'EMAILS'>('PARCOURS');
  const [showDecisionModal, setShowDecisionModal] = useState<boolean>(false);
  const [decisionType, setDecisionType] = useState<DecisionPeriode>('CONFIRMATION');
  const [decisionMotif, setDecisionMotif] = useState<string>('Période d\'essai concluante, objectifs atteints et pleine intégration dans l\'équipe.');

  // Modales d'édition et de suppression
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const salarie = salaries.find(s => s.id === selectedSalarieId) || salaries[0];

  // État du formulaire de modification
  const [editFormData, setEditFormData] = useState({
    firstName: salarie?.firstName || '',
    lastName: salarie?.lastName || '',
    email: salarie?.email || '',
    phone: salarie?.phone || '',
    poste: salarie?.poste || '',
    directionName: salarie?.directionName || '',
    responsableNom: salarie?.responsableNom || ''
  });

  const salariePeriodes = periodes.filter(p => p.salarieId === salarie?.id);
  const salarieEmails = emails.filter(e => e.salarieId === salarie?.id);

  if (!salarie) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Salarié introuvable.
      </div>
    );
  }

  const periode2M = salariePeriodes.find(p => p.typePeriode === 'DEUX_MOIS');
  const periode5M = salariePeriodes.find(p => p.typePeriode === 'CINQ_MOIS');

  const handleConfirmDecision = () => {
    const activeP = salariePeriodes.find(p => p.statut !== 'VALIDEE_RH') || salariePeriodes[0];
    if (activeP) {
      validerDecisionRH(activeP.id, decisionType, decisionMotif);
    }
    setShowDecisionModal(false);
  };

  // Soumission des modifications du salarié
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (setSalaries) {
      setSalaries((prev) =>
        prev.map((s) => (s.id === salarie.id ? { ...s, ...editFormData } : s))
      );
    }
    setShowEditModal(false);
  };

  // Confirmation de la suppression du salarié
  const handleDeleteSalarie = () => {
    if (setSalaries) {
      setSalaries((prev) => prev.filter((s) => s.id !== salarie.id));
    }
    setShowDeleteModal(false);
    navigateTo('salaries');
  };

  const isRH = currentRole === 'ADMIN_RH';

  return (
    <div className="space-y-6 font-sans">
      {/* Navigation et actions du haut */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateTo('salaries')}
          className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
          <span>Retour à la liste des salariés</span>
        </Button>

        <div className="flex items-center gap-2">
          {/* Boutons d'édition et suppression */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditFormData({
                firstName: salarie.firstName,
                lastName: salarie.lastName,
                email: salarie.email,
                phone: salarie.phone,
                poste: salarie.poste,
                directionName: salarie.directionName,
                responsableNom: salarie.responsableNom,
              });
              setShowEditModal(true);
            }}
            className="flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Modifier</span>
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Supprimer</span>
          </Button>

          {isRH && (
            <Button
              size="sm"
              onClick={() => setShowDecisionModal(true)}
              className="flex items-center gap-1.5 shadow-xs cursor-pointer text-xs"
            >
              <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />
              <span>Valider Décision RH</span>
            </Button>
          )}
        </div>
      </div>

      {/* Salarie Profile Header Card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-secondary border border-border text-foreground font-bold flex items-center justify-center text-xl shrink-0 shadow-2xs">
              {salarie.firstName[0]}{salarie.lastName[0]}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  {salarie.firstName} {salarie.lastName}
                </h2>
                <Badge
                  variant={
                    salarie.statutEssai === 'CONFIRMEE' ? 'appleGreen' :
                    salarie.statutEssai === 'RENOUVELEE' ? 'appleOrange' :
                    salarie.statutEssai === 'RUPTURE' ? 'destructive' : 'appleBlue'
                  }
                  className="text-xs"
                >
                  {salarie.statutEssai === 'EN_COURS' ? 'Période d\'essai en cours' :
                   salarie.statutEssai === 'CONFIRMEE' ? 'Période d\'essai confirmée' :
                   salarie.statutEssai === 'RENOUVELEE' ? 'Période renouvelée' : 'Rupture'}
                </Badge>
                <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-md font-mono border border-border/60">
                  Matricule #EMP-{salarie.id.toString().padStart(4, '0')}
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground/80">{salarie.poste}</p>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.75} />
                  {salarie.directionName}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.75} />
                  Responsable : <strong className="text-foreground">{salarie.responsableNom}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.75} />
                  {salarie.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.75} />
                  {salarie.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-secondary/40 border border-border text-xs space-y-1.5 shrink-0 min-w-56">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Embauche :</span>
              <span className="font-mono font-bold text-foreground">{salarie.dateEmbauche}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Durée initiale :</span>
              <span className="font-medium text-foreground">{salarie.dureeInitialeMois} mois (Cadre)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fin prévisionnelle :</span>
              <span className="font-mono font-bold text-primary">{salarie.dateFinPrevisionnelle}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Visual Timeline of Trial Milestones */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground tracking-tight">
            Parcours Chronologique & Jalons de la Période d&apos;Essai
          </h3>
          <span className="text-xs text-muted-foreground font-mono">
            Automatisé par le Cron 09:00
          </span>
        </div>

        {/* Timeline Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative pt-2">
          {/* Step 1: Entrée */}
          <div className="border border-border rounded-xl p-4 bg-secondary/30">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="appleGreen" className="text-[10px]">
                Étape 1 • Réalisée
              </Badge>
              <CheckCircle2 className="w-4 h-4 text-apple-green" strokeWidth={2} />
            </div>
            <h4 className="text-xs font-semibold text-foreground">Date d&apos;Embauche</h4>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">{salarie.dateEmbauche}</p>
            <p className="text-[11px] text-muted-foreground mt-2">Prise de fonction officielle</p>
          </div>

          {/* Step 2: Bilan 2 Mois */}
          <div className={`border rounded-xl p-4 ${
            periode2M?.statut === 'EN_RETARD' ? 'border-destructive/30 bg-destructive/5' :
            periode2M?.statut === 'COMPLETEE' || periode2M?.statut === 'VALIDEE_RH' ? 'border-apple-green/30 bg-apple-green-subtle/40' :
            'border-border bg-card'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <Badge 
                variant={
                  periode2M?.statut === 'EN_RETARD' ? 'destructive' :
                  periode2M?.statut === 'COMPLETEE' || periode2M?.statut === 'VALIDEE_RH' ? 'appleGreen' :
                  'appleBlue'
                }
                className="text-[10px]"
              >
                {periode2M?.statut === 'EN_RETARD' ? `Retard +${periode2M.joursRetard}j` :
                 periode2M?.statut === 'COMPLETEE' || periode2M?.statut === 'VALIDEE_RH' ? 'Validé' : 'Planifié'}
              </Badge>
              <Clock className="w-4 h-4 text-muted-foreground" strokeWidth={1.75} />
            </div>
            <h4 className="text-xs font-semibold text-foreground">Bilan 2 Mois (Intermédiaire)</h4>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">{periode2M?.dateEcheance || '—'}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">Email à 09:00</span>
              {periode2M?.statut === 'EN_RETARD' && (
                <Button
                  size="sm"
                  onClick={() => relancerRetard(periode2M.id)}
                  className="text-[10px] h-6 px-2"
                >
                  Relancer
                </Button>
              )}
            </div>
          </div>

          {/* Step 3: Bilan 5 Mois */}
          <div className={`border rounded-xl p-4 ${
            periode5M?.statut === 'EN_RETARD' ? 'border-destructive/30 bg-destructive/5' :
            periode5M?.statut === 'COMPLETEE' || periode5M?.statut === 'VALIDEE_RH' ? 'border-apple-green/30 bg-apple-green-subtle/40' :
            'border-border bg-card'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <Badge 
                variant={
                  periode5M?.statut === 'EN_RETARD' ? 'destructive' :
                  periode5M?.statut === 'COMPLETEE' || periode5M?.statut === 'VALIDEE_RH' ? 'appleGreen' :
                  'applePurple'
                }
                className="text-[10px]"
              >
                {periode5M?.statut === 'EN_RETARD' ? `Retard +${periode5M.joursRetard}j` :
                 periode5M?.statut === 'COMPLETEE' || periode5M?.statut === 'VALIDEE_RH' ? 'Validé' : 'À venir'}
              </Badge>
              <Clock className="w-4 h-4 text-muted-foreground" strokeWidth={1.75} />
            </div>
            <h4 className="text-xs font-semibold text-foreground">Bilan 5 Mois (Décision)</h4>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">{periode5M?.dateEcheance || '—'}</p>
            <p className="text-[11px] text-muted-foreground mt-2">Avis N+1 requis</p>
          </div>

          {/* Step 4: Terme Final */}
          <div className="border border-border rounded-xl p-4 bg-secondary/30">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="text-[10px]">
                Étape 4 • Décision
              </Badge>
              <ShieldCheck className="w-4 h-4 text-muted-foreground" strokeWidth={1.75} />
            </div>
            <h4 className="text-xs font-semibold text-foreground">Terme Période d&apos;Essai</h4>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">{salarie.dateFinPrevisionnelle}</p>
            <p className="text-[11px] text-muted-foreground mt-2">Confirmation ou renouvellement</p>
          </div>
        </div>
      </Card>

      {/* Tabs Switcher */}
      {isRH ? (
        <div className="flex border-b border-border gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('PARCOURS')}
            className={`pb-3 transition-colors cursor-pointer ${
              activeTab === 'PARCOURS'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Bilans d&apos;Évaluation ({salariePeriodes.length})
          </button>
          <button
            onClick={() => setActiveTab('EMAILS')}
            className={`pb-3 transition-colors cursor-pointer ${
              activeTab === 'EMAILS'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Emails &amp; Convocations Transmises ({salarieEmails.length})
          </button>
        </div>
      ) : (
        <div className="border-b border-border pb-3 text-xs font-semibold text-foreground">
          Bilans d&apos;Évaluation du Collaborateur ({salariePeriodes.length})
        </div>
      )}

      {/* Tab Content: Bilans */}
      {activeTab === 'PARCOURS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {salariePeriodes.map((p) => {
            const evalDetail = evaluations.find(e => e.periodeId === p.id);
            const isCompleted = p.statut === 'COMPLETEE' || p.statut === 'VALIDEE_RH';

            return (
              <Card key={p.id} className="p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border/70">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shadow-2xs">
                      {p.typePeriode === 'DEUX_MOIS' ? '2M' : '5M'}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground tracking-tight">
                        {p.typePeriode === 'DEUX_MOIS' ? 'Bilan d\'intégration 2 mois' : 'Bilan stratégique 5 mois'}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">Échéance : {p.dateEcheance}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      p.statut === 'EN_RETARD' ? 'destructive' :
                      isCompleted ? 'appleGreen' : 'secondary'
                    }
                    className="text-[10px]"
                  >
                    {p.statut}
                  </Badge>
                </div>

                {isCompleted && evalDetail ? (
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-border">
                      <span className="text-foreground font-medium">Note Globale d&apos;Évaluation :</span>
                      <div className="flex items-center gap-1 font-bold text-foreground text-sm">
                        <Star className="w-4 h-4 text-apple-orange fill-apple-orange" strokeWidth={1.5} />
                        <span>{p.noteGlobale} / 5</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-muted-foreground font-semibold mb-1">Avis du Responsable ({p.responsableNom}) :</p>
                      <p className="p-3 rounded-xl bg-secondary/30 text-foreground/90 text-xs italic border border-border/60">
                        &quot;{evalDetail.avisResponsable}&quot;
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 rounded-xl bg-secondary/30 border border-border/50">
                        <span className="text-muted-foreground block">Compétences métiers</span>
                        <strong className="text-foreground">{evalDetail.competencesTechniques} / 5</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-secondary/30 border border-border/50">
                        <span className="text-muted-foreground block">Intégration d&apos;équipe</span>
                        <strong className="text-foreground">{evalDetail.integrationEquipe} / 5</strong>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-border/60 text-xs">
                      <span className="text-muted-foreground">Décision proposée :</span>
                      <strong className="text-apple-green font-semibold">{p.decisionFinale}</strong>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <p className="text-muted-foreground text-xs">
                      Ce bilan n&apos;a pas encore été finalisé par le manager <strong className="text-foreground">{p.responsableNom}</strong>.
                    </p>
                    {p.statut === 'EN_RETARD' && (
                      <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <AlertTriangle className="w-4 h-4" strokeWidth={1.75} />
                          <span>Retard de {p.joursRetard} jours constaté</span>
                        </div>
                        <p className="text-[11px] text-destructive/80">
                          Le délai de réponse (48h après l&apos;email de 09:00) a été dépassé.
                        </p>
                      </div>
                    )}
                    <div className="pt-2 flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => navigateTo('formulaire-evaluation', { periodeId: p.id })}
                        className="cursor-pointer"
                      >
                        Remplir l&apos;évaluation
                      </Button>
                      {isRH && p.statut === 'EN_RETARD' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => relancerRetard(p.id)}
                          className="cursor-pointer flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" strokeWidth={1.75} />
                          <span>Relancer N+1</span>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Tab Content: Emails */}
      {activeTab === 'EMAILS' && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Audit des Emails Transmis pour ce Dossier
            </h4>
            <span className="text-xs text-muted-foreground">
              {salarieEmails.length} message{salarieEmails.length > 1 ? 's' : ''} archivé{salarieEmails.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="divide-y divide-border/60">
            {salarieEmails.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                Aucun email n&apos;a encore été généré pour ce collaborateur.
              </div>
            ) : (
              salarieEmails.map((email) => (
                <div key={email.id} className="p-4 hover:bg-secondary/40 transition-colors flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-secondary text-foreground flex items-center justify-center shrink-0 border border-border">
                      <Mail className="w-4 h-4" strokeWidth={1.75} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground tracking-tight">{email.objet}</span>
                        {email.batchCron && (
                          <Badge variant="appleRed" className="text-[10px] px-1.5 py-0">
                            Cron 09:00
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Envoyé à : <strong className="text-foreground">{email.destinataireNom}</strong> ({email.destinataire}) • {email.dateEnvoi} à {email.heureEnvoi}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEmailModal(email)}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <span>Voir l&apos;email</span>
                    <ExternalLink className="w-3 h-3" strokeWidth={1.75} />
                  </Button>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* Modal d'édition des informations du salarié */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-primary" strokeWidth={1.75} />
                <h3 className="text-sm font-semibold text-foreground tracking-tight">
                  Modifier les informations du salarié
                </h3>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Prénom</label>
                  <input
                    type="text"
                    value={editFormData.firstName}
                    onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Nom</label>
                  <input
                    type="text"
                    value={editFormData.lastName}
                    onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Téléphone</label>
                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Poste</label>
                  <input
                    type="text"
                    value={editFormData.poste}
                    onChange={(e) => setEditFormData({ ...editFormData, poste: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Direction / Pôle</label>
                  <input
                    type="text"
                    value={editFormData.directionName}
                    onChange={(e) => setEditFormData({ ...editFormData, directionName: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Manager N+1</label>
                <input
                  type="text"
                  value={editFormData.responsableNom}
                  onChange={(e) => setEditFormData({ ...editFormData, responsableNom: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEditModal(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" size="sm">
                  Enregistrer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-semibold tracking-tight">Supprimer le salarié</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Êtes-vous sûr de vouloir supprimer <strong className="text-foreground">{salarie.firstName} {salarie.lastName}</strong> ? Cette action est irréversible.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSalarie}
              >
                Confirmer la suppression
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Decision Modal */}
      {showDecisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border">
              <ShieldCheck className="w-5 h-5 text-primary" strokeWidth={1.75} />
              <h3 className="text-sm font-semibold text-foreground tracking-tight">
                Validation Officielle de la Décision RH
              </h3>
            </div>

            <p className="text-xs text-muted-foreground">
              Cette décision validera le parcours de période d&apos;essai de <strong className="text-foreground">{salarie.firstName} {salarie.lastName}</strong> et lui adressera un email formel de notification.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Décision RH
                </label>
                <select
                  value={decisionType}
                  onChange={(e) => setDecisionType(e.target.value as DecisionPeriode)}
                  className="w-full text-xs px-3 py-2 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-foreground font-medium cursor-pointer"
                >
                  <option value="CONFIRMATION">Confirmation Définitive de la Période d&apos;Essai</option>
                  <option value="RENOUVELLEMENT">Renouvellement de la Période d&apos;Essai</option>
                  <option value="RUPTURE">Rupture / Fin de la Période d&apos;Essai</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Motif / Synthèse RH
                </label>
                <textarea
                  rows={3}
                  value={decisionMotif}
                  onChange={(e) => setDecisionMotif(e.target.value)}
                  className="w-full text-xs p-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-foreground"
                  placeholder="Justification de la décision prise en concertation avec le responsable hiérarchique..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDecisionModal(false)}
                className="cursor-pointer"
              >
                Annuler
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmDecision}
                className="cursor-pointer shadow-xs"
              >
                Enregistrer et Notifier
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}