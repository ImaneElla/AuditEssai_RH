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
  TriangleAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function SalariesListScreen() {
  const {
    salaries,
    directions,
    periodes,
    navigateTo,
    currentRole,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDirection, setSelectedDirection] = useState<string>("ALL");
  const [selectedStatut, setSelectedStatut] = useState<string>("ALL");
  const [selectedJalon, setSelectedJalon] = useState<string>("ALL");

  // Vue par défaut = Square / Cards
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredSalaries = useMemo(() => {
    return salaries.filter((s) => {
      const matchesSearch =
        `${s.firstName} ${s.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.poste.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDirection =
        selectedDirection === "ALL" ||
        s.directionId === Number(selectedDirection);

      const matchesStatut =
        selectedStatut === "ALL" ||
        s.statutEssai === selectedStatut;

      const matchesJalon =
        selectedJalon === "ALL" ||
        s.jalonActuel === selectedJalon;

      return (
        matchesSearch &&
        matchesDirection &&
        matchesStatut &&
        matchesJalon
      );
    });
  }, [
    salaries,
    searchTerm,
    selectedDirection,
    selectedStatut,
    selectedJalon,
  ]);

  const isRH = currentRole === "ADMIN_RH";

  return (
    <div className="space-y-5 font-sans">

      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-foreground tracking-tight">
            {isRH
              ? "Collaborateurs en Période d’Essai"
              : "Mes Salariés Affectés"}
          </h2>

          <p className="text-xs text-muted-foreground">
            {isRH
              ? `Total : ${filteredSalaries.length} collaborateur${
                  filteredSalaries.length > 1
                    ? "s répertoriés"
                    : " répertorié"
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
            onClick={() => navigateTo("ajouter-salarie")}
            size="default"
            className="btn-gradient flex items-center gap-2 shrink-0"
          >
            <UserPlus
              className="w-4 h-4"
              strokeWidth={1.75}
            />
            <span>Ajouter un salarié</span>
          </Button>
        )}
      </div>

      {/* =========================================================
          FILTRES
      ========================================================= */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">

          {/* Recherche */}
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

          {/* Selects */}
          <div className="flex items-center gap-2 w-full md:w-auto">

            {isRH && (
              <select
                value={selectedDirection}
                onChange={(e) =>
                  setSelectedDirection(e.target.value)
                }
                className="text-xs bg-secondary/50 border border-border rounded-xl px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
              >
                <option value="ALL">
                  Toutes les Directions
                </option>

                {directions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            )}

            <select
              value={selectedStatut}
              onChange={(e) =>
                setSelectedStatut(e.target.value)
              }
              className="text-xs bg-secondary/50 border border-border rounded-xl px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tous les Statuts</option>
              <option value="EN_COURS">
                En cours d&apos;essai
              </option>
              <option value="RENOUVELEE">
                Renouvelée
              </option>
              <option value="CONFIRMEE">
                Confirmée
              </option>
              <option value="RUPTURE">
                Rupture
              </option>
            </select>

            <select
              value={selectedJalon}
              onChange={(e) =>
                setSelectedJalon(e.target.value)
              }
              className="text-xs bg-secondary/50 border border-border rounded-xl px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tous les Jalons</option>
              <option value="DEUX_MOIS">
                Bilan 2 Mois
              </option>
              <option value="CINQ_MOIS">
                Bilan 5 Mois
              </option>
              <option value="TERMINE">
                Période Clôturée
              </option>
            </select>
          </div>
        </div>
      </Card>

      {/* =========================================================
          BARRE VUE : SQUARE / LISTE
      ========================================================= */}
      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs text-muted-foreground">
            Affichage des collaborateurs
          </p>
        </div>

        <div className="flex items-center p-1 bg-secondary/60 border border-border rounded-xl gap-1">

          {/* BOUTON SQUARE */}
          <Button
            type="button"
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={`h-8 px-3 rounded-lg flex items-center gap-2 ${
              viewMode === "grid"
                ? "bg-card shadow-sm border border-border text-foreground"
                : "text-muted-foreground"
            }`}
            title="Vue en cartes"
          >
            <Grid2X2
              className="w-4 h-4"
              strokeWidth={1.75}
            />
            <span className="hidden sm:inline text-xs">
              Cartes
            </span>
          </Button>

          {/* BOUTON LISTE */}
          <Button
            type="button"
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={`h-8 px-3 rounded-lg flex items-center gap-2 ${
              viewMode === "list"
                ? "bg-card shadow-sm border border-border text-foreground"
                : "text-muted-foreground"
            }`}
            title="Vue en liste"
          >
            <List
              className="w-4 h-4"
              strokeWidth={1.75}
            />
            <span className="hidden sm:inline text-xs">
              Liste
            </span>
          </Button>
        </div>
      </div>

      {/* =========================================================
          MESSAGE AUCUN RESULTAT
      ========================================================= */}
      {filteredSalaries.length === 0 ? (
        <Card className="py-12">
          <div className="text-center text-muted-foreground">
            <UserRound className="w-8 h-8 mx-auto mb-3 opacity-50" />

            <p className="text-sm font-medium">
              Aucun collaborateur trouvé
            </p>

            <p className="text-xs mt-1">
              Aucun collaborateur ne correspond aux critères
              de recherche sélectionnés.
            </p>
          </div>
        </Card>
      ) : viewMode === "grid" ? (

        /* =========================================================
           VUE SQUARE / CARDS
        ========================================================= */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {filteredSalaries.map((salarie) => {

            const salariePeriodes = periodes.filter(
              (p) => p.salarieId === salarie.id
            );

            const hasOverdue = salariePeriodes.some(
              (p) => p.statut === "EN_RETARD"
            );

            return (
              <Card
                key={salarie.id}
                className={`overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                  hasOverdue
                    ? "border-destructive/30 bg-destructive/5"
                    : ""
                }`}
              >

                {/* CARD HEADER */}
                <div className="p-5">

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-center gap-3 min-w-0">

                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-xl bg-secondary border border-border text-foreground font-bold flex items-center justify-center text-xs shrink-0">
                        {salarie.firstName[0]}
                        {salarie.lastName[0]}
                      </div>

                      {/* Nom + matricule */}
                      <div className="min-w-0">

                        <div className="flex items-center gap-1.5 flex-wrap">

                          <button
                            type="button"
                            onClick={() =>
                              navigateTo(
                                "detail-salarie",
                                {
                                  salarieId: salarie.id,
                                }
                              )
                            }
                            className="font-semibold text-foreground hover:text-primary cursor-pointer text-sm tracking-tight text-left"
                          >
                            {salarie.firstName}{" "}
                            {salarie.lastName}
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

                    {/* STATUT */}
                    <Badge
                      variant={
                        salarie.statutEssai ===
                        "CONFIRMEE"
                          ? "appleGreen"
                          : salarie.statutEssai ===
                            "RENOUVELEE"
                          ? "secondary"
                          : salarie.statutEssai ===
                            "RUPTURE"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-[10px] font-normal shrink-0"
                    >
                      {salarie.statutEssai ===
                      "EN_COURS"
                        ? "En cours"
                        : salarie.statutEssai ===
                          "CONFIRMEE"
                        ? "Confirmée"
                        : salarie.statutEssai ===
                          "RENOUVELEE"
                        ? "Renouvelée"
                        : "En retard"}
                    </Badge>

                  </div>

                  {/* SEPARATOR */}
                  <div className="h-px bg-border/60 my-4" />

                  {/* POSTE */}
                  <div className="mb-4">

                    <p className="text-sm font-semibold text-foreground">
                      {salarie.poste}
                    </p>

                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                      <Building2
                        className="w-3 h-3"
                        strokeWidth={1.75}
                      />
                      <span>
                        {salarie.directionName}
                      </span>
                    </p>

                  </div>

                  {/* INFORMATIONS */}
                  <div className="grid grid-cols-2 gap-3">

                    {/* RESPONSABLE */}
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

                    {/* JALON */}
                    <div className="rounded-xl bg-secondary/50 border border-border/50 p-3">

                      <p className="text-[9px] uppercase tracking-wide text-muted-foreground mb-1">
                        Jalon actif
                      </p>

                      <Badge
                        variant="secondary"
                        className="inline-flex items-center gap-1 text-[10px] font-normal"
                      >
                        <Clock
                          className="w-3 h-3"
                          strokeWidth={1.75}
                        />

                        {salarie.jalonActuel ===
                        "DEUX_MOIS"
                          ? "Bilan 2 mois"
                          : salarie.jalonActuel ===
                            "CINQ_MOIS"
                          ? "Bilan 5 mois"
                          : "Clôturé"}
                      </Badge>

                    </div>

                  </div>

                  {/* DATES */}
                  <div className="mt-3 rounded-xl bg-secondary/30 border border-border/40 p-3">

                    <div className="flex items-center gap-2">

                      <CalendarDays
                        className="w-4 h-4 text-muted-foreground"
                        strokeWidth={1.75}
                      />

                      <div className="flex-1">

                        <div className="flex justify-between gap-2 text-[10px]">
                          <span className="text-muted-foreground">
                            Entrée
                          </span>

                          <span className="font-mono font-medium text-foreground">
                            {salarie.dateEmbauche}
                          </span>
                        </div>

                        <div className="flex justify-between gap-2 text-[10px] mt-1">
                          <span className="text-muted-foreground">
                            Terme
                          </span>

                          <span className="font-mono text-muted-foreground">
                            {salarie.dateFinPrevisionnelle}
                          </span>
                        </div>

                      </div>

                    </div>

                  </div>

                  {/* RETARD */}
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

                {/* ACTIONS */}
                <div className="border-t border-border/60 bg-secondary/20 px-5 py-3">

                  <div className="flex items-center justify-end gap-2">

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigateTo(
                          "detail-salarie",
                          {
                            salarieId: salarie.id,
                          }
                        )
                      }
                      className="cursor-pointer text-xs"
                    >
                      Détail
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => {
                        const activeP =
                          salariePeriodes.find(
                            (p) =>
                              p.statut !==
                              "VALIDEE_RH"
                          ) ||
                          salariePeriodes[0];

                        if (activeP) {
                          navigateTo(
                            "formulaire-evaluation",
                            {
                              periodeId:
                                activeP.id,
                            }
                          );
                        }
                      }}
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

      ) : (

        /* =========================================================
           VUE LISTE / TABLEAU
        ========================================================= */
        <Card className="overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full text-left text-xs">

              <thead className="bg-secondary/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">

                <tr>

                  <th className="py-3.5 px-4">
                    Salarié
                  </th>

                  <th className="py-3.5 px-4">
                    Poste & Direction
                  </th>

                  <th className="py-3.5 px-4">
                    Responsable N+1
                  </th>

                  <th className="py-3.5 px-4">
                    Embauche & Échéance
                  </th>

                  <th className="py-3.5 px-4">
                    Jalon Actif
                  </th>

                  <th className="py-3.5 px-4">
                    Statut Essai
                  </th>

                  <th className="py-3.5 px-4 text-right">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-border/60 text-foreground">

                {filteredSalaries.map((salarie) => {

                  const salariePeriodes =
                    periodes.filter(
                      (p) =>
                        p.salarieId ===
                        salarie.id
                    );

                  const hasOverdue =
                    salariePeriodes.some(
                      (p) =>
                        p.statut ===
                        "EN_RETARD"
                    );

                  return (
                    <tr
                      key={salarie.id}
                      className={`hover:bg-secondary/40 transition-colors ${
                        hasOverdue
                          ? "bg-destructive/5"
                          : ""
                      }`}
                    >

                      {/* SALARIE */}
                      <td className="py-3.5 px-4">

                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 rounded-xl bg-secondary border border-border text-foreground font-bold flex items-center justify-center text-xs shrink-0">
                            {salarie.firstName[0]}
                            {salarie.lastName[0]}
                          </div>

                          <div>

                            <div className="flex items-center gap-1.5">

                              <button
                                type="button"
                                onClick={() =>
                                  navigateTo(
                                    "detail-salarie",
                                    {
                                      salarieId:
                                        salarie.id,
                                    }
                                  )
                                }
                                className="font-semibold text-foreground hover:text-primary cursor-pointer text-xs tracking-tight"
                              >
                                {salarie.firstName}{" "}
                                {salarie.lastName}
                              </button>

                              {salarie.matricule && (
                                <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.2 rounded border border-border/60">
                                  {
                                    salarie.matricule
                                  }
                                </span>
                              )}

                            </div>

                            <span className="text-[11px] text-muted-foreground block">
                              {salarie.email}
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* POSTE */}
                      <td className="py-3.5 px-4">

                        <p className="font-medium text-foreground text-xs">
                          {salarie.poste}
                        </p>

                        <p className="text-[11px] text-muted-foreground flex items-center gap-1">

                          <Building2
                            className="w-3 h-3 text-muted-foreground"
                            strokeWidth={1.75}
                          />

                          <span>
                            {salarie.directionName}
                          </span>

                        </p>

                      </td>

                      {/* RESPONSABLE */}
                      <td className="py-3.5 px-4">

                        <p className="font-medium text-foreground text-xs">
                          {salarie.responsableNom}
                        </p>

                        <p className="text-[10px] text-muted-foreground">
                          Responsable N+1
                        </p>

                      </td>

                      {/* DATES */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">

                        <div>
                          <strong className="text-foreground">
                            Entrée :
                          </strong>{" "}
                          {salarie.dateEmbauche}
                        </div>

                        <div className="text-muted-foreground">
                          Terme :{" "}
                          {
                            salarie.dateFinPrevisionnelle
                          }
                        </div>

                      </td>

                      {/* JALON */}
                      <td className="py-3.5 px-4">

                        <Badge
                          variant="secondary"
                          className="inline-flex items-center gap-1 text-[11px] font-normal"
                        >
                          <Clock
                            className="w-3 h-3 text-muted-foreground"
                            strokeWidth={1.75}
                          />

                          {salarie.jalonActuel ===
                          "DEUX_MOIS"
                            ? "Bilan 2 mois"
                            : salarie.jalonActuel ===
                              "CINQ_MOIS"
                            ? "Bilan 5 mois"
                            : "Clôturé"}
                        </Badge>

                      </td>

                      {/* STATUT */}
                      <td className="py-3.5 px-4">

                        <Badge
                          variant={
                            salarie.statutEssai ===
                            "CONFIRMEE"
                              ? "appleGreen"
                              : salarie.statutEssai ===
                                "RENOUVELEE"
                              ? "secondary"
                              : salarie.statutEssai ===
                                "RUPTURE"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-[11px] font-normal"
                        >
                          {salarie.statutEssai ===
                          "EN_COURS"
                            ? "En cours"
                            : salarie.statutEssai ===
                              "CONFIRMEE"
                            ? "Confirmée"
                            : salarie.statutEssai ===
                              "RENOUVELEE"
                            ? "Renouvelée"
                            : "Rupture"}
                        </Badge>

                        {hasOverdue && (
                          <span className="block mt-1 text-[10px] text-rose-700 font-medium">
                            ⚠️ Retard &gt; 2j
                          </span>
                        )}

                      </td>

                      {/* ACTIONS */}
                      <td className="py-3.5 px-4 text-right">

                        <div className="flex items-center justify-end gap-1.5">

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigateTo(
                                "detail-salarie",
                                {
                                  salarieId:
                                    salarie.id,
                                }
                              )
                            }
                            className="cursor-pointer"
                          >
                            Détail
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => {
                              const activeP =
                                salariePeriodes.find(
                                  (p) =>
                                    p.statut !==
                                    "VALIDEE_RH"
                                ) ||
                                salariePeriodes[0];

                              if (activeP) {
                                navigateTo(
                                  "formulaire-evaluation",
                                  {
                                    periodeId:
                                      activeP.id,
                                  }
                                );
                              }
                            }}
                            className="btn-gradient cursor-pointer"
                          >
                            Évaluer
                          </Button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </Card>
      )}

    </div>
  );
}