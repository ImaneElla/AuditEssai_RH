"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Mail,
  SunMoon,
  Check,
  Info,
  Shield,
  Sparkles,
  Laptop,
} from 'lucide-react';
import { TemplateEmailSetting, ThemeMode } from '../../types';

// ============================================================================
// APPLE-STYLE PRIMITIVES
// ============================================================================

const APPLE_red = 'bg-[#FF3B30] hover:bg-[#FF6B60] active:bg-[#FF3B30]';

function Group({
  title,
  footer,
  children,
}: {
  title?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-1.5">
      {title && (
        <h3 className="px-4 text-[12px] font-normal uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
      )}
      <div className="overflow-hidden rounded-[14px] bg-card shadow-[0_0_0_0.5px_rgba(0,0,0,0.06)] divide-y divide-border/60">
        {children}
      </div>
      {footer && (
        <p className="px-4 text-[12px] leading-snug text-muted-foreground">{footer}</p>
      )}
    </section>
  );
}

function IconTile({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] text-white ${color}`}
    >
      {children}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-h-[46px] items-center gap-4 px-4 py-2.5">
      <span className="w-40 shrink-0 text-[15px] text-foreground">{label}</span>
      <div className="flex-1">{children}</div>
    </label>
  );
}

const inputClass =
  'w-full bg-transparent text-right text-[15px] text-muted-foreground outline-none placeholder:text-muted-foreground/50 focus:text-foreground';

// ============================================================================
// SCREEN
// ============================================================================

export default function ParametresScreen() {
  const { parametres, updateParametres, updateResponsable, currentRole, currentResponsable } = useApp();
  const isRH = currentRole === 'ADMIN_RH';

  const [templates, setTemplates] = useState<TemplateEmailSetting[]>(parametres.templatesEmail);
  const [compte, setCompte] = useState(parametres.compte);
  const [theme, setTheme] = useState<ThemeMode>(parametres.theme);

  // Admin profil (parametres.profil) — only used / editable when isRH
  const [profil, setProfil] = useState(parametres.profil);

  // Responsable profil — local copy of currentResponsable for editing
  const [respProfil, setRespProfil] = useState({
    firstName: currentResponsable?.firstName ?? '',
    lastName:  currentResponsable?.lastName  ?? '',
    email:     currentResponsable?.email     ?? '',
    phone:     currentResponsable?.phone     ?? '',
    poste:     currentResponsable?.poste     ?? '',
    directionName: currentResponsable?.directionName ?? '',
    directionId:   currentResponsable?.directionId   ?? 1,
  });

  const [saved, setSaved] = useState(false);

  const [activeTab, setActiveTab] = useState<'emails' | 'compte' | 'theme' | 'profil'>(
    isRH ? 'emails' : 'profil'
  );

  const handleTemplateChange = (
    id: string,
    field: 'objet' | 'contenu' | 'delai',
    value: string
  ) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();

    if (isRH) {
      // Admin saves its own parametres.profil — never touches responsable data
      updateParametres({ templatesEmail: templates, compte, theme, profil });
    } else {
      // Responsable saves only theme + its own responsable record (NOT parametres.profil)
      updateParametres({ theme });
      if (currentResponsable) {
        updateResponsable(currentResponsable.id, {
          firstName:   respProfil.firstName,
          lastName:    respProfil.lastName,
          email:       respProfil.email,
          phone:       respProfil.phone,
          poste:       respProfil.poste,
          directionId: respProfil.directionId,
        });
      }
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs: { id: typeof activeTab; label: string; rhOnly?: boolean }[] = [
   { id: 'profil', label: 'Profil' },
    { id: 'emails', label: 'Relances', rhOnly: true },
    { id: 'compte', label: 'Expéditeur', rhOnly: true },
    { id: 'theme', label: 'Thème' },
  ];
  const visibleTabs = tabs.filter((t) => !t.rhOnly || isRH);

  const themeOptions: {
    id: ThemeMode;
    title: string;
    desc: string;
    preview: React.ReactNode;
  }[] = [
    {
      id: 'light',
      title: 'Clair',
      desc: 'Fond blanc et zinc.',
      preview: (
        <div className="flex h-full w-full items-center justify-center rounded-[10px] border border-zinc-200 bg-white">
          <SunMoon className="h-6 w-6 text-amber-500" />
        </div>
      ),
    },
    {
      id: 'dark',
      title: 'Sombre',
      desc: 'Fort contraste, reposant.',
      preview: (
        <div className="flex h-full w-full items-center justify-center rounded-[10px] border border-zinc-800 bg-zinc-900">
          <Sparkles className="h-6 w-6 text-[#0A84FF]" />
        </div>
      ),
    },
    {
      id: 'system',
      title: 'Automatique',
      desc: 'Suit votre appareil.',
      preview: (
        <div className="flex h-full w-full items-center justify-center rounded-[10px] border border-zinc-200 bg-gradient-to-r from-white to-zinc-900">
          <Laptop className="h-6 w-6 text-zinc-500" />
        </div>
      ),
    },
  ];

  return (
    <div
      className="mx-auto max-w-2xl space-y-6 pb-16"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Large title */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2 text-muted-foreground">
            <Settings className="h-4 w-4" />
            <span className="text-[13px]">{isRH ? 'Système RH' : 'Application'}</span>
          </div>
          <h2 className="text-[34px] font-bold leading-none tracking-tight text-foreground">
            Réglages
          </h2>
        </div>

      
      </div>

      {/* Segmented control */}
      <div className="flex rounded-[10px] bg-secondary p-[3px]">
        {visibleTabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 cursor-pointer whitespace-nowrap rounded-[8px] px-3 py-1.5 text-[13px] transition-all ${
              activeTab === t.id
                ? 'bg-card font-semibold text-foreground shadow-[0_1px_3px_rgba(0,0,0,0.12),0_0_0_0.5px_rgba(0,0,0,0.04)]'
                : 'font-medium text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSaveAll} className="space-y-7">
        {/* ================================================================== */}
        {/* 1. EMAILS DE RELANCE (ADMIN_RH)                                    */}
        {/* ================================================================== */}
        {isRH && activeTab === 'emails' && (
          <div className="space-y-7">
            <Group
              title="Variables disponibles"
              footer="Insérez ces variables dans l'objet ou le corps du message, elles seront remplacées automatiquement à l'envoi."
            >
              <div className="flex items-start gap-3 px-4 py-3">
                <IconTile color="bg-orange-500">
                  <Info className="h-4 w-4" />
                </IconTile>
                <div className="grid flex-1 grid-cols-1 gap-x-4 gap-y-1.5 text-[13px] sm:grid-cols-2">
                  {[
                    ['{salarie}', 'Nom & prénom du salarié'],
                    ['{echeance}', 'Date de fin de période'],
                    ['{responsable}', 'Responsable évaluateur'],
                    ['{periode}', 'Période 1 (3 mois) ou 2 (6 mois)'],
                  ].map(([v, d]) => (
                    <div key={v} className="flex items-baseline gap-2">
                      <code className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[12px] text-foreground">
                        {v}
                      </code>
                      <span className="text-muted-foreground">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Group>

            {templates.map((tmpl, idx) => (
              <Group
                key={tmpl.id}
                title={`Email ${idx + 1} · ${tmpl.nom}`}
                footer={`Déclenchement automatique : ${tmpl.delai}`}
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <IconTile color="bg-[#FF3B30]">
                    <Mail className="h-4 w-4" />
                  </IconTile>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-medium text-foreground">
                      {tmpl.nom}
                    </p>
                    <p className="truncate text-[12px] text-muted-foreground">{tmpl.delai}</p>
                  </div>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    Auto
                  </span>
                </div>

                <Row label="Objet">
                  <input
                    type="text"
                    value={tmpl.objet}
                    onChange={(e) => handleTemplateChange(tmpl.id, 'objet', e.target.value)}
                    className={inputClass}
                  />
                </Row>

                <div className="space-y-1 px-4 py-3">
                  <span className="text-[15px] text-foreground">Message</span>
                  <textarea
                    rows={4}
                    value={tmpl.contenu}
                    onChange={(e) => handleTemplateChange(tmpl.id, 'contenu', e.target.value)}
                    className="w-full resize-none bg-transparent text-[14px] leading-relaxed text-muted-foreground outline-none focus:text-foreground"
                  />
                </div>
              </Group>
            ))}
          </div>
        )}

        {/* ================================================================== */}
        {/* 2. COMPTE EXPÉDITEUR (ADMIN_RH)                                    */}
        {/* ================================================================== */}
        {isRH && activeTab === 'compte' && (
          <Group
            title="Compte expéditeur"
            footer="Toutes les relances automatiques utilisent cette adresse comme expéditeur (en-tête From)."
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <IconTile color="bg-[#34C759]">
                <Shield className="h-4 w-4" />
              </IconTile>
              <div>
                <p className="text-[15px] font-medium text-foreground">Expéditeur des emails</p>
                <p className="text-[12px] text-muted-foreground">
                  Affiché dans les relances et convocations.
                </p>
              </div>
            </div>

            <Row label="Nom">
              <input
                type="text"
                value={compte.nomExpediteur}
                onChange={(e) => setCompte({ ...compte, nomExpediteur: e.target.value })}
                placeholder="Direction des Ressources Humaines"
                className={inputClass}
              />
            </Row>

            <Row label="Adresse email">
              <input
                type="email"
                value={compte.emailExpediteur}
                onChange={(e) => setCompte({ ...compte, emailExpediteur: e.target.value })}
                placeholder="rh@groupe-premium.com"
                className={inputClass}
              />
            </Row>
          </Group>
        )}

        {/* ================================================================== */}
        {/* 3. THÈME                                                           */}
        {/* ================================================================== */}
        {activeTab === 'theme' && (
          <Group
            title="Apparence"
            footer="Le choix est mémorisé et appliqué à toute l'application."
          >
            <div className="grid grid-cols-3 gap-3 p-4">
              {themeOptions.map((opt) => {
                const active = theme === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTheme(opt.id)}
                    className="group flex cursor-pointer flex-col items-center gap-2 text-center"
                  >
                    <div
                      className={`relative h-20 w-full rounded-[12px] p-1 transition-all ${
                        active
                          ? 'ring-2 ring-[#007AFF]'
                          : 'ring-1 ring-border group-hover:ring-zinc-400'
                      }`}
                    >
                      {opt.preview}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-foreground">{opt.title}</p>
                      <p className="text-[11px] leading-tight text-muted-foreground">
                        {opt.desc}
                      </p>
                    </div>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
                        active
                          ? 'bg-[#007AFF] text-white'
                          : 'border border-border text-transparent'
                      }`}
                    >
                      <Check className="h-3 w-3" strokeWidth={3.5} />
                    </span>
                  </button>
                );
              })}
            </div>
          </Group>
        )}

        {/* ================================================================== */}
        {/* 4. PROFIL                                                          */}
        {/* ================================================================== */}
        {activeTab === 'profil' && (
          <div className="space-y-7">
            <Group>
              <div className="flex flex-col items-center gap-1 px-4 py-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b from-red-400 to-zinc-600 text-[28px] font-semibold uppercase text-white shadow-sm">
                  {isRH
                    ? <>{profil.prenom?.[0]}{profil.nom?.[0]}</>
                    : <>{respProfil.firstName?.[0]}{respProfil.lastName?.[0]}</>
                  }
                </div>
                <h4 className="mt-2 text-[20px] font-semibold text-foreground">
                  {isRH ? `${profil.prenom} ${profil.nom}` : `${respProfil.firstName} ${respProfil.lastName}`}
                </h4>
                <p className="text-[13px] text-muted-foreground">
                  {isRH ? profil.direction : (respProfil.poste || respProfil.directionName)}
                </p>
                <span className="mt-1 rounded-full bg-secondary px-3 py-1 text-[11px] font-medium text-muted-foreground">
                  {isRH ? 'Compte Administrateur DRH' : 'Compte Responsable'}
                </span>
              </div>
            </Group>

            <Group
              title="Informations personnelles"
              footer={isRH ? "Informations du compte Admin RH." : "Informations du compte Responsable connecté."}
            >
              {isRH ? (
                <>
                  <Row label="Prénom">
                    <input
                      type="text"
                      value={profil.prenom}
                      onChange={(e) => setProfil({ ...profil, prenom: e.target.value })}
                      className={inputClass}
                    />
                  </Row>
                  <Row label="Nom">
                    <input
                      type="text"
                      value={profil.nom}
                      onChange={(e) => setProfil({ ...profil, nom: e.target.value })}
                      className={inputClass}
                    />
                  </Row>
                  <Row label="Adresse email">
                    <input
                      type="email"
                      value={profil.email}
                      onChange={(e) => setProfil({ ...profil, email: e.target.value })}
                      className={inputClass}
                    />
                  </Row>
                  <Row label="Direction">
                    <input
                      type="text"
                      value={profil.direction}
                      onChange={(e) => setProfil({ ...profil, direction: e.target.value })}
                      className={inputClass}
                    />
                  </Row>
                </>
              ) : (
                <>
                  <Row label="Prénom">
                    <input
                      type="text"
                      value={respProfil.firstName}
                      onChange={(e) => setRespProfil({ ...respProfil, firstName: e.target.value })}
                      className={inputClass}
                    />
                  </Row>
                  <Row label="Nom">
                    <input
                      type="text"
                      value={respProfil.lastName}
                      onChange={(e) => setRespProfil({ ...respProfil, lastName: e.target.value })}
                      className={inputClass}
                    />
                  </Row>
                  <Row label="Adresse email">
                    <input
                      type="email"
                      value={respProfil.email}
                      onChange={(e) => setRespProfil({ ...respProfil, email: e.target.value })}
                      className={inputClass}
                    />
                  </Row>
                  <Row label="Téléphone">
                    <input
                      type="tel"
                      value={respProfil.phone}
                      onChange={(e) => setRespProfil({ ...respProfil, phone: e.target.value })}
                      className={inputClass}
                    />
                  </Row>
                  <Row label="Poste">
                    <input
                      type="text"
                      value={respProfil.poste}
                      onChange={(e) => setRespProfil({ ...respProfil, poste: e.target.value })}
                      className={inputClass}
                    />
                  </Row>
                  <Row label="Direction">
                    <span className="block text-right text-[15px] text-muted-foreground/70 select-none">
                      {respProfil.directionName || '—'}
                    </span>
                  </Row>
                </>
              )}
            </Group>
          </div>
        )}


        {/* Bottom save */}
        <button
          type="submit"
          className={`flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] text-[16px] font-semibold text-white transition-colors ${APPLE_red}`}
        >
          {saved && <Check className="h-5 w-5" strokeWidth={3} />}
          {saved ? 'Enregistré' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  );
}