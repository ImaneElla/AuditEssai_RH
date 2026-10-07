<p align="center">
  <img src="PremiumBanner.png" alt="AuditEssai RH Banner" width="100%" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Backend-Spring%20Boot%203%20%7C%20PostgreSQL-000000?style=for-the-badge&logo=springboot&logoColor=white" />
  <img src="https://img.shields.io/badge/Frontend-Next.js%2014%20%7C%20Bun%20%7C%20TailwindCSS-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/API%20Doc-Swagger%20%2F%20OpenAPI%203.0-000000?style=for-the-badge&logo=swagger&logoColor=white" />
  <img src="https://img.shields.io/badge/Deployment-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/Stage-2025%2F2026-000000?style=for-the-badge" />
</p>

---

### 🌐 Live Demo & API Documentation

* **Application Web (Vercel) :** [https://auditessai-rh.vercel.app/](https://auditessai-rh.vercel.app/)
* **Swagger Interactive UI :** [https://auditessai-rh.vercel.app/api-doc](https://auditessai-rh.vercel.app/api-doc)
* **Spécification OpenAPI (JSON) :** [https://auditessai-rh.vercel.app/api/doc](https://auditessai-rh.vercel.app/api/doc)

---

### 🔴 À propos du Projet

**AuditEssai RH** est un SaaS RH moderne conçu pour digitaliser, automatiser et sécuriser l'ensemble du cycle de vie des périodes d'essai (3 mois & 6 mois). 

L'application élimine les risques juridiques liés au dépassement des délais légaux d'évaluation en introduisant une gouvernance stricte basée sur un design premium **Rouge & Noir**, un système d'audit automatique et des relances managériales automatisées.

---

### 🔴 Fonctionnalités Clés & Automatisation Métier

* **Calcul Automatique des Échéances :** Génération instantanée des dates prévisionnelles d'évaluation (3 mois et 6 mois) dès l'intégration du collaborateur.
* **Moteur d'Alerte & Cron Jobs :** Exécution quotidienne à 09h00 pour l'envoi des rappels automatiques par e-mail (J-21, J-14, J-7).
* **Détection Automatique des Retards (J+2) :** Passage automatique en statut `EN_RETARD` 🔴 avec notifications et historique d'audit si une évaluation dépasse le délai de 2 jours.
* **Formulaire d'Évaluation Officiel (24 Critères) :** Grille d'évaluation complète (Compétences professionnelles, Aptitudes personnelles, QSE) avec calcul des moyennes et prise de décision finale (*Validation*, *Prolongation*, *Rupture*).
* **Gestion des Cas Particuliers :** Clôture immédiate et blocage des envois de mails en cas de démission ou rupture anticipée du contrat.
* **Dashboard & KPIs RH :** Suivi centralisé du nombre de dossiers en cours, des évaluations à venir, des retards et du taux de titularisation.

---

### 🔴 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Hosting & Deployment** | `Vercel` |
| **Frontend Framework** | `Next.js 14` (App Router) + `TypeScript` + `Tailwind CSS` |
| **Backend Framework** | `Spring Boot 3` (Java 21) + `Spring Data JPA` + `Spring Security` |
| **Database** | `PostgreSQL 17` |
| **Automation & Mail** | `Spring Scheduler` (`@Scheduled` at 09:00) + `Spring Mail` |
| **Runtime & Package Manager** | `Bun` (Frontend) & `Maven` (Backend) |
| **API Documentation** | `Swagger UI` / `OpenAPI 3.0` (Next.js Integrated) |

---

### 📖 Workflow Global du Système

```text
RH crée le Salarié (Date d'embauche)
         │
         ▼
Calcul automatique Échéance P1 (3 mois)
         │
         ├──► Batch 09h00 : Email automatique (J-21, J-14, J-7)
         │
         ▼
Évaluation réalisée par le Responsable
         │
         ├─► [Si non soumis à J+14] ──► Statut EN_RETARD 🔴 + Relance automatique
         │
         ▼
Décision RH / Validation
         │
         ├─► [Si Validation] ────► Génération automatique P2 (6 mois)
         └─► [Si Rupture/Démission] ──► Arrêt immédiat du cycle + Blocage des mails

```

### 1. Backend Setup (Spring Boot)
```Bash
cd backend
mvn clean compile
mvn spring-boot:run

```
API accessible sur : http://localhost:8080/api

### 2. Frontend Setup (Next.js & Bun)
```Bash
cd frontend
bun install
bun run dev

```
Application disponible sur : http://localhost:3000
