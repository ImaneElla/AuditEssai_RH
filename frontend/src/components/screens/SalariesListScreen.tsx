"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import {
  Search,
  UserPlus,
  Clock,
  Building2,
  Grid2X2,
  List,
  CalendarDays,
  UserRound,
  Mail,
  Phone,
  Zap,
  CheckCircle2,
  X,
  TriangleAlert,
  LayoutList,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const inputBase =
  "w-full text-xs px-3 py-2 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:bg-card focus:outline-none transition-all text-foreground";

const inputWithIcon =
  "w-full pl-9 pr-3 py-2 text-xs bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:bg-card focus:outline-none transition-all text-foreground";

const PeriodeLabel = (j: string) =>
  j === "TROIS_MOIS" || j === "DEUX_MOIS" ? "Bilan 3 mois" : j === "SIX_MOIS" || j === "CINQ_MOIS" ? "Bilan 6 mois" : "Clôturé";

const statutLabel = (s: string) =>
  s === "EN_COURS"
    ? "En cours"
    : s === "CONFIRMEE"
    ? "Confirmée"
    : s === "RENOUVELEE"
    ? "Renouvelée"
    : "Rupture";

const statutVariant = (s: string): "appleGreen" | "secondary" | "destructive" =>
  s === "CONFIRMEE" ? "appleGreen" : s === "RUPTURE" ? "destructive" : "secondary";

const formatDateFr = (dateStr: string): string => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}-${month}-${d.getFullYear()}`;
};

const addMonthsFormatted = (dateStr: string, months: number): string => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  d.setMonth(d.getMonth() + months);
  return formatDateFr(d.toISOString());
};

export default function SalariesListScreen() {
  const {
    salaries = [],
    directions,
    responsables = [],
    periodes = [],
    addSalarie,
    navigateTo,
    currentRole,
    isAddSalarieModalOpen,
    openAddSalarieModal,
    closeAddSalarieModal,
  } = useApp();

  const divisions = directions;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState<string>("ALL");
  const [selectedStatut, setSelectedStatut] = useState<string>("ALL");
  const [selectedPeriode, setSelectedPeriode] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const buildEmptyForm = () => ({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    poste: "",
    divisionId: divisions[0]?.id || 1,
    responsableId: responsables[0]?.id || 1,
    dateEmbauche: new Date().toISOString().slice(0, 10),
  });

  const [form, setForm] = useState(buildEmptyForm);

  const handleOpenAddModal = () => {
    setForm(buildEmptyForm());
    openAddSalarieModal();
  };

  const handleNameChange = (firstName: string, lastName: string) => {
    setForm((prev) => {
      const next = { ...prev, firstName, lastName };
      if (firstName.trim() && lastName.trim()) {
        const clean = (v: string) =>
          v
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "");
        next.email = `${clean(firstName)}.${clean(lastName)}@groupe-premium.com`;
      }
      return next;
    });
  };

  const calculated3M = addMonthsFormatted(form.dateEmbauche, 3);
  const calculated6M = addMonthsFormatted(form.dateEmbauche, 6);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.poste ||
      !form.dateEmbauche
    ) {
      return;
    }

    addSalarie({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      poste: form.poste,
      dateEmbauche: form.dateEmbauche,
      dureeInitialeMois: 6,
      directionId: form.divisionId,
      responsableId: form.responsableId,
    });

    closeAddSalarieModal();
  };

  const filteredSalaries = useMemo(() => {
    return salaries.filter((s) => {
      if (s.actif === false) return false;

      const matchesSearch =
        `${s.firstName} ${s.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.poste.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDivision =
        selectedDivision === "ALL" ||
        s.directionId === Number(selectedDivision);

      const matchesStatut =
        selectedStatut === "ALL" || s.statutEssai === selectedStatut;

      const matchesPeriode =
        selectedPeriode === "ALL" ||
        s.PeriodeActuel === selectedPeriode ||
        (selectedPeriode === "TROIS_MOIS" && s.PeriodeActuel === "DEUX_MOIS") ||
        (selectedPeriode === "SIX_MOIS" && s.PeriodeActuel === "CINQ_MOIS");

      return matchesSearch && matchesDivision && matchesStatut && matchesPeriode;
    });
  }, [salaries, searchTerm, selectedDivision, selectedStatut, selectedPeriode]);

  const isRH = currentRole === "ADMIN_RH";

  const openEvaluation = (salarieId: number) => {
    const salariePeriodes = periodes.filter((p) => p.salarieId === salarieId);
    const activeP =
      salariePeriodes.find((p) => p.statut !== "VALIDEE_RH") ||
      salariePeriodes[0];

    if (activeP) {
      navigateTo("formulaire-evaluation", { periodeId: activeP.id });
    }
  };

  return (
    <div className="space-y-5 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-foreground tracking-tight">
            {isRH ? "Salariés en Période d’Essai" : "Mes Salariés Affectés"}
          </h2>

          <p className="text-xs text-muted-foreground">
            {isRH
              ? `Total : ${filteredSalaries.length} collaborateur${
                  filteredSalaries.length > 1 ? "s répertoriés" : " répertorié"
                }`
              : `Équipe Gestion de Patrimoine • ${
                  filteredSalaries.length
                } collaborateur${
                  filteredSalaries.length > 1
                    ? "s sous votre responsabilité"
                    : " sous votre responsabilité"
                }`}
          </p>
        </div>

        {isRH && (
          <Button
            onClick={handleOpenAddModal}
            size="default"
            className="btn-gradient flex items-center gap-2 shrink-0"
          >
            <UserPlus className="w-4 h-4" strokeWidth={1.75} />
            <span>Ajouter un salarié</span>
          </Button>
        )}
      </div>

      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search
              className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"
              strokeWidth={1.75}
            />

            <input
              type="text"
              placeholder="Rechercher par nom, prénom, email ou intitulé de poste..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-card transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {isRH && (
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="text-xs bg-secondary/50 border border-border rounded-xl px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
              >
                <option value="ALL">Toutes les Divisions</option>

                {divisions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            )}

            <select
              value={selectedStatut}
              onChange={(e) => setSelectedStatut(e.target.value)}
              className="text-xs bg-secondary/50 border border-border rounded-xl px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tous les Statuts</option>
              <option value="EN_COURS">En cours d&apos;essai</option>
              <option value="RENOUVELEE">Renouvelée</option>
              <option value="CONFIRMEE">Confirmée</option>
              <option value="RUPTURE">Rupture</option>
            </select>

            <select
              value={selectedPeriode}
              onChange={(e) => setSelectedPeriode(e.target.value)}
              className="text-xs bg-secondary/50 border border-border rounded-xl px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
            >
              <option value="ALL">Toutes les Périodes</option>
              <option value="TROIS_MOIS">Bilan 3 Mois</option>
              <option value="SIX_MOIS">Bilan 6 Mois</option>
              <option value="TERMINE">Période Clôturée</option>
            </select>

            <div className="h-6 w-px bg-border hidden lg:block mx-0.5" />

            {/* Sélecteur de vue (Liste / Grille) */}
            <div className="flex items-center p-0.5 bg-secondary/80 border border-border rounded-xl gap-0.5 shrink-0">
              <Button
                type="button"
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`h-7 w-7 p-0 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-card shadow-2xs border border-border text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Vue en liste"
              >
                <LayoutList className="w-3.5 h-3.5" strokeWidth={1.75} />
              </Button>

              <Button
                type="button"
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`h-7 w-7 p-0 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-card shadow-2xs border border-border text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Vue en cartes"
              >
                <Grid2X2 className="w-3.5 h-3.5" strokeWidth={1.75} />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {filteredSalaries.length === 0 ? (
        <Card className="py-12">
          <div className="text-center text-muted-foreground">
            <UserRound className="w-8 h-8 mx-auto mb-3 opacity-50" />

            <p className="text-sm font-medium">Aucun collaborateur trouvé</p>

            <p className="text-xs mt-1">
              Aucun collaborateur ne correspond aux critères de recherche
              sélectionnés.
            </p>
          </div>
        </Card>
      ) : viewMode === "list" ? (
        <Card className="overflow-hidden border border-border/80 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed text-left text-xs border-collapse">
              <colgroup>
                <col style={{ width: "30%" }} />
                <col style={{ width: "26%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "10%" }} />
              </colgroup>

              <thead className="bg-secondary/60 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 whitespace-nowrap">Collaborateur</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Poste & Direction</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Responsable N+1</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Dates Clés</th>
                  <th className="py-3.5 px-4 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60 text-foreground">
                {filteredSalaries.map((salarie) => {
                  const hasOverdue = periodes.some(
                    (p) => p.salarieId === salarie.id && p.statut === "EN_RETARD"
                  );

                  return (
                    <tr
                      key={salarie.id}
                      className={`hover:bg-secondary/40 transition-colors ${
                        hasOverdue ? "bg-destructive/5" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 align-middle whitespace-nowrap overflow-hidden">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary to-secondary/60 border border-border text-foreground font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                            {salarie.firstName[0]}
                            {salarie.lastName[0]}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 min-w-0">
                              <button
                                type="button"
                                title={`${salarie.firstName} ${salarie.lastName}`}
                                onClick={() =>
                                  navigateTo("detail-salarie", {
                                    salarieId: salarie.id,
                                  })
                                }
                                className="font-semibold text-foreground hover:text-primary cursor-pointer text-xs tracking-tight truncate text-left"
                              >
                                {salarie.firstName} {salarie.lastName}
                              </button>

                              {salarie.matricule && (
                                <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-md border border-border/60 shrink-0">
                                  {salarie.matricule}
                                </span>
                              )}
                            </div>

                            <span
                              title={salarie.email}
                              className="text-[11px] text-muted-foreground block truncate mt-0.5"
                            >
                              {salarie.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 align-middle whitespace-nowrap overflow-hidden">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Building2
                              className="w-3.5 h-3.5 text-muted-foreground shrink-0"
                              strokeWidth={1.75}
                            />
                            <p title={salarie.poste} className="font-semibold text-foreground text-xs truncate">
                              {salarie.poste}
                            </p>
                          </div>
                          <p title={salarie.directionName} className="text-[11px] text-muted-foreground truncate pl-5 mt-0.5">
                            {salarie.directionName}
                          </p>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 align-middle whitespace-nowrap overflow-hidden">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-secondary border border-border/80 flex items-center justify-center text-[10px] font-semibold text-muted-foreground shrink-0">
                            {salarie.responsableNom ? salarie.responsableNom[0] : "R"}
                          </div>
                          <p title={salarie.responsableNom} className="font-medium text-foreground text-xs truncate">
                            {salarie.responsableNom || "—"}
                          </p>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 align-middle whitespace-nowrap overflow-hidden font-mono text-[11px]">
                        <div className="space-y-0.5">
                          <div className="truncate text-foreground">
                            <span className="text-muted-foreground font-sans text-[10px] uppercase font-semibold mr-1.5">Entrée:</span>
                            {salarie.dateEmbauche}
                          </div>
                          <div className="truncate text-muted-foreground">
                            <span className="text-muted-foreground font-sans text-[10px] uppercase font-semibold mr-1.5">Terme:</span>
                            {salarie.dateFinPrevisionnelle}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 align-middle whitespace-nowrap text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigateTo("detail-salarie", {
                              salarieId: salarie.id,
                            })
                          }
                          className="cursor-pointer h-8 px-3 rounded-lg border-border hover:bg-secondary text-foreground text-xs font-medium inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" strokeWidth={1.75} />
                          Détail
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredSalaries.map((salarie) => {
            const hasOverdue = periodes.some(
              (p) => p.salarieId === salarie.id && p.statut === "EN_RETARD"
            );

            return (
              <Card
                key={salarie.id}
                className={`overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                  hasOverdue ? "border-destructive/30 bg-destructive/5" : ""
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-secondary border border-border text-foreground font-bold flex items-center justify-center text-xs shrink-0">
                        {salarie.firstName[0]}
                        {salarie.lastName[0]}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() =>
                              navigateTo("detail-salarie", {
                                salarieId: salarie.id,
                              })
                            }
                            className="font-semibold text-foreground hover:text-primary cursor-pointer text-sm tracking-tight text-left"
                          >
                            {salarie.firstName} {salarie.lastName}
                          </button>

                          {salarie.matricule && (
                            <span className="text-[9px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-border/60">
                              {salarie.matricule}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-[180px]">
                            {salarie.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Badge
                      variant={statutVariant(salarie.statutEssai)}
                      className="text-[10px] font-normal shrink-0"
                    >
                      {statutLabel(salarie.statutEssai)}
                    </Badge>
                  </div>

                  <div className="h-px bg-border/60 my-4" />

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-foreground">
                      {salarie.poste}
                    </p>

                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                      <Building2 className="w-3 h-3" strokeWidth={1.75} />
                      <span>{salarie.directionName}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-secondary/50 border border-border/50 p-3">
                      <p className="text-[9px] uppercase tracking-wide text-muted-foreground mb-1">
                        Responsable
                      </p>

                      <p className="text-xs font-medium text-foreground truncate">
                        {salarie.responsableNom}
                      </p>

                      <p className="text-[9px] text-muted-foreground mt-0.5">
                        Responsable
                      </p>
                    </div>

                    <div className="rounded-xl bg-secondary/50 border border-border/50 p-3">
                      <p className="text-[9px] uppercase tracking-wide text-muted-foreground mb-1">
                        Periode actif
                      </p>

                      <Badge
                        variant="secondary"
                        className="inline-flex items-center gap-1 text-[10px] font-normal"
                      >
                        <Clock className="w-3 h-3" strokeWidth={1.75} />
                        {PeriodeLabel(salarie.PeriodeActuel)}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl bg-secondary/30 border border-border/40 p-3">
                    <div className="flex items-center gap-2">
                      <CalendarDays
                        className="w-4 h-4 text-muted-foreground"
                        strokeWidth={1.75}
                      />

                      <div className="flex-1">
                        <div className="flex justify-between gap-2 text-[10px]">
                          <span className="text-muted-foreground">Entrée</span>

                          <span className="font-mono font-medium text-foreground">
                            {salarie.dateEmbauche}
                          </span>
                        </div>

                        <div className="flex justify-between gap-2 text-[10px] mt-1">
                          <span className="text-muted-foreground">Terme</span>

                          <span className="font-mono text-muted-foreground">
                            {salarie.dateFinPrevisionnelle}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {hasOverdue && (
                    <div className="mt-3 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 relative flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                        <TriangleAlert className="w-4 h-4 text-yellow-600" />
                      </div>

                      <span className="text-[10px] text-rose-700 font-medium">
                        Retard &gt; 2 jours
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t border-border/60 bg-secondary/20 px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigateTo("detail-salarie", {
                          salarieId: salarie.id,
                        })
                      }
                      className="cursor-pointer text-xs"
                    >
                      Détail
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => openEvaluation(salarie.id)}
                      className="btn-gradient cursor-pointer text-xs"
                    >
                      Évaluer
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {isAddSalarieModalOpen && (
        <div
          onClick={closeAddSalarieModal}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/20 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  Créer un Salarié &amp; Automatiser le Suivi d&apos;Essai
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  L&apos;enregistrement calcule automatiquement les Périodes d&apos;évaluation à 3 mois et 6 mois et programme les envois à 09:00.
                </p>
              </div>

              <button
                type="button"
                aria-label="Fermer"
                onClick={closeAddSalarieModal}
                className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-5">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-border/70">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h4 className="text-xs font-semibold text-foreground tracking-tight">
                    Identité du Collaborateur
                  </h4>
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
                      value={form.firstName}
                      onChange={(e) => handleNameChange(e.target.value, form.lastName)}
                      className={inputBase}
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
                      value={form.lastName}
                      onChange={(e) => handleNameChange(form.firstName, e.target.value)}
                      className={inputBase}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Email Professionnel <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <Mail
                        className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"
                        strokeWidth={1.75}
                      />
                      <input
                        type="email"
                        required
                        placeholder="prenom.nom@premium.africa"
                        value={form.email}
                        onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                        className={`${inputWithIcon} font-mono`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Téléphone <span className="text-muted-foreground text-xs">(optionnel)</span>
                    </label>
                    <div className="relative">
                      <Phone
                        className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"
                        strokeWidth={1.75}
                      />
                      <input
                        type="text"
                        placeholder="06 XX XX XX XX"
                        value={form.phone}
                        onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                        className={inputWithIcon}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-border/70">
                  <div className="w-6 h-6 rounded-lg bg-secondary text-foreground flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h4 className="text-xs font-semibold text-foreground tracking-tight">
                    Affectation Métier &amp; Manager Référent
                  </h4>
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
                      value={form.poste}
                      onChange={(e) => setForm((prev) => ({ ...prev, poste: e.target.value }))}
                      className={inputBase}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Division <span className="text-primary">*</span>
                    </label>
                    <select
                      value={form.divisionId}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, divisionId: Number(e.target.value) }))
                      }
                      className={`${inputBase} cursor-pointer`}
                    >
                      {divisions.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Responsable <span className="text-primary">*</span>
                    </label>
                    <select
                      value={form.responsableId}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, responsableId: Number(e.target.value) }))
                      }
                      className={`${inputBase} cursor-pointer`}
                    >
                      {responsables.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.firstName} {r.lastName} ({r.poste})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-border/70">
                  <div className="w-6 h-6 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground tracking-tight">
                      Paramétrage de la Période d&apos;Essai &amp; Calcul des Échéances
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Convention collective &amp; accords Groupe Premium
                    </p>
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
                      value={form.dateEmbauche}
                      onChange={(e) => setForm((prev) => ({ ...prev, dateEmbauche: e.target.value }))}
                      className={`${inputBase} font-mono`}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                    <Zap className="w-4 h-4" strokeWidth={1.75} />
                    <span>Calculateur Automatique de Periode Groupe Premium</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-card border border-border shadow-2xs">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                        <span>Periode 1</span>
                        <Badge variant="appleBlue" className="text-[10px]">3 Mois</Badge>
                      </div>
                      <p className="font-bold text-foreground text-sm font-mono">{calculated3M || "—"}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Mail auto envoyé à <strong className="text-foreground">09:00:00</strong>
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-card border border-border shadow-2xs">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                        <span>Periode 2</span>
                        <Badge variant="applePurple" className="text-[10px]">6 Mois</Badge>
                      </div>
                      <p className="font-bold text-foreground text-sm font-mono">{calculated6M || "—"}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Bilan final avant confirmation
                      </p>
                    </div>
                  </div>

                  <div className="text-[11px] text-muted-foreground pt-1 flex items-center gap-1.5 border-t border-border/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-apple-green" strokeWidth={2} />
                    <span>Détection automatique des retards.</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={closeAddSalarieModal}
                  className="cursor-pointer"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="btn-gradient flex items-center gap-2 shadow-xs cursor-pointer px-4"
                >
                  <UserPlus className="w-4 h-4" strokeWidth={1.75} />
                  <span>Enregistrer le salarié</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}