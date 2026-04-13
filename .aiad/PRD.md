# PRD — AIAD Studio v2.0

---

**Document** : Product Requirements Document
**Produit** : AIAD Studio
**Version** : 2.0
**Auteur** : Steeve Evers (Gardien AIAD)
**Date** : 2026-04-13
**Statut** : Validé
**Évolution depuis v1.0** : Intégration du pilier **Context Mesh** (Personal OS + Company OS). Inspiré par les retours terrain et la conférence *"Claude Code au-delà du code"* (AI Product Day, avril 2026).

---

## Table des matières

1. Contexte et Problème
2. Vision Produit et North Star
3. Positionnement et Modèle Économique
4. Personas et Use Cases
5. Outcome Criteria
6. Périmètre Fonctionnel V1
7. Modèle de Données
8. Intégrations V1
9. Sécurité et Conformité
10. Trade-offs et Décisions Clés
11. Dépendances et Risques
12. Roadmap Post-V1
13. Critères de Succès

---

## 1. Contexte et Problème

### 1.1 Situation actuelle

Le framework AIAD (v1.5) et le SDD Mode (v1.3) proposent une méthodologie complète pour le développement logiciel à l'ère des agents IA. Ils définissent 5 responsabilités humaines, 4 boucles itératives, 24 commandes, un cycle rigoureux (Intent → SPEC → Gate → Exec → Validate → Drift Lock), des métriques informantes (DORA + Flow) et une gouvernance réglementaire intégrée (EU AI Act, RGPD, RGAA, RGESN).

Aujourd'hui, ces concepts existent sous forme documentaire — des fichiers Markdown dans un répertoire `.aiad/`, manipulés manuellement ou via des commandes textuelles dans un terminal. Il n'existe aucun outillage applicatif natif pour :

- Visualiser et piloter le cycle SDD de bout en bout
- Orchestrer des agents IA (Claude, Codex, Cursor, Gemini...) dans le cadre AIAD
- Suivre les métriques DORA et Flow en temps réel
- Coordonner les rituels et synchronisations d'équipe
- Garantir la gouvernance réglementaire de manière systématique
- Gérer les budgets de contexte et les coûts d'exécution agent

### 1.2 Le gap Personal OS → Company OS

Au-delà de l'outillage du cycle SDD, un second problème structurel émerge du terrain : **la barrière à l'efficacité des agents IA n'est plus technique — elle est cognitive et organisationnelle**.

Les équipes qui adoptent des agents IA performants (Claude Code, Cursor, Codex…) construisent rapidement un **Personal OS** — un système personnel de contexte, de skills et de préférences qui rend chaque individu très productif. Mais cette productivité reste **cloisonnée** : chaque membre de l'équipe opère dans son propre contexte, avec ses propres conventions, sans capitalisation partagée.

Le résultat : "Super en perso, nul en collaboratif." Les équipes se retrouvent à s'envoyer du contexte par mail, à dupliquer les configurations, à réexpliquer les décisions d'un sprint à l'autre. C'est le syndrome du *"Word version 3.5 finale ne pas toucher"* appliqué aux agents IA.

**Les 4 grandes questions non-résolues** :
- **Structuration** : quels formats, quelle granularité, quel niveau de détail pour le contexte partagé ?
- **Outillage** : faut-il remplacer Notion, Confluence, Google Docs ou les connecter ?
- **Gouvernance** : qui gouverne le contexte partagé — l'IT, le management, chaque équipe ?
- **Sécurité** : qui a accès à quoi ? Comment protéger le contexte sensible ?

AIAD Studio doit apporter une réponse opinionated à ces questions, cohérente avec les valeurs du framework.

### 1.3 Qui ressent le problème

Les équipes de développement en grandes entreprises et ESN qui adoptent (ou veulent adopter) AIAD se heurtent à une friction d'adoption significative : le framework est riche mais son opérationnalisation repose entièrement sur la discipline humaine et des outils génériques (éditeurs de texte, tableurs, outils de gestion de projet non-AIAD).

De plus, les profils non-tech (CPO, Heads of Ops, chefs de projet métier) qui contribuent au contexte d'entreprise et d'équipe n'ont aujourd'hui **aucune place formalisée** dans les outils d'agents IA — alors qu'ils sont porteurs d'une part essentielle de l'intention et des décisions.

### 1.4 Impact business

Sans outillage dédié, les équipes subissent un taux d'abandon élevé après les premières semaines d'adoption AIAD. La complexité perçue (24 commandes, gouvernance Tier 1, métriques à calculer manuellement) décourage les équipes qui n'ont pas un champion AIAD expérimenté. Le framework perd en adoption ce qu'il gagne en rigueur.

Sans gestion du contexte partagé, chaque session agent repart de zéro ou d'un contexte incomplet. Le coût en tokens explose, la cohérence inter-agents s'effondre, et les décisions d'équipe se perdent entre les sessions.

### 1.5 Enjeu stratégique

AIAD Studio n'est pas seulement un outil — c'est le **canal d'acquisition principal** de l'écosystème AIAD. Le logiciel gratuit est le coût d'acquisition client le plus bas du marché. Plus Studio est adopté, plus la demande de services (formation, coaching, certification, accompagnement) augmente organiquement, sans effort commercial direct. Le produit éduque au framework par l'usage et révèle les besoins d'accompagnement par des signaux naturels (SQS bas, métriques stagnantes, drift fréquent, contexte partagé absent ou désynchronisé).

### 1.6 Inspirations

AIAD Studio s'inspire de **Paperclip** (github.com/paperclipai/paperclip), un orchestrateur d'entreprises IA autonomes qui structure des agents dans une hiérarchie d'entreprise avec budgets, gouvernance, approbations et exécution atomique des tâches. AIAD Studio reprend la puissance d'orchestration de Paperclip mais la recentre sur la philosophie AIAD : primauté de l'intention humaine, cycle SDD rigoureux, et gouvernance réglementaire européenne native.

L'architecture du **Context Mesh** s'inspire du pattern d'héritage de contexte observé dans les pratiques émergentes des équipes utilisant Claude Code : fichiers `CLAUDE.md` hiérarchisés par scope (entreprise → équipe → projet → personnel), avec résolution en cascade automatique.

---

## 2. Vision Produit et North Star

**Vision** : AIAD Studio est la plateforme de référence pour développer des logiciels avec des agents IA sous contrôle humain intentionnel, en s'appuyant sur un **contexte partagé structuré, gouverné et évolutif** — le Company OS AIAD.

**Trois piliers structurants** :
1. **Le Cycle** — SDD Mode : Intent → SPEC → Gate → Exec → Validate → Drift Lock
2. **La Gouvernance** — Tier 1 : EU AI Act, RGPD, RGAA, RGESN + Gouvernance du contexte
3. **Le Patrimoine Intentionnel** (Context Mesh) — Le substrat partagé qui nourrit humains et agents : contexte d'entreprise, d'équipe, de projet, personnel

**North Star Metric** : Nombre de cycles SDD complets (Intent → Drift Lock) exécutés avec succès par mois, toutes instances confondues.

**North Star secondaire** : Taux de sessions agent utilisant un contexte hérité à jour (< 30 jours).

**Proposition de valeur** : "Du concept au code livré — avec l'intention humaine comme fil rouge, les agents IA comme force d'exécution, un contexte partagé qui apprend en continu, et la conformité européenne comme filet de sécurité."

---

## 3. Positionnement et Modèle Économique

### 3.1 Modèle

AIAD Studio est un **outil open source**, self-hosted, distribué **gratuitement**. Ce n'est pas un SaaS. Ce choix est un avantage concurrentiel :

- Zéro friction d'adoption : pas de budget logiciel à faire valider, pas de vendor lock-in
- Confiance par défaut : code auditable, données chez le client
- Alignement avec les valeurs AIAD : ouverture radicale, sobriété intentionnelle
- Moat communautaire : chaque contributeur renforce le produit sans coût marginal

Le logiciel gratuit est le **canal d'acquisition** de l'écosystème AIAD. La monétisation porte sur ce que le logiciel ne peut pas faire seul : transmettre l'expertise, certifier la compétence, garantir le résultat.

### 3.2 Architecture économique — 4 étages

| Étage | Fonction | Nature |
|-------|----------|--------|
| **1. Studio (gratuit)** | Acquisition organique — Studio est un commercial autonome 24/7 | Coût marginal ~0€ |
| **2. Produits digitaux** | Certification Praticien AIAD (e-learning), templates, masterclass, AGENT-GUIDEs contextualisés, skills marketplace | Marge quasi-totale, scalable |
| **3. Services premium** | Pack Lancement, Coaching PE/CTO, Accompagnement Équipe, Transformation | Haute valeur, basé résultats mesurables via Studio |
| **4. Réseau de praticiens** | Praticiens certifiés délivrent les missions, commissions sur missions référées | Multiplication sans embauche |

### 3.3 Friction intentionnelle

Studio doit être suffisamment bon pour démarrer seul, mais révéler des **limites naturelles** qui orientent vers l'accompagnement :

| Signal dans Studio | Besoin révélé | Offre correspondante |
|--------------------|---------------|----------------------|
| SQS plafonné à 2-3/5 sur les premiers Intents | L'équipe ne maîtrise pas l'écriture d'Intent | Formation SDD Mode |
| Métriques DORA stagnantes après 4-6 sprints | Patterns organisationnels non résolus par l'outil | Accompagnement transformation |
| Drift détecté fréquemment après Exec | Le PE ne tient pas son rôle de gardien | Coaching PE individuel |
| Governance checks en échec récurrent | Manque de compétence conformité | Pack Conformité / AGENT-GUIDEs |
| Onboarding de nouveaux membres lent | Pas de culture AIAD installée | Certification Praticien |
| Context Mesh absent ou mono-scope après 1 mois | L'équipe ne structure pas son contexte partagé | Accompagnement Company OS |
| Contexte hérité > 80% du budget agent | Surcharge de contexte, besoin de sobriété | Coaching Context Engineering |

**Conséquence produit** : l'onboarding in-app doit **éduquer au framework**, pas seulement aux boutons. Un utilisateur qui comprend *pourquoi* le SQS existe deviendra un prescripteur interne.

### 3.4 Déploiement

**Self-hosted** — l'organisation installe et héberge l'application elle-même. Cela garantit le contrôle total des données, la conformité RGPD par design, et l'indépendance vis-à-vis de tout fournisseur SaaS. Un mode embarqué (PostgreSQL embedded) est prévu pour l'évaluation et les petites équipes.

**Option V1.1 — Démo cloud éphémère** : un environnement partagé, 14 jours, aucune donnée persistée, pour supprimer la friction d'installation. L'équipe teste en 2 clics, puis migre en self-hosted.

### 3.5 Différenciation vs Paperclip

| Dimension | Paperclip | AIAD Studio |
|-----------|-----------|-------------|
| **Philosophie** | Entreprise IA autonome (agents décident) | Intention humaine primordiale (humains décident, agents exécutent) |
| **Cycle de dev** | Issues → Agent exécute | Intent → SPEC → Gate (SQS ≥ 4/5) → Exec → Validate → Drift Lock |
| **Gouvernance** | Board humain + budget enforcement | 5 responsabilités AIAD + Gouvernance Tier 1 (AI-ACT, RGPD, RGAA, RGESN) + Gouvernance du contexte |
| **Contrôle agent** | Hiérarchie CEO → managers → workers | PE orchestre, app suggère agent optimal, PE valide |
| **Métriques** | Coûts/budgets agents | DORA + Flow + Coûts, calculés automatiquement |
| **Conformité** | Non intégrée | EU AI Act, RGPD, RGAA, RGESN natifs |
| **Contexte partagé** | Non structuré | Context Mesh 4 scopes avec héritage, gouvernance et propagation |
| **Public** | Entrepreneurs IA / startups | Grandes entreprises / ESN |

---

## 4. Personas et Use Cases

### 4.1 Personas

**Marie — Product Manager (PM)**
Responsable produit dans une ESN de 500 personnes. Elle gère 3 projets simultanés avec des équipes de 5-8 personnes. Elle veut s'assurer que les équipes construisent les bonnes choses et que les livraisons sont alignées avec la stratégie.
- Besoin : Vue macro sur les Intents, leur progression, l'alignement stratégique
- Frustration : Perd du temps à consolider manuellement les statuts projet

**Thomas — Product Engineer (PE)**
Développeur senior devenu PE. Il orchestre 2-3 agents IA par sprint et rédige les Intent Statements. Il est le gardien de l'intention au quotidien — et désormais aussi le **gardien du contexte au niveau équipe et projet**.
- Besoin : Piloter le cycle SDD de bout en bout, choisir et lancer les agents, vérifier le drift, maintenir le contexte partagé à jour
- Frustration : Jongle entre 5 outils (éditeur, terminal, Git, CI, tableur de métriques). Le contexte se perd entre les sessions.

**Aïda — Agents Engineer (AE)**
Spécialiste IA qui configure et optimise l'écosystème d'agents. Elle maintient l'AGENT-GUIDE et surveille les performances/coûts des agents. Elle est responsable de la **mécanique du Context Mesh** (infrastructure, cascade, performance).
- Besoin : Dashboard agents (santé, coûts, performance), configuration adapters, context budget monitoring, santé du Context Mesh
- Frustration : Pas de visibilité centralisée sur l'activité des agents ni sur ce que les agents chargent comme contexte

**Lucas — QA Engineer**
Ingénieur qualité qui valide les SPECs avant exécution (Gate) et les livrables après (Validate). Il porte aussi la conformité réglementaire.
- Besoin : Checklist SQS interactive, validation gouvernance, suivi des acceptance criteria
- Frustration : Les vérifications de conformité sont manuelles et chronophages

**Sophia — Tech Lead (TL)**
Architecte technique qui maintient la cohérence du système. Elle revoit les ADR, les patterns, et participe aux Tech Reviews.
- Besoin : Vue architecture, ADR management, alertes de dette technique, métriques performance
- Frustration : Les décisions d'architecture se perdent dans les conversations Slack

**Julie — Contributrice non-tech**
CPO chez une startup medtech de 20 personnes. Elle n'a pas de background technique mais utilise quotidiennement des agents IA pour son travail (daily briefing, monitoring data, préparation de réunions). Elle contribue au **contexte d'entreprise et d'équipe** : principes produit, décisions stratégiques, retours terrain.
- Besoin : Un mode d'édition du contexte guidé, non-technique, avec validation automatique de la cohérence. Pouvoir consulter les métriques et dashboards sans passer par le cycle SDD technique.
- Frustration : Se sent exclue des outils d'équipe tech qui partent du principe qu'on code. "Le terminal c'est de la magie noire."
- Valeur stratégique : Julie est un prescripteur interne puissant. C'est elle qui recommande l'accompagnement AIAD à son CEO quand elle voit la valeur du cadre. Elle est une **cliente premium potentielle des offres d'accompagnement** (Étage 3).

**Karim — Praticien Certifié AIAD**
Consultant indépendant ou salarié d'ESN, certifié Praticien AIAD. Il délivre des missions d'accompagnement chez ses clients en utilisant Studio comme outil de travail et preuve de résultat.
- Besoin : Déployer Studio rapidement chez un client avec templates pré-configurés et onboarding autonome, inclure le setup du Context Mesh dans le Pack Lancement
- Frustration : Chaque déploiement client repart de zéro, pas de templates pré-configurés par contexte métier

### 4.2 Use Cases Prioritaires (V1)

| ID | Persona | Use Case | Priorité |
|----|---------|----------|----------|
| UC-01 | PE | Créer un Intent Statement via un formulaire guidé et le lier à des SPECs | MUST |
| UC-02 | PE | Rédiger une SPEC avec scoring SQS automatique et passer l'Execution Gate | MUST |
| UC-03 | PE | Lancer un agent IA sur une SPEC `ready`, suivre l'exécution en temps réel | MUST |
| UC-04 | PE | Exécuter un Drift Check et visualiser les écarts SPEC ↔ Code | MUST |
| UC-05 | PM | Visualiser le tableau de bord des Intents (statuts, santé, progression) | MUST |
| UC-06 | QA | Valider une livraison agent (tests, conformité gouvernance, acceptance criteria) | MUST |
| UC-07 | AE | Configurer et gérer les agents IA (adapters, budgets, sessions) | MUST |
| UC-08 | TL | Gérer les ADR et visualiser l'architecture du projet | SHOULD |
| UC-09 | Équipe | Participer à un standup guidé avec données pré-chargées | SHOULD |
| UC-10 | PM+PE | Exécuter la synchronisation alignement stratégique mensuelle | SHOULD |
| UC-11 | Équipe | Consulter les métriques DORA et Flow en temps réel | MUST |
| UC-12 | QA | Exécuter un audit de gouvernance (AI-ACT, RGPD, RGAA, RGESN, Contexte) | MUST |
| UC-13 | PE | Découper une SPEC trop volumineuse via `/sdd-split` | SHOULD |
| UC-14 | PE | Relancer une SPEC bloquée via `/sdd-resume` avec contexte enrichi | SHOULD |
| UC-15 | AE | Monitorer le Context Engineering Budget en temps réel par session | MUST |
| UC-16 | Tous | Gérer des issues/tâches dans un kanban lié aux SPECs | MUST |
| UC-17 | PE | Recevoir des suggestions d'assignation agent basées sur compétences/charge/budget | MUST |
| UC-18 | Nouveau | Compléter un premier cycle SDD complet guidé par l'onboarding in-app, sans aide externe | MUST |
| UC-19 | Admin | Activer/désactiver la télémétrie anonymisée opt-in (instances, cycles, SQS) | SHOULD |
| UC-20 | Karim | Déployer Studio chez un client avec templates pré-configurés et onboarding autonome | SHOULD |
| UC-21 | Admin | Créer le scope `organization` d'une instance Studio (principes, tone, conventions) | MUST |
| UC-22 | PE/TL | Éditer le scope `team` (workflows, rituels, ways of working) via un éditeur guidé | MUST |
| UC-23 | Tous | Visualiser l'arborescence du contexte hérité pour un projet (qui apporte quoi, quel poids) | SHOULD |
| UC-24 | PE | Valider les propositions de mise à jour de contexte générées par la Context Sync Loop en fin de session | MUST |
| UC-25 | Admin | Auditer la cohérence et la fraîcheur des scopes `organization`/`team` (`/aiad-context-audit`) | SHOULD |

---

## 5. Outcome Criteria (Mesurables)

| Critère | Baseline (sans AIAD Studio) | Cible V1 | Méthode de mesure |
|---------|------------------------------|----------|-------------------|
| Temps moyen pour compléter un cycle SDD | ~4h (manipulation manuelle) | < 30min (hors exécution agent) | Timestamps Intent → Drift Lock |
| Taux de drift détecté avant merge | ~30% (vérification manuelle) | > 90% (drift check automatisé) | Ratio drifts détectés / total PRs |
| Couverture gouvernance (AI-ACT/RGPD/RGAA/RGESN) | ~20% (quand on y pense) | 100% (checklist obligatoire au Gate) | Audit logs Execution Gate |
| Temps de calcul métriques DORA/Flow | ~2h/semaine (tableur) | Temps réel (automatique) | Disponibilité dashboard |
| Nombre de cycles SDD/semaine/équipe | ~3 (friction outillage) | > 8 (fluidité) | Compteur SPECs `done` |
| Score SQS moyen au passage du Gate | Non mesuré | ≥ 4.2/5 | Moyenne historique SQS |
| Taux de complétion onboarding (1er cycle SDD sans aide) | 0% (pas d'outil) | > 60% | Funnel onboarding in-app |
| Taux de conversion instance → premier contact commercial | Non mesuré | ≥ 5% à M+12 | Télémétrie opt-in + CRM |
| **Couverture contexte** : % de sessions agent avec contexte hérité à jour (< 30 jours) | 0% (pas d'outil) | > 80% | Ratio sessions contexte frais / total sessions |
| **Taux de propagation contexte** : % de propositions Context Sync validées (vs rejetées) | N/A | > 50% | Ratio validations / propositions |

---

## 6. Périmètre Fonctionnel V1

### 6.1 Gestion de Projet et Issues

#### 6.1.1 Projets

Un **Projet** est l'unité organisationnelle principale dans AIAD Studio. Chaque projet instancie automatiquement la structure AIAD :

- Création de projet avec scaffolding `.aiad/` automatique (équivalent `/aiad-init`)
- Attribution des responsabilités AIAD par projet (multi-casquettes : un utilisateur peut être PE sur le projet Alpha et PM sur le projet Beta)
- Configuration des agents disponibles pour le projet
- Workspace Git associé (repository + branch policy)
- Tableau de bord projet (Intents, SPECs, métriques, agents, gouvernance, **contexte hérité**)
- **Rattachement au scope Context Mesh** : chaque projet hérite du contexte de son équipe et de son organisation (voir §6.9)

#### 6.1.2 Issues / Tâches

Le système d'issues est le socle de gestion de projet, **lié nativement au cycle SDD** :

**Modèle d'issue :**
- Titre, description, priorité (critical, high, medium, low)
- Assignation : utilisateur humain OU agent IA (single-assignee, comme Paperclip)
- Lien parent/enfant (décomposition hiérarchique)
- Lien SPEC : une issue peut être liée à une SPEC (ou être indépendante pour les tâches non-SDD)
- Lien Intent : traçabilité remontante automatique via la SPEC parent
- Labels, estimation, date d'échéance
- Commentaires et pièces jointes

**Workflow de statut :**

```
backlog → todo → in_progress → in_review → done
                      ↓
                   blocked → todo (unblock)
                      ↓
                  cancelled
```

**Checkout atomique** (inspiré Paperclip) : la transition vers `in_progress` verrouille la tâche (`execution_locked_at`). Un seul agent ou humain travaille sur une tâche à la fois. Cela élimine les race conditions d'exécution.

**Kanban Board** : vue par colonnes de statut, filtrable par responsabilité AIAD, par SPEC, par Intent, par assigné.

**Backlog priorisé** : vue liste avec tri par priorité, regroupement par Intent ou par SPEC.

#### 6.1.3 Responsabilités AIAD par Projet

Chaque projet définit qui porte quelle responsabilité :

| Champ | Description |
|-------|-------------|
| `project_id` | Projet concerné |
| `user_id` | Utilisateur |
| `responsibility` | `pm`, `pe`, `ae`, `qa`, `tech_lead` |
| `is_primary` | Responsable principal (un seul par responsabilité par projet) |

Un même utilisateur peut porter plusieurs responsabilités sur un même projet (ex: PE + AE dans une petite équipe). Les permissions dans l'application découlent de la responsabilité portée sur CE projet :

| Action | PM | PE | AE | QA | TL | Julie (contrib.) |
|--------|----|----|----|----|-----|-------------------|
| Créer/modifier Intent Statement | ✓ (co-auteur) | ✓ (auteur principal) | — | — | — | — |
| Rédiger/modifier SPEC | — | ✓ | — | ✓ (review) | ✓ (review) | — |
| Valider Execution Gate (SQS) | ✓ | ✓ | — | ✓ | ✓ | — |
| Lancer exécution agent | — | ✓ | ✓ | — | — | — |
| Configurer agents/adapters | — | — | ✓ | — | — | — |
| Valider livraison (Validate) | — | ✓ | — | ✓ | ✓ | — |
| Créer/modifier ADR | — | — | — | — | ✓ | — |
| Audit gouvernance | — | — | — | ✓ | — | — |
| Modifier AGENT-GUIDE | — | — | ✓ | — | — | — |
| Modifier PRD | ✓ | — | — | — | — | — |
| Modifier ARCHITECTURE | — | — | — | — | ✓ | — |
| **Éditer contexte `organization`** | — | — | — | — | — | — |
| **Éditer contexte `team`** | ✓ | ✓ | — | — | ✓ | ✓ (guidé) |
| **Éditer contexte `project`** | — | ✓ | — | — | ✓ | — |
| **Valider Context Sync** | — | ✓ | — | — | — | — |
| **Consulter Context Health** | ✓ | ✓ | ✓ | — | ✓ | ✓ |

> **Note** : le contexte `organization` est éditable uniquement par un rôle **Context Steward** désigné au niveau instance (voir §6.9.3). Le contexte `personal` est privé, non visible par les autres.

---

### 6.2 Cycle SDD Complet (11 Commandes)

Le cœur d'AIAD Studio : le cycle SDD Mode matérialisé comme workflow applicatif natif.

#### 6.2.1 `/sdd-init` — Initialisation Projet SDD

**Déclenchement** : Création d'un nouveau projet dans AIAD Studio.

**Actions automatiques :**
- Création de la structure `.aiad/` complète dans le repository Git associé :
  ```
  .aiad/
  ├── intents/_index.md
  ├── specs/_index.md
  ├── specs/archive/
  ├── context/                    # ← NOUVEAU : Context Mesh projet
  │   ├── CONTEXT.md              # Contexte spécifique au projet
  │   ├── skills/                 # Skills spécifiques au projet
  │   ├── rules/                  # Conventions spécifiques au projet
  │   └── decisions/              # Décisions contextuelles
  ├── gouvernance/
  │   ├── AIAD-AI-ACT.md
  │   ├── AIAD-RGPD.md
  │   ├── AIAD-RGAA.md
  │   └── AIAD-RGESN.md
  ├── adrs/
  ├── metrics/
  ├── PRD.md (template)
  ├── ARCHITECTURE.md (template)
  ├── AGENT-GUIDE.md (template)
  └── CHANGELOG-ARTEFACTS.md
  ```
- Commit initial dans le repository
- Configuration des hooks Git pour le Drift Lock
- Initialisation des index (Intents, SPECs)
- **Liaison au scope Context Mesh** : le projet hérite automatiquement des contextes `organization` et `team` de rattachement

#### 6.2.2 `/sdd-intent` — Capture d'Intention

**Interface** : Formulaire guidé en 5 étapes, chacune correspondant à une section de l'Intent Statement.

**Champs obligatoires :**

| Champ | Description | Validation |
|-------|-------------|------------|
| `author` | Humain identifié — **jamais un agent** (Human Authorship) | Doit être un utilisateur avec responsabilité PM ou PE sur le projet |
| `pourquoi_maintenant` | Événement ou constat déclencheur | Minimum 50 caractères, doit contenir un élément temporel |
| `pour_qui` | Persona ou segment affecté | Minimum 30 caractères |
| `objectif` | Changement mesurable visé | Doit contenir ≥ 1 métrique quantifiable |
| `contraintes` | Limites : temps, budget, technique, réglementaire | Au moins 1 contrainte identifiée |
| `critere_de_drift` | Signal observable indiquant que l'implémentation dérive | Minimum 30 caractères |

**Statuts Intent :**

| Statut | Signification | Transitions possibles |
|--------|---------------|-----------------------|
| `draft` | En rédaction, pas validé PM+stakeholder | → `active` (validation PM) |
| `active` | Validé, ≥1 SPEC en cours/planifiée | → `done` (toutes SPECs terminées) |
| `done` | Réalisé, SPECs terminées et mergées | → `archived` (archivage) |
| `archived` | Historique conservé | → `active` (réactivation) |

**Signaux de santé automatiques :**
- **Zombie** : Intent `active` sans activité > 30 jours → alerte au PE
- **Orphelin** : Intent `active` sans SPEC liée → alerte au PE
- **Draft oublié** : Intent `draft` depuis > 14 jours → alerte au PM

**Output** : Fichier `INTENT-NNN-[nom-court].md` généré dans `.aiad/intents/`, index mis à jour, commit automatique.

#### 6.2.3 `/sdd-spec` — Rédaction de Spécification

**Interface** : Éditeur riche structuré avec sections pré-définies et assistance IA optionnelle.

**Structure SPEC obligatoire :**

| Section | Description | Obligatoire |
|---------|-------------|-------------|
| `intent_parent` | Référence à l'INTENT-NNN parent | ✓ |
| `description` | Ce qui est construit | ✓ |
| `inputs` | Types de données acceptées, formats, sources | ✓ |
| `processing` | Étapes de traitement, algorithmes, logique métier | ✓ |
| `outputs` | Format, structure, destination des résultats | ✓ |
| `edge_cases` | Cas limites et leur gestion | ✓ |
| `acceptance_criteria` | Checklist observable et testable | ✓ |
| `dependencies` | Autres SPECs ou services externes | ✓ |
| `governance` | AI-ACT, RGPD, RGAA, RGESN applicables | ✓ |
| `context_budget_estimate` | Estimation budget contexte agent (tokens) | ✓ |

**Statuts SPEC :**

| Statut | Signification | Transitions |
|--------|---------------|-------------|
| `draft` | En rédaction | → `review` |
| `review` | Attente validation SQS | → `ready` (SQS ≥ 4/5) ou → `draft` (révision) |
| `ready` | Prête pour exécution agent | → `in-progress` (agent lancé) |
| `in-progress` | Agent en développement | → `validation` (code produit) |
| `validation` | En QA | → `done` (validé) ou → `in-progress` (corrections) |
| `done` | Code + SPEC synchronisés, PR mergée | → `archived` |
| `archived` | Archivée | — |

**Output** : Fichier `SPEC-NNN-[nom-court].md`, index mis à jour, lien avec Intent parent.

#### 6.2.4 `/sdd-gate` — Execution Gate

**Interface** : Checklist interactive avec scoring automatique.

**Spec Quality Score (SQS) — 6 critères :**

| # | Critère | Description | Score |
|---|---------|-------------|-------|
| 1 | **Clarté** | SPEC compréhensible sans ambiguïté | 0 ou 1 |
| 2 | **Complétude** | Tous les éléments couverts (inputs, outputs, edge cases) | 0 ou 1 |
| 3 | **Testabilité** | Critères d'acceptation vérifiables (chaque CA = test) | 0 ou 1 |
| 4 | **Réalisabilité** | Faisable dans le budget context estimé | 0 ou 1 |
| 5 | **Alignement** | Conforme Intent Statement + PRD | 0 ou 1 |
| 6 | **Test de l'Étranger** | Un développeur externe comprendrait-il ? | Non scorable — qualitatif |

**Gate = SQS ≥ 4/5** (critères 1-5 scorés, critère 6 informatif)

**Checklist Execution Gate complète :**
- [ ] SQS ≥ 4/5 validé
- [ ] Critère de Drift de l'Intent parent vérifié
- [ ] Gouvernance applicable identifiée (AI-ACT ? RGPD ? RGAA ? RGESN ?)
- [ ] Budget context estimé < seuil projet
- [ ] Aucune dépendance bloquée
- [ ] Approbation par au moins 2 responsabilités AIAD distinctes (ex: PE + QA, ou PE + TL)
- [ ] **Contexte hérité dimensionné** : les scopes `organization`, `team` et `project` contribuent un volume de tokens compatible avec le budget estimé

**Participants au Gate** : PE (obligatoire) + au moins un parmi QA, TL, PM.

**Output** : SPEC passe en statut `ready` ou retourne en `draft` avec feedback structuré.

#### 6.2.5 `/sdd-exec` — Lancement Exécution Agent

**Interface** : Panel d'exécution avec sélection/suggestion d'agent et monitoring temps réel.

**Workflow :**

1. **Suggestion d'agent** : L'application analyse la SPEC et suggère le(s) agent(s) les plus adaptés selon :
   - Compétences de l'agent (stack technique, type de tâche)
   - Charge actuelle (WIP de l'agent)
   - Budget restant (mensuel et par projet)
   - Historique de performance sur des SPECs similaires
   - Disponibilité (agent actif, non pausé)

2. **Validation PE** : Le PE valide ou ajuste la suggestion. Il peut :
   - Accepter la suggestion
   - Choisir un autre agent
   - Découper la SPEC en sous-tâches pour différents agents

3. **Injection de contexte** : L'application compose le payload agent selon le Context Engineering Budget, en résolvant le **Context Mesh en cascade** :
   - **Couche héritée** (chargée systématiquement via le Context Mesh) :
     - `organization/CONTEXT.md` — principes, tone of voice, conventions globales (max ~1000 tokens)
     - `team/CONTEXT.md` — workflows, rituels, rôles (max ~800 tokens)
     - `team/rules/` — conventions d'équipe applicables (max ~500 tokens)
   - **Couche projet** (chargée systématiquement) :
     - PRD condensé (max ~1500 tokens)
     - ARCHITECTURE condensée (max ~500 tokens)
     - `.aiad/context/CONTEXT.md` — décisions, patterns, état du projet (max ~500 tokens)
   - **Couche SPEC** (spécifique à la tâche) :
     - SPEC active (max ~2000 tokens)
     - AGENT-GUIDE (max ~3000 tokens)
     - Gouvernance applicables (max ~2000 tokens)
     - SPECs dépendances (max ~1000 tokens)
   - **Couche on-demand** (récupérée à la volée via tools/MCP si l'agent en a besoin) :
     - ADR référencés, documentation externe, historique de sessions similaires

4. **Lancement** : L'agent est invoqué via son adapter. La SPEC passe en `in-progress`. L'issue liée est verrouillée (`execution_locked_at`).

5. **Monitoring temps réel** :
   - Streaming des logs stdout/stderr via WebSocket
   - Tracking tokens consommés (input, cached, output) en temps réel, **ventilé par couche du Context Mesh**
   - Coûts en cours
   - Progression estimée
   - Bouton d'intervention PE (pause, stop, redirect)

**Sessions persistantes** (inspiré Paperclip) : si un agent est interrompu ou doit reprendre, la session est sauvegardée et compactée pour économiser le contexte. L'agent reprend avec le même contexte sémantique.

#### 6.2.6 `/sdd-validate` — Validation Livraison

**Interface** : Checklist de validation multi-dimensionnelle.

**3 niveaux de validation :**

| Niveau | Responsable | Vérifications |
|--------|-------------|---------------|
| **Technique** | TL + Automated | Tests passent, code review, patterns respectés, pas de régression |
| **Fonctionnelle** | QA + PE | Acceptance criteria satisfaits, edge cases couverts, UX conforme |
| **Gouvernance** | QA | Checklists AI-ACT, RGPD, RGAA, RGESN passées pour les items applicables |

**Décisions possibles :**

| Décision | Action | SPEC → |
|----------|--------|--------|
| **VALIDÉ** | PR ready to merge, Drift Lock vérifié | `done` |
| **CORRECTIONS** | Retour à l'agent ou au PE avec feedback structuré | `in-progress` |
| **ÉCHEC** | Escalade, post-mortem, potentiel re-spec | `review` ou `draft` |

**Post-validation** : déclenchement automatique de la **Context Sync Loop** (voir §6.9.5) — le système propose les mises à jour de contexte issues de cette session.

#### 6.2.7 `/sdd-drift-check` — Vérification Anti-Drift

**Interface** : Rapport automatique de synchronisation SPEC ↔ Code.

**Mécanisme :**
1. Scanner les changements Git depuis le dernier Drift Check
2. Pour chaque SPEC `in-progress` ou `validation` :
   - Fichiers modifiés dans le périmètre de la SPEC ? → Oui/Non
   - SPEC mise à jour en conséquence ? → Oui/Non
   - **Contexte projet à jour ?** → Le `CONTEXT.md` du projet reflète-t-il les changements ?
   - Résultat : **SYNC** ou **DRIFT**
3. Si DRIFT détecté :
   - Alerte au PE et au QA
   - PR bloquée (via CI/CD hook)
   - Action requise : mettre à jour la SPEC (et le contexte si nécessaire) ou reverter le code

**Drift Lock élargi** : Code + SPEC + Contexte projet committés dans la **même PR** quand le contexte est impacté. Vérifié automatiquement par un hook Git/CI.

**Output** : Rapport de drift avec détails par SPEC, mise à jour de `CHANGELOG-ARTEFACTS.md`.

#### 6.2.8 `/sdd-split` — Découpage de SPEC

**Déclenchement** : Quand une SPEC est jugée trop volumineuse (budget context > seuil, trop d'acceptance criteria, complexité excessive).

**Interface** : Assistant de découpage qui :
1. Analyse la SPEC et propose des axes de découpage (par module, par couche, par feature)
2. Génère les sous-SPECs avec références croisées
3. Maintient le lien vers l'Intent parent
4. Met à jour les dépendances inter-SPECs
5. Recalcule les budgets context de chaque sous-SPEC

**La SPEC originale passe en statut `archived` avec référence vers les sous-SPECs.**

#### 6.2.9 `/sdd-resume` — Relance SPEC Bloquée

**Déclenchement** : SPEC en `in-progress` sans activité depuis > X jours (configurable).

**Interface** : Panel de diagnostic qui :
1. Affiche le contexte de blocage (dernière activité, logs agent, erreurs)
2. Permet au PE d'ajouter des clarifications
3. Propose des actions : relancer avec contexte enrichi, réassigner à un autre agent, escalader au TL

#### 6.2.10 `/sdd-context` — Context Audit

**Interface** : Rapport post-session de consommation de contexte.

**Données collectées :**

| Métrique | Description |
|----------|-------------|
| `estimated_tokens` | Budget context estimé au Gate |
| `actual_tokens` | Tokens réellement consommés |
| `variance` | Écart estimation/réel (%) |
| `context_composition` | Répartition par artefact (PRD, SPEC, AGENT-GUIDE...) |
| `inherited_context_tokens` | **Tokens consommés par le contexte hérité (Context Mesh)** |
| `inherited_context_ratio` | **% du budget total consommé par le contexte hérité** |
| `session_duration` | Durée de la session agent |
| `compaction_events` | Nombre de compactions de session |

**Feedback loop** : Les données de Context Audit alimentent l'amélioration des estimations futures (apprentissage sur l'historique du projet) **et l'optimisation du contenu des scopes hérités** (si le ratio hérité > 40%, alerte à l'AE pour comprimer).

---

#### 6.2.11 `/sdd-context-sync` — Propagation de Contexte Post-Session

**Interface et workflow complets** : voir §6.9.5 — Context Sync Loop.

**Résumé** : à la fin de chaque session agent (ou invocable manuellement), Studio détecte les changements qui méritent d'être propagés au contexte partagé, les classifie par scope cible, et propose un diff au PE pour validation. Aucune propagation sans validation humaine.

**Output** : Mise à jour atomique des `CONTEXT.md` des scopes concernés, event loggé dans `context_sync_events`.

---

### 6.3 Orchestration Agents Multi-Adapter

#### 6.3.1 Modèle d'Agent

Chaque agent dans AIAD Studio est caractérisé par :

| Champ | Description |
|-------|-------------|
| `id` | Identifiant unique |
| `name` | Nom affiché |
| `adapter_type` | Type d'adapter (voir ci-dessous) |
| `adapter_config` | Configuration spécifique à l'adapter (JSON) |
| `runtime_config` | Configuration runtime (clés API, modèle, etc.) |
| `capabilities` | Compétences déclarées (langages, frameworks, types de tâche) |
| `budget_monthly_cents` | Budget mensuel en centimes USD |
| `spent_monthly_cents` | Dépenses du mois en cours |
| `status` | `active`, `paused`, `disabled` |
| `project_ids` | Projets auxquels l'agent a accès |

#### 6.3.2 Adapters Supportés (V1)

| Adapter | Description | Configuration |
|---------|-------------|---------------|
| `claude_local` | Claude Code (CLI local) | `model`, `apiKey`, `allowUnsandboxedShell` |
| `codex_local` | OpenAI Codex (CLI local) | `model`, `apiKey` |
| `cursor_local` | Cursor (intégration locale) | `workspacePath` |
| `gemini_local` | Google Gemini (CLI local) | `model`, `apiKey` |
| `process` | Commande shell générique | `command`, `args`, `env` |
| `http` | Webhook HTTP POST | `url`, `headers`, `auth` |

D'autres adapters pourront être ajoutés via le système de plugins (V2+).

#### 6.3.3 Orchestration Intelligente

L'algorithme de suggestion d'agent prend en compte :

1. **Matching compétences** : les `capabilities` de l'agent vs les besoins de la SPEC (stack technique, type de tâche)
2. **Charge WIP** : nombre de tâches `in-progress` de l'agent (préférer les agents moins chargés)
3. **Budget disponible** : `budget_monthly_cents - spent_monthly_cents` (exclure les agents en dépassement)
4. **Performance historique** : taux de succès, temps moyen d'exécution, taux de drift sur SPECs similaires
5. **Affinité projet** : expérience antérieure de l'agent sur le même projet/codebase

Le PE reçoit une **recommandation classée** (top 3 agents avec score de matching) et **valide ou ajuste**. L'app ne lance jamais un agent sans validation humaine explicite.

#### 6.3.4 Collaboration Inter-Agents

Lorsque le PE l'autorise, un agent peut solliciter un autre agent pour une sous-tâche :

- L'agent dev peut demander une review à l'agent QA
- L'agent backend peut demander un test d'intégration à l'agent test

Chaque sollicitation est **visible par le PE** et **interruptible**. Le PE peut rediriger, annuler ou prendre en charge manuellement.

#### 6.3.5 Gestion des Coûts et Budgets

**Tracking multi-niveaux** (inspiré Paperclip) :

| Niveau | Description |
|--------|-------------|
| **Instance** | Budget global de l'installation |
| **Projet** | Budget par projet |
| **Agent** | Budget mensuel par agent |
| **SPEC** | Coût attribué par SPEC (traçabilité intent → coût) |

**Context Budget étendu en 3 dimensions** :

| Dimension | Description | Responsable |
|-----------|-------------|-------------|
| **Budget hérité** | Tokens consommés par la résolution du Context Mesh (organization + team + project `CONTEXT.md`) | AE (optimise le poids), PE (valide le contenu) |
| **Budget SPEC** | Tokens spécifiques à la tâche (SPEC + AGENT-GUIDE + gouvernance) | PE (estimé au Gate) |
| **Budget on-demand** | Tokens consommés par l'agent à la volée (tools, MCP, docs externes) | AE (monitore), PE (autorise) |

**Cost Events** : chaque invocation agent génère un événement de coût :
```
{
  agent_id, spec_id, intent_id, project_id,
  provider, model,
  input_tokens, cached_tokens, output_tokens,
  inherited_context_tokens,
  cost_cents,
  timestamp
}
```

**Enforcement** :
- Alerte à 80% du budget (notification PE + AE)
- Auto-pause agent à 100% du budget (notification PE + AE + PM)
- Budget incidents loggés pour audit
- Reset mensuel automatique (UTC)
- **Alerte contexte hérité > 40% du budget total** : notification AE pour optimisation

---

### 6.4 Gouvernance AIAD Complète

#### 6.4.1 Les 4 Artefacts de Gouvernance Tier 1

Chaque projet dans AIAD Studio embarque nativement les 4 artefacts de gouvernance avec **droit de veto** :

**AIAD-AI-ACT** (EU AI Act) :
- Qualification obligatoire de chaque composant IA avant développement
- 4 niveaux de risque : Inacceptable (BLOQUÉ), Haut (régime complet), Limité (transparence), Minimal
- Checklist automatique au Gate et au Validate
- Obligations par niveau : documentation, logs, supervision humaine, monitoring, registre

**AIAD-RGPD** :
- 10 principes codifiés avec checklists
- Données sensibles (Art. 9) → régime renforcé avec escalade obligatoire
- Endpoints GDPR pré-configurés (`/gdpr/export`, `/gdpr/erase`, `/gdpr/rectify`, `/gdpr/object`)
- Registre des traitements automatisé

**AIAD-RGAA** (Accessibilité WCAG 2.1 AA) :
- 12 thématiques avec checklists détaillées
- Ratio contraste ≥ 4.5:1 vérifié
- Tests clavier, ARIA, sémantique HTML
- Classe `.sr-only` obligatoire

**AIAD-RGESN** (Écoconception) :
- Métriques de sobriété : bundle JS < 200Ko (gz), Lighthouse > 80, Ecoindex > B
- Rétention données explicite + purge auto
- PUE hébergement ≤ 1.5

#### 6.4.2 Gouvernance dans le Workflow

La gouvernance n'est pas un audit a posteriori — elle est **intégrée au cycle SDD** :

| Étape SDD | Vérification gouvernance |
|-----------|--------------------------|
| `/sdd-intent` | Identification préliminaire des enjeux réglementaires |
| `/sdd-spec` | Section `governance` obligatoire dans chaque SPEC |
| `/sdd-gate` | Checklist gouvernance dans l'Execution Gate |
| `/sdd-validate` | Validation conformité comme condition de passage |
| `/sdd-drift-check` | Vérification que les artefacts de gouvernance restent synchronisés |
| `/sdd-context-sync` | Vérification que le contexte propagé respecte les politiques d'accès |

#### 6.4.3 Audit de Gouvernance (`/aiad-gouvernance`)

**Cadence** : Trimestriel (ou à la demande).

**Interface** : Dashboard d'audit avec :
- Score de conformité par domaine (AI-ACT, RGPD, RGAA, RGESN, **Contexte**)
- Items non-conformes avec actions correctives
- Historique d'évolution de la conformité
- Export pour audit externe

#### 6.4.4 Gouvernance du Contexte (AIAD-CONTEXT)

La gouvernance du contexte partagé est le **5ème domaine de gouvernance** d'AIAD Studio. Elle ne porte pas un droit de veto (contrairement aux Tier 1), mais elle est **auditée et mesurée**.

**Principes de gouvernance du contexte :**

| Principe | Description |
|----------|-------------|
| **Le contexte est du code versionné** | Toute modification d'un scope `organization` ou `team` passe par un commit Git, avec historique et rollback possible |
| **Mini-cycle SDD pour les scopes partagés** | Modifier le contexte `organization` ou `team` suit un processus : Intent (pourquoi changer) → modification → revue → merge. Pas de wiki freestyle |
| **Minimisation** | Chaque scope contient le minimum nécessaire. La sobriété intentionnelle s'applique au contexte comme au code |
| **Propagation explicite** | Aucune mise à jour de contexte ne se propage sans validation humaine (primauté de l'intention) |
| **Classification d'accès** | Chaque scope porte un niveau de confidentialité (voir §9.5) |

**Qui porte la gouvernance du contexte** (Variante A — répartition dans les 5 responsabilités existantes) :

| Scope | Responsable contenu | Responsable mécanique |
|-------|---------------------|-----------------------|
| `organization` | **Context Steward** (rôle désigné au niveau instance — souvent le CTO, le Gardien AIAD client, ou un comité) | AE |
| `team` | **PM + PE + TL** conjointement | AE |
| `project` | **PE** (gardien de l'intention → gardien du contexte projet) | AE |
| `personal` | L'individu (non gouverné par l'organisation) | — |

> Le rôle de **Context Steward** n'est pas une 6ème responsabilité AIAD formelle. C'est un **rôle instance** (comme Admin), porté par quelqu'un qui a déjà une responsabilité. Si l'organisation a un Gardien AIAD (consultant ou interne), c'est naturellement cette personne.

---

### 6.5 Rituels et Synchronisations AIAD

#### 6.5.1 Rituels Guidés (Workflow structuré dans l'app)

**Standup (`/aiad-standup`)** — Quotidien, ~15 min
- **Pré-chargement** : SPECs en cours, blocages, agents actifs, métriques du jour
- **Workflow** :
  1. Tour de table automatique par responsabilité AIAD
  2. Chaque participant indique : fait hier, prévu aujourd'hui, blocages
  3. Mise à jour automatique des statuts issues/SPECs
  4. Détection d'incohérences (SPEC `in-progress` sans activité agent)
- **Output** : Résumé archivé, actions créées automatiquement

**Drift Check (`/sdd-drift-check`)** — Fin d'itération, ~10 min
- **Workflow structuré** : 3 questions systématiques
  1. Le code a-t-il changé depuis le dernier check ?
  2. Les SPECs reflètent-elles ces changements ?
  3. Les artefacts de gouvernance sont-ils à jour ?
- **Output** : Rapport de synchronisation, actions correctives si drift détecté

**Tech Review (`/aiad-tech-review`)** — Hebdomadaire
- **Pré-chargement** : PRs ouvertes, ADR récents, alertes dette technique, métriques performance
- **Workflow** : Revue structurée par le TL avec checklist architecture
- **Output** : Décisions architecturales documentées (ADR si nécessaire)

**Demo & Feedback (`/aiad-demo`)** — Fin de sprint
- **Pré-chargement** : SPECs terminées, features déployées, métriques
- **Workflow** : Présentation structurée avec feedback collecté
- **Output** : Feedback archivé, Intents ajustés si nécessaire

#### 6.5.2 Rituels Libres (Données + rappels, format libre)

**Atelier d'Intention (`/aiad-intention`)** — Mensuel, espace humain pur
- **L'app fournit** : rappel calendrier, données contextuelles (Intents actifs, progression, métriques tendancielles, Human Learnings accumulés, **état du Context Mesh — scopes à jour vs. stales**)
- **L'app ne guide PAS** : le rituel est un espace de délibération humaine pure, sans intervention IA
- **Question centrale** : "Construisons-nous toujours ce que nous voulions ?"
- **Question complémentaire** : "Notre contexte partagé reflète-t-il toujours notre intention ?"
- **Post-rituel** : l'équipe saisit les conclusions dans l'app (ajustements d'Intents, nouvelles priorités, **mises à jour du contexte partagé si nécessaire**)

**Synchronisation Alignement Stratégique (`/aiad-sync-strat`)** — Mensuel
- **L'app fournit** : état des Intents, progression SPECs, métriques DORA/Flow, budget consommé
- **Participants** : PM + PE + AE + TL
- **Post-rituel** : mise à jour des priorités, création/archivage d'Intents

**Rétrospective (`/aiad-retro`)** — Fin d'itération
- **L'app fournit** : métriques de l'itération, incidents, drifts détectés, Human Learnings
- **Format** : libre (l'équipe choisit son format de rétro)
- **Post-rituel** : Lessons Learned et Human Learnings ajoutés à l'AGENT-GUIDE

**Context Review (`/aiad-context-review`)** — Trimestriel
- **L'app fournit** : inventaire des scopes, date de dernière modification, poids en tokens, taux d'utilisation par les agents, alertes de staleness
- **Participants** : Context Steward + PE + AE
- **Questions structurantes** :
  1. Les scopes `organization` et `team` reflètent-ils la réalité ?
  2. Y a-t-il du contenu mort (non-lu par les agents depuis > 90 jours) ?
  3. Les politiques d'accès sont-elles toujours appropriées ?
- **Post-rituel** : plan de mise à jour du Context Mesh

#### 6.5.3 Health Check (`/aiad-health`)

**Cadence** : Hebdomadaire (automatique) + à la demande.

**Signaux surveillés :**

| Signal | Condition | Sévérité | Action |
|--------|-----------|----------|--------|
| Intent Zombie | `active` sans activité > 30j | Warning | Alerte PE |
| Intent Orphelin | `active` sans SPEC liée | Critical | Alerte PE + PM |
| Draft Oublié | `draft` depuis > 14j | Info | Alerte auteur |
| SPEC Bloquée | `in-progress` sans activité > 3j | Warning | Alerte PE |
| Budget Critique | Agent > 80% budget | Warning | Alerte AE |
| Drift Non-Résolu | Drift détecté > 24h | Critical | Alerte PE + QA |
| WIP Excessif | > 5 SPECs `in-progress` | Warning | Alerte PE + TL |
| **Contexte Stale** | Scope `organization` ou `team` non modifié > 60 jours | Warning | Alerte Context Steward + PE |
| **Contexte Lourd** | Contexte hérité > 40% du budget moyen des sessions | Info | Alerte AE |
| **Context Sync Ignorée** | > 5 propositions Context Sync rejetées consécutivement | Warning | Alerte PE |

---

### 6.6 Métriques DORA et Flow

#### 6.6.1 Collecte Automatique

Les métriques sont calculées automatiquement à partir des données intégrées :

| Source | Données extraites |
|--------|-------------------|
| **Git (GitHub/GitLab)** | Commits, PRs, merges, branches, timestamps |
| **CI/CD** | Déploiements, résultats pipelines, temps d'exécution |
| **AIAD Studio** | Statuts Intent/SPEC, timestamps transitions, coûts agents |
| **Issues** | Création, assignation, résolution, blocages |
| **Context Mesh** | Modifications de contexte, résolutions cascade, poids par scope |

#### 6.6.2 DORA Metrics (`/aiad-dora`)

| Métrique | Calcul | Cible Elite |
|----------|--------|-------------|
| **Deployment Frequency** | PRs mergées / nombre de jours | > 1/jour |
| **Lead Time for Changes** | Temps médian premier commit → déploiement production | < 1 jour |
| **Change Failure Rate** | Incidents post-déploiement / total déploiements | 0-15% |
| **MTTR** | Temps médian bug reporté → fix déployé | < 1 heure |

#### 6.6.3 Flow Metrics (`/aiad-flow`)

| Métrique | Calcul | Cible |
|----------|--------|-------|
| **Cycle Time** | Temps SPEC `review` → `done` | < 3 jours |
| **Lead Time** | Temps Intent `draft` → dernière SPEC `done` | < 2 semaines |
| **Throughput** | SPECs `done` / semaine | > 2 |
| **WIP** | SPECs en `in-progress` + `validation` | < 5 |
| **Flow Efficiency** | Temps actif / temps total (Cycle Time / Lead Time) | > 70% |

#### 6.6.4 Dashboards

**Dashboard hebdomadaire** (équipe) :
- Tendances DORA et Flow sur 4 semaines glissantes
- SPECs complétées vs objectif
- Top 3 agents par performance/coût
- Alertes de santé en cours
- **Context Health** : poids moyen du contexte hérité, % de sessions avec contexte frais

**Dashboard mensuel** (stakeholders / PM / Julie) :
- Synthèse DORA avec comparaison mois précédent
- Progression des Intents stratégiques
- Budget consommé vs alloué
- Score de conformité gouvernance
- **État du Context Mesh** : scopes actifs, fraîcheur, couverture

**Persistance** : Les données métriques sont stockées dans `.aiad/metrics/` (fichiers) et en base de données (historique requêtable).

---

### 6.7 Onboarding Éducatif

L'onboarding est **stratégiquement critique**. Il doit permettre à une équipe de compléter un premier cycle SDD complet sans aide externe (UC-18). C'est la condition de l'adoption organique et du modèle économique (Étage 1 — acquisition via Studio).

#### 6.7.1 Principes

L'onboarding éduque au **framework AIAD**, pas seulement aux boutons de l'interface. Chaque étape explique le *pourquoi* avant le *comment* :

- Pourquoi un Intent Statement avant de coder ?
- Pourquoi le SQS existe et comment il protège l'équipe ?
- Pourquoi le Drift Lock est non-négociable ?
- Pourquoi la gouvernance Tier 1 a droit de veto ?
- **Pourquoi structurer le contexte partagé change la donne pour les agents ET les humains ?**

#### 6.7.2 Parcours d'onboarding guidé

| Étape | Contenu | Action utilisateur |
|-------|---------|-------------------|
| 1. Bienvenue | Présentation d'AIAD Studio et du framework AIAD (vidéo 2 min ou texte) | Choix du rôle principal (PM, PE, AE, QA, TL, **Contributeur**) |
| 2. Premier projet | Création d'un projet d'exemple avec scaffolding `.aiad/` | Créer le projet "Mon Premier Projet" |
| 2b. **Premier contexte** | Explication du Context Mesh et du Patrimoine Intentionnel. Pourquoi 4 scopes. | Rédiger 3 à 5 lignes dans le `CONTEXT.md` du scope `organization` (principes fondamentaux de l'équipe) |
| 3. Premier Intent | Explication de l'Intent Statement (le POURQUOI). Formulaire guidé avec exemples | Rédiger un Intent d'exemple |
| 4. Première SPEC | Explication de la SPEC (le COMMENT). Lien Intent → SPEC | Rédiger une SPEC liée à l'Intent |
| 5. Premier Gate | Explication du SQS et du Gate. Scoring interactif avec feedback pédagogique | Évaluer sa propre SPEC avec le SQS |
| 6. Premier cycle | Récapitulatif du cycle complet Intent → SPEC → Gate → Exec → Validate → Drift Lock | Marquer la SPEC comme `done` (simulation) |
| 7. Exploration libre | Découverte des dashboards, métriques, gouvernance, Context Mesh | Navigation libre |

**Aide contextuelle** : à chaque écran de l'application, des tooltips et panneaux d'aide expliquent le concept AIAD sous-jacent. Cette aide est désactivable par l'utilisateur.

**Indicateurs de progression** : l'utilisateur voit sa progression dans l'adoption du framework (cycles complétés, SQS moyen, rituels pratiqués, **scopes de contexte configurés**). Ces indicateurs servent aussi de prérequis pour la certification Praticien AIAD (≥ 3 cycles SDD complets + Context Mesh configuré sur ≥ 2 scopes).

#### 6.7.3 Signaux d'accompagnement

L'app détecte des patterns qui indiquent un besoin d'accompagnement et affiche des suggestions non-intrusives :

| Signal détecté | Suggestion affichée |
|----------------|---------------------|
| SQS moyen < 3/5 après 5 SPECs | "Vos SPECs pourraient gagner en précision. Découvrir la formation SDD Mode →" |
| Drift détecté > 3 fois en 2 semaines | "Le Drift Lock vous pose des difficultés ? Explorer le coaching PE →" |
| Gouvernance ignorée > 3 Gates | "La conformité réglementaire est un pilier AIAD. Découvrir le Pack Conformité →" |
| Pas de rituel pratiqué depuis 4 semaines | "Les rituels AIAD renforcent l'alignement de l'équipe. En savoir plus →" |
| **Context Mesh mono-scope après 1 mois** | "Votre contexte est uniquement au niveau projet. Structurez votre Company OS → " |
| **Contexte hérité consomme > 50% du budget** | "Votre contexte hérité est volumineux. Découvrir le coaching Context Engineering →" |

Ces suggestions pointent vers aiad.ovh (documentation, formations, contact). Elles ne sont jamais bloquantes et sont désactivables.

---

### 6.8 Télémétrie Opt-in

#### 6.8.1 Principe

AIAD Studio intègre un système de **télémétrie anonymisée, opt-in**, désactivé par défaut. L'administrateur de l'instance choisit explicitement de l'activer. Ce système mesure l'adoption du framework pour piloter la stratégie produit et le modèle économique.

#### 6.8.2 Données collectées (si opt-in activé)

| Donnée | Description | Justification |
|--------|-------------|---------------|
| `instance_id` | UUID anonyme de l'instance | Compter les instances actives |
| `cycles_sdd_completed` | Nombre de cycles SDD complets (compteur) | North Star Metric |
| `avg_sqs_score` | Score SQS moyen | Qualité d'adoption du framework |
| `specs_per_month` | Nombre de SPECs créées/mois | Activité |
| `agents_configured` | Nombre d'agents configurés | Adoption orchestration |
| `governance_checks_passed` | Ratio de checks gouvernance passés | Adoption conformité |
| `context_scopes_active` | Nombre de scopes Context Mesh actifs (0-4) | Adoption Company OS |
| `context_sync_rate` | Ratio propositions Context Sync validées | Maturité Context Mesh |
| `studio_version` | Version d'AIAD Studio installée | Planning de support |

**Ce qui n'est JAMAIS collecté** : noms d'utilisateurs, contenus d'Intents/SPECs, code source, données de projet, adresses email, clés API, **contenu des CONTEXT.md**. Aucune donnée personnelle au sens RGPD.

#### 6.8.3 Implémentation

- Désactivé par défaut. Activation via Settings > Télémétrie avec consentement explicite
- Endpoint HTTPS vers `telemetry.aiad.ovh` (collecte minimale, pas de tracking)
- Fréquence : 1 envoi agrégé par semaine
- L'utilisateur peut voir exactement ce qui est envoyé (transparence totale)
- Désactivation instantanée et suppression des données côté serveur sur demande

---

### 6.9 Patrimoine Intentionnel — Context Mesh (NOUVEAU)

Le **Context Mesh** est le 3ème pilier structurant d'AIAD Studio. Il matérialise le **Company OS AIAD** : le substrat partagé de contexte qui nourrit à la fois les humains et les agents, structuré en couches, gouverné, et évolutif.

#### 6.9.1 Philosophie

La barrière à l'efficacité des agents IA n'est plus technique — elle est cognitive. Être clair sur son intention, structurer le contexte qui l'entoure, et propager ce contexte aux bonnes personnes (et aux bons agents) est devenu la compétence critique des organisations.

Le Context Mesh répond à cette réalité en offrant :

1. **Un lieu unique** pour le contexte qui alimente les agents et les humains — pas un wiki, pas un Notion, mais du **contexte versionné, auditable, dimensionné**
2. **Un héritage en cascade** qui évite à chaque session de repartir de zéro
3. **Une gouvernance explicite** qui répond à la question "qui a le droit de modifier quoi"
4. **Une propagation contrôlée** qui capitalise les apprentissages sans surcharger

#### 6.9.2 Les 4 Scopes de Contexte

| Scope | Contenu | Exemple | Fréquence de modification |
|-------|---------|---------|---------------------------|
| `organization` | Principes, tone of voice, décisions d'entreprise, conventions globales, Gouvernance Tier 1 | "Nous sommes une medtech, dispositif médical, toute décision produit doit considérer la conformité CE" | Rare (mensuel à trimestriel) |
| `team` | Workflows, rituels, rôles, ways of working, accords d'équipe | "L'équipe produit fait un standup quotidien à 9h30. Le PE revoit toutes les SPECs avant Gate." | Occasionnel (bi-hebdomadaire) |
| `project` | SPECs, ADR, contexte spécifique du projet, décisions techniques, patterns | "Ce projet utilise Next.js 14 + App Router. L'API est RESTful. La base est PostgreSQL 16." | Fréquent (à chaque session) |
| `personal` | Préférences individuelles, skills personnels, mémoire individuelle | "Je préfère les réponses concises. Mon expertise est le frontend React. Ne me parle pas de pommade." | À la discrétion de l'individu |

**Chaque scope porte :**

```
scope/
├── CONTEXT.md              # Le contexte structuré de ce scope
├── skills/                 # Skills (automatisations, workflows) propres à ce scope
│   ├── rapport/SKILL.md
│   └── vital/SKILL.md
├── rules/                  # Conventions et contraintes applicables
│   └── conventions.md
└── decisions/              # Décisions tracées (ADR pour org, retros pour équipe)
    └── ...
```

#### 6.9.3 Résolution en cascade

Quand un agent ouvre une session sur un projet dans AIAD Studio, le **Context Resolver** agrège automatiquement les 4 couches de contexte :

```
organization/CONTEXT.md     (chargé systématiquement)
     ↓ hérite
team/CONTEXT.md             (chargé systématiquement)
     ↓ hérite
project/.aiad/context/CONTEXT.md  (chargé systématiquement)
     ↓ complète
~/.aiad/personal/CONTEXT.md       (chargé systématiquement, non propagé)
```

**Règles de résolution :**
- **Surcharge** : si une règle du scope `project` contredit une règle du scope `organization`, le scope le plus spécifique l'emporte (principe de spécificité, comme CSS). Un avertissement est loggé.
- **Budget** : le poids total du contexte hérité ne doit pas dépasser le seuil configurable (défaut : 40% du budget total de la session). Au-delà, l'AE est alerté et doit comprimer.
- **Skills** : les skills de chaque scope sont disponibles mais pas chargés en mémoire — l'agent les invoque à la demande.
- **Caching** : le contexte hérité est caché entre sessions tant qu'il n'est pas modifié (hash de contenu). Seuls les deltas sont rechargés.

**Interface** : L'utilisateur peut visualiser l'arborescence du contexte hérité pour tout projet (UC-23), avec le poids en tokens de chaque scope et la date de dernière modification.

#### 6.9.4 Éditeur de Contexte Guidé

Pour chaque scope, AIAD Studio fournit un **éditeur de CONTEXT.md structuré** :

**Pour le scope `organization`** (accessible au Context Steward) :
- Sections guidées : Mission, Valeurs, Principes directeurs, Conventions de code globales, Glossaire métier, Tone of voice
- Validation automatique : poids < 1500 tokens, pas de jargon non-défini, cohérence avec Gouvernance Tier 1
- Historique Git complet avec diff visuel

**Pour le scope `team`** (accessible PM + PE + TL + Contributeurs) :
- Sections guidées : Composition de l'équipe, Workflows actifs, Rituels pratiqués, Accords d'équipe, Outils et intégrations
- Validation automatique : poids < 1200 tokens, pas de duplication avec le scope `organization`
- Mode guidé pour **Julie (Contributrice non-tech)** : formulaire pas-à-pas avec exemples, sans Markdown visible

**Pour le scope `project`** (accessible PE + TL) :
- Créé automatiquement au `/sdd-init` dans `.aiad/context/CONTEXT.md`
- Sections : Stack technique, Architecture, Décisions clés, Patterns utilisés, État actuel
- Mis à jour par la Context Sync Loop après chaque session

**Pour le scope `personal`** (accessible uniquement à l'individu) :
- Format libre. L'utilisateur structure comme il veut.
- Non versionné dans le repo partagé — stocké en base, associé au profil utilisateur.
- Jamais propagé aux autres sans acte explicite.

#### 6.9.5 Context Sync Loop — Propagation post-session

La Context Sync Loop est le mécanisme qui **capitalise les apprentissages** de chaque session agent et les propage aux scopes appropriés.

**Déclenchement** : automatique à la fin de chaque session agent (clôture de SPEC, validation, ou fin de heartbeat run). Également invocable manuellement via `/sdd-context-sync`.

**Workflow en 4 étapes :**

1. **Détection** : le système analyse le diff de la session (code produit, décisions prises, problèmes rencontrés, patterns découverts) et identifie les changements qui méritent propagation au contexte partagé. Exemples :
   - Un nouveau pattern d'architecture a été introduit → propagation `project`
   - Une convention de code a été établie pour la première fois → propagation `team` ?
   - Une dépendance externe a été ajoutée → propagation `project`
   - Un Human Learning a été identifié → propagation `project` + AGENT-GUIDE

2. **Classification** : chaque changement détecté est classé par scope cible selon la politique :
   - `project` : tout ce qui est spécifique à ce projet (majorité des cas)
   - `team` : ce qui s'applique à tous les projets de l'équipe (conventions, workflows)
   - `organization` : rarement — uniquement si un principe d'entreprise est touché (nécessite validation Context Steward)
   - `personal` : préférences individuelles détectées

3. **Proposition humaine** : Studio présente au PE un **diff de contexte proposé**, scope par scope, avec justification pour chaque modification. Interface :
   - Vue diff (avant/après) par scope impacté
   - Justification automatique (pourquoi ce changement est proposé)
   - Boutons : ✅ Valider | ✏️ Modifier | ❌ Rejeter — pour chaque proposition individuellement
   - **Aucune propagation ne se fait sans validation humaine** (primauté de l'intention)

4. **Application** : après validation, les `CONTEXT.md` des scopes concernés sont mis à jour via un **commit atomique**. Le Drift Lock élargi s'applique : si le contexte projet est modifié en même temps que le code, les deux sont dans la même PR.

**Métriques de la Context Sync Loop :**

| Métrique | Description |
|----------|-------------|
| Propositions générées / session | Volume de détection |
| Taux de validation | % de propositions acceptées (cible > 50%) |
| Temps de validation moyen | Friction du processus |
| Scopes impactés / session | Distribution (project >> team >> organization) |

---

### 6.10 Commandes AIAD — Catalogue complet V1

Le catalogue passe de 24 à **27 commandes** :

**Cycle SDD (11)** — Détaillé en §6.2 :
`/sdd-init` `/sdd-intent` `/sdd-spec` `/sdd-gate` `/sdd-exec` `/sdd-validate` `/sdd-drift-check` `/sdd-split` `/sdd-resume` `/sdd-context` `/sdd-context-sync`

**Synchronisations & Rituels AIAD (12)** — Détaillés en §6.5 (rituels guidés et libres) et §6.7 (onboarding) :
`/aiad-init` `/aiad-onboard` `/aiad-gouvernance` `/aiad-health` `/aiad-status` `/aiad-retro` `/aiad-intention` `/aiad-sync-strat` `/aiad-demo` `/aiad-tech-review` `/aiad-standup` `/aiad-context-review`

> **Note** : `/aiad-init` est l'initialisation de l'instance Studio (vs `/sdd-init` qui initialise un projet SDD). `/aiad-onboard` déclenche le parcours d'onboarding éducatif (§6.7). `/aiad-status` affiche un résumé rapide de l'état de l'instance (projets, agents, alertes). Ces trois commandes sont des entry points applicatifs simples, pas des workflows complexes comme les rituels.

**Métriques & Dashboards AIAD (4)** — Détaillé en §6.6 et §6.9 :
`/aiad-dashboard` `/aiad-dora` `/aiad-flow` `/aiad-context-audit`

---

## 7. Modèle de Données

### 7.1 Entités Principales

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Project    │────<│  Intent      │────<│    SPEC      │
│              │     │  Statement   │     │              │
│ name         │     │ author       │     │ intent_id    │
│ description  │     │ pourquoi     │     │ description  │
│ repository   │     │ pour_qui     │     │ inputs       │
│ status       │     │ objectif     │     │ processing   │
│ context_scope│     │ contraintes  │     │ outputs      │
│              │     │ critere_drift│     │ edge_cases   │
│              │     │ status       │     │ acceptance   │
└──────┬───────┘     └──────────────┘     │ sqs_score    │
       │                                   │ status       │
       │             ┌──────────────┐     │ context_est  │
       ├────────────<│  Issue       │<────┘              │
       │             │ title        │     └──────┬───────┘
       │             │ description  │            │
       │             │ status       │     ┌──────┴───────┐
       │             │ priority     │     │  Execution   │
       │             │ assignee     │     │  Gate        │
       │             │ spec_id      │     │ sqs_scores   │
       │             │ locked_at    │     │ checklist    │
       │             └──────────────┘     │ decision     │
       │                                   │ participants │
       │             ┌──────────────┐     └──────────────┘
       ├────────────<│  Agent       │
       │             │ name         │     ┌──────────────┐
       │             │ adapter_type │     │ Heartbeat    │
       │             │ adapter_cfg  │────<│ Run          │
       │             │ capabilities │     │ agent_id     │
       │             │ budget       │     │ spec_id      │
       │             │ spent        │     │ status       │
       │             │ status       │     │ tokens_in    │
       │             └──────────────┘     │ tokens_out   │
       │                                   │ inherited_tk │
       │             ┌──────────────┐     │ cost_cents   │
       ├────────────<│ Project      │     │ logs         │
       │             │ Membership   │     │ duration     │
       │             │ user_id      │     └──────────────┘
       │             │ responsibility│
       │             │ is_primary   │    ┌──────────────┐
       │             └──────────────┘    │ Governance   │
       │                                  │ Audit        │
       │             ┌──────────────┐    │ project_id   │
       ├────────────<│ Ritual       │    │ domain       │
       │             │ type         │    │ score        │
       │             │ cadence      │    │ items        │
       │             │ next_date    │    │ date         │
       │             │ participants │    └──────────────┘
       │             │ status       │
       │             └──────────────┘    ┌──────────────┐
       │                                  │ Cost Event   │
       │             ┌──────────────┐    │ agent_id     │
       └────────────<│ ADR          │    │ spec_id      │
                     │ title        │    │ intent_id    │
                     │ status       │    │ provider     │
                     │ context      │    │ model        │
                     │ decision     │    │ tokens       │
                     │ consequences │    │ inherited_tk │
                     └──────────────┘    │ cost_cents   │
                                          └──────────────┘

       ┌──────────────┐     ┌──────────────┐
       │ Context      │     │ Context      │
       │ Scope        │     │ Sync Event   │
       │ type         │     │ scope_id     │
       │ parent_id    │     │ session_id   │
       │ path         │     │ proposals    │
       │ version      │     │ accepted     │
       │ access_policy│     │ rejected     │
       │ owner_id     │     │ timestamp    │
       │ token_weight │     └──────────────┘
       └──────────────┘

       ┌──────────────┐     ┌──────────────┐
       │ DORA Metric  │     │ Flow Metric  │
       │ project_id   │     │ project_id   │
       │ period       │     │ period       │
       │ deploy_freq  │     │ cycle_time   │
       │ lead_time    │     │ lead_time    │
       │ failure_rate │     │ throughput   │
       │ mttr         │     │ wip          │
       └──────────────┘     │ efficiency   │
                            └──────────────┘

       ┌──────────────┐     ┌──────────────┐
       │ User         │     │ Activity Log │
       │ email        │     │ actor        │
       │ name         │     │ action       │
       │ role         │     │ entity_type  │
       │ auth_method  │     │ entity_id    │
       │ personal_ctx │     │ metadata     │
       └──────────────┘     │ timestamp    │
                            └──────────────┘
```

### 7.2 Tables Détaillées (Principales)

**`projects`** : `id`, `name`, `description`, `repository_url`, `repository_provider` (github|gitlab), `default_branch`, `status` (active|archived), `context_scope_id` (FK context_scopes), `created_at`, `updated_at`

**`intent_statements`** : `id`, `project_id`, `number` (auto-increment par projet), `slug`, `author_id` (FK users — humain uniquement), `pourquoi_maintenant`, `pour_qui`, `objectif`, `contraintes`, `critere_de_drift`, `status` (draft|active|done|archived), `created_at`, `updated_at`, `last_activity_at`

**`specs`** : `id`, `project_id`, `intent_id` (FK intent_statements), `number`, `slug`, `description`, `inputs`, `processing`, `outputs`, `edge_cases`, `acceptance_criteria` (JSONB), `dependencies` (JSONB), `governance_applicable` (JSONB), `context_budget_estimate`, `sqs_score`, `status` (draft|review|ready|in-progress|validation|done|archived), `created_at`, `updated_at`

**`execution_gates`** : `id`, `spec_id`, `sqs_clarity`, `sqs_completude`, `sqs_testabilite`, `sqs_realisabilite`, `sqs_alignement`, `sqs_test_etranger_notes`, `sqs_total`, `checklist` (JSONB), `decision` (approved|rejected), `participants` (JSONB), `feedback`, `created_at`

**`issues`** : `id`, `project_id`, `spec_id` (nullable), `parent_id` (nullable, self-ref), `title`, `description`, `status` (backlog|todo|in_progress|in_review|done|blocked|cancelled), `priority` (critical|high|medium|low), `assignee_type` (user|agent), `assignee_id`, `execution_locked_at`, `labels` (JSONB), `estimate`, `due_date`, `created_at`, `updated_at`

**`agents`** : `id`, `name`, `adapter_type`, `adapter_config` (JSONB), `runtime_config` (JSONB — chiffré), `capabilities` (JSONB), `budget_monthly_cents`, `spent_monthly_cents`, `status` (active|paused|disabled), `created_at`, `updated_at`

**`agent_project_access`** : `agent_id`, `project_id`

**`heartbeat_runs`** : `id`, `agent_id`, `spec_id`, `issue_id`, `project_id`, `status` (queued|in_progress|completed|failed), `input_tokens`, `cached_tokens`, `output_tokens`, `inherited_context_tokens`, `cost_cents`, `provider`, `model`, `started_at`, `completed_at`, `logs_path`, `session_id`

**`agent_sessions`** : `id`, `agent_id`, `spec_id`, `adapter_type`, `session_data` (JSONB — compacté), `token_count`, `inherited_context_tokens`, `created_at`, `last_used_at`

**`cost_events`** : `id`, `agent_id`, `spec_id`, `intent_id`, `project_id`, `provider`, `model`, `input_tokens`, `cached_tokens`, `output_tokens`, `inherited_context_tokens`, `cost_cents`, `timestamp`

**`project_memberships`** : `id`, `project_id`, `user_id`, `responsibility` (pm|pe|ae|qa|tech_lead), `is_primary` (boolean), `created_at`

**`governance_audits`** : `id`, `project_id`, `domain` (ai_act|rgpd|rgaa|rgesn|context), `score`, `items` (JSONB — checklist détaillée), `auditor_id`, `created_at`

**`rituals`** : `id`, `project_id`, `type` (standup|drift_check|tech_review|demo|intention|sync_strat|retro|gouvernance|context_review), `cadence` (daily|weekly|biweekly|monthly|quarterly), `next_scheduled`, `participants` (JSONB), `status` (scheduled|in_progress|completed|skipped), `output` (JSONB), `created_at`

**`adrs`** : `id`, `project_id`, `number`, `title`, `status` (proposed|accepted|deprecated|superseded), `context`, `decision`, `consequences`, `author_id`, `created_at`, `updated_at`

**`dora_metrics`** : `id`, `project_id`, `period_start`, `period_end`, `deployment_frequency`, `lead_time_seconds`, `change_failure_rate`, `mttr_seconds`, `calculated_at`

**`flow_metrics`** : `id`, `project_id`, `period_start`, `period_end`, `cycle_time_hours`, `lead_time_hours`, `throughput`, `wip`, `flow_efficiency`, `calculated_at`

**`activity_log`** : `id`, `project_id`, `actor_type` (user|agent|system), `actor_id`, `action`, `entity_type`, `entity_id`, `metadata` (JSONB), `timestamp`

**`users`** : `id`, `email`, `name`, `avatar_url`, `auth_method`, `personal_context` (TEXT — CONTEXT.md personnel, chiffré), `created_at`, `last_login_at`

**`budget_incidents`** : `id`, `agent_id`, `project_id`, `threshold_percent`, `budget_cents`, `spent_cents`, `action_taken` (alert|pause), `timestamp`

**`onboarding_progress`** : `id`, `user_id`, `step` (welcome|first_project|first_context|first_intent|first_spec|first_gate|first_cycle|exploration), `completed_at`, `metadata` (JSONB)

**`telemetry_config`** : `id`, `enabled` (boolean, default false), `instance_id` (UUID), `last_sent_at`, `consent_given_by`, `consent_given_at`

**`context_scopes`** : `id`, `type` (organization|team|project|personal), `parent_id` (FK self — nullable, pour l'héritage), `name`, `path` (chemin dans le repo ou en base), `version` (hash du contenu), `token_weight` (poids estimé en tokens), `access_policy` (public_org|restricted_team|project_only|personal), `owner_id` (FK users — Context Steward pour org), `last_modified_at`, `created_at`

**`context_sync_events`** : `id`, `scope_id` (FK context_scopes), `session_id` (FK agent_sessions), `project_id`, `triggered_by` (user_id), `proposals` (JSONB — liste de propositions avec diff), `accepted_count`, `rejected_count`, `modified_count`, `applied_at`, `created_at`

**`context_access_log`** : `id`, `scope_id`, `accessor_type` (user|agent), `accessor_id`, `action` (read|write), `token_count`, `timestamp`

---

## 8. Intégrations V1

### 8.1 Git (GitHub / GitLab)

| Fonctionnalité | Description |
|----------------|-------------|
| **Repository linking** | Associer un repo Git à un projet AIAD Studio |
| **Scaffolding `.aiad/`** | Commit initial de la structure `.aiad/` (incluant `context/`) dans le repo |
| **PR tracking** | Lier les PRs aux SPECs, vérifier le Drift Lock (code + SPEC + contexte dans même PR si impacté) |
| **Branch policy** | Création automatique de branches par SPEC (`spec/SPEC-NNN-slug`) |
| **Commit analysis** | Analyser les commits pour le Drift Check |
| **Webhook receiver** | Recevoir les événements Git (push, PR opened/merged, etc.) |
| **Status checks** | Poster des status checks sur les PRs (Drift Lock verified, Gate passed, etc.) |

### 8.2 CI/CD (GitHub Actions / GitLab CI)

| Fonctionnalité | Description |
|----------------|-------------|
| **Pipeline monitoring** | Suivre les résultats des pipelines CI/CD |
| **Deployment tracking** | Détecter les déploiements pour le calcul DORA (Deployment Frequency) |
| **Failure detection** | Détecter les échecs post-déploiement pour Change Failure Rate |
| **Gate automation** | Déclencher des vérifications automatiques au Gate (linting, tests, etc.) |
| **MTTR tracking** | Mesurer le temps entre incident et fix déployé |

### 8.3 API REST + Webhooks

Pour toute intégration non couverte en V1, AIAD Studio expose :

- **API REST complète** : toutes les entités CRUD + actions métier + **contexte** (lecture/écriture scopes, résolution cascade)
- **Webhooks sortants** : événements configurables (intent.created, spec.gate_passed, agent.run_completed, drift.detected, **context.sync_proposed**, **context.updated**, etc.)
- **API keys** : authentification par clé API pour intégrations programmatiques

### 8.4 Importeurs de Contexte

**Positionnement** : Studio ne remplace pas Notion/Confluence pour la documentation opérationnelle. Le wiki c'est pour les humains qui lisent ; le Context Mesh c'est pour les humains **et** les agents qui exécutent. Les importeurs permettent d'**initialiser** le contexte à partir des sources existantes — pas de synchronisation bidirectionnelle en continu.

| Source | Nature de l'import | Scope cible |
|--------|--------------------|-------------|
| **Notion** | Pages sélectionnées → conversion Markdown → insertion dans CONTEXT.md | `organization`, `team`, `project` |
| **Confluence** | Espaces ou pages → conversion Markdown → insertion dans CONTEXT.md | `organization`, `team` |
| **Google Drive** | Documents sélectionnés → extraction texte → insertion | `organization`, `team` |

**Principe** : l'import est un **acte conscient**, pas une synchronisation automatique. L'utilisateur sélectionne ce qui est pertinent, valide la conversion, et le contexte importé est ensuite **versionné dans Git** comme tout contexte AIAD. Les sources originales continuent d'exister — Studio n'exige pas de les abandonner.

**V1** : import manuel (upload de fichiers Markdown/texte + assistant de structuration). Import Notion/Confluence via API en V1.1.

---

## 9. Sécurité et Conformité

### 9.1 Authentification et Autorisation

| Mécanisme | Description |
|-----------|-------------|
| **Auth locale** | Email + mot de passe (bcrypt/Argon2) |
| **SSO** | OIDC / SAML 2.0 pour grandes entreprises |
| **API keys** | Pour intégrations et agents |
| **Sessions** | JWT avec refresh tokens |
| **MFA** | TOTP (optionnel, recommandé) |

### 9.2 Isolation et Permissions

- **Multi-projet** : isolation stricte des données par projet
- **Responsabilité AIAD** : permissions basées sur la responsabilité portée par projet
- **Audit trail** : `activity_log` immuable de toutes les actions

### 9.3 Chiffrement

- **Transit** : TLS 1.3 obligatoire
- **Repos** : Chiffrement des `runtime_config` agents (clés API) en base
- **Secrets** : Gestion dédiée des secrets agent avec versioning
- **Contexte personnel** : le `personal_context` de chaque utilisateur est chiffré en base (AES-256)

### 9.4 RGPD Self-Compliance

AIAD Studio, en tant qu'application, est elle-même conforme RGPD :
- Minimisation des données collectées
- Droit à l'export des données utilisateur
- Droit à l'effacement
- Registre des traitements intégré
- Pas de transfert hors UE par défaut (self-hosted)

### 9.5 Contextual RBAC — Contrôle d'Accès au Contexte

Chaque scope du Context Mesh porte un **niveau de confidentialité** :

| Niveau | Signification | Qui peut lire | Qui peut écrire |
|--------|---------------|---------------|-----------------|
| `public_org` | Visible par tous les membres de l'instance | Tous | Context Steward |
| `restricted_team` | Visible uniquement par les membres de l'équipe | Équipe | PM + PE + TL |
| `project_only` | Visible uniquement par les membres du projet | Projet | PE + TL |
| `personal` | Visible uniquement par l'individu | Individu | Individu |

**Règles d'accès agent :**
- Les agents héritent des permissions **de l'utilisateur qui lance la session** — un agent lancé par un PE du projet Alpha ne peut pas lire le contexte `restricted_team` d'une équipe dont le PE n'est pas membre.
- Aucun contexte `restricted_team` ou `project_only` n'est exposé à un agent utilisant un modèle cloud (non-local) sans **opt-in explicite** au niveau scope. Par défaut, seul le niveau `public_org` est transmis aux modèles cloud.
- Tous les accès au contexte sont loggés dans `context_access_log` — source d'audit supplémentaire.

**Alignement RGPD** : cette politique matérialise le principe de minimisation (l'agent n'a que le contexte strictement nécessaire) et le principe de limitation d'accès (seuls les rôles légitimes accèdent aux scopes restreints).

---

## 10. Trade-offs et Décisions Clés

| Décision | Options considérées | Choix | Raison |
|----------|---------------------|-------|--------|
| **Stack Paperclip vs Next.js** | Next.js (SSR, App Router) vs Express+React (comme Paperclip) | Express + React | Cohérence avec Paperclip (réutilisation de patterns), séparation claire front/back, plus simple pour self-hosted |
| **Agents hiérarchiques vs flat** | Hiérarchie CEO/managers (Paperclip) vs flat (PE orchestre) | Orchestration intelligente avec validation PE | Fidèle à la valeur "Primauté de l'Intention Humaine". Les agents ne décident pas, ils sont orchestrés |
| **Gouvernance optionnelle vs obligatoire** | Checklists gouvernance bypassables vs bloquantes | Obligatoire au Gate et Validate | La gouvernance Tier 1 a droit de veto dans AIAD. Un bypass serait une trahison du framework |
| **Métriques calculées vs saisies** | Saisie manuelle vs extraction automatique Git/CI | Automatique | Réduit la friction, augmente la fiabilité. Aligné avec "Empirisme sans Concession" |
| **Single-assignee vs multi-assignee** | Tâche assignée à N agents/humains vs 1 seul | Single-assignee | Atomic execution. Élimine race conditions. Responsabilité claire. Pattern validé par Paperclip |
| **Rituels guidés vs libres** | Tous guidés vs tous libres vs hybride | Hybride selon le rituel | L'Atelier d'Intention est un espace humain pur (valeur 7). Le standup bénéficie d'un guidage. Chaque rituel a sa nature |
| **Base de données** | PostgreSQL vs SQLite vs MongoDB | PostgreSQL | JSONB natif, robuste, standard entreprise, extensions, transactions ACID pour atomic checkout |
| **Télémétrie** | Pas de télémétrie vs opt-out vs opt-in | Opt-in (désactivé par défaut) | Respect RGPD + confiance open source. Les données d'adoption sont nécessaires au pilotage stratégique mais la confiance prime |
| **Onboarding éducatif vs minimaliste** | Onboarding technique (juste les boutons) vs éducatif (framework + outil) | Éducatif | Studio est un canal d'acquisition par l'usage. L'éducation au framework est un investissement d'acquisition |
| **Signaux d'accompagnement** | Pas de suggestions vs suggestions intégrées | Suggestions non-intrusives, désactivables | Alignement modèle économique (Étage 1 → Étage 3). Ne doivent jamais bloquer ni dégrader l'UX |
| **Context Mesh : CONTEXT.md vs wiki intégré** | Wiki libre dans l'app vs fichiers Markdown versionnés dans Git | Fichiers versionnés dans Git | Le contexte est du code. Il mérite versioning, diff, rollback, revue. Un wiki freestyle dérive inévitablement |
| **Propagation contexte : automatique vs humaine** | Sync automatique post-session vs validation humaine systématique | Validation humaine obligatoire (Context Sync Loop) | Primauté de l'intention humaine. L'agent propose, l'humain dispose. Même pour la propagation de contexte |
| **6ème responsabilité Context Steward vs répartition** | Créer un rôle formel vs répartir dans les 5 existants | Variante A : répartition (PE = gardien contexte projet, PM+PE+TL = équipe) | Évite l'inflation des rôles. Le PE porte naturellement cette responsabilité. Context Steward existe comme rôle instance, pas comme responsabilité AIAD |
| **Remplacer vs connecter les outils existants** | Remplacer Notion/Confluence vs s'y substituer vs cohabiter | Cohabiter : le wiki pour les humains, le Context Mesh pour les agents | Studio n'a pas à être un wiki. Les importeurs permettent d'initialiser le contexte depuis les sources existantes, sans les supprimer |
| **CLI : wrapper vs natif** | CLI comme wrapper de l'API vs citoyen de première classe | CLI native, parité avec l'UI | Les power users (PE, AE) vivent dans le terminal. Toute fonctionnalité UI doit avoir son pendant CLI. API-first rend cela naturel |

---

## 11. Dépendances et Risques

### 11.1 Dépendances

| Dépendance | Type | Mitigation |
|------------|------|------------|
| **APIs agents IA** (Claude, Codex, Gemini) | Externe | Multi-adapter — si un provider tombe, les autres restent. Adapter `process` comme fallback générique |
| **GitHub / GitLab API** | Externe | Abstraction via `git-service.ts`. Support des deux providers. Webhooks + polling comme fallback |
| **PostgreSQL** | Infrastructure | Mode embedded-postgres pour évaluation. Documentation déploiement claire |
| **Communauté AIAD** | Humain | Framework open source, pas de vendor lock-in. Le produit est autonome même sans communauté active |

### 11.2 Risques

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| **Complexité perçue** : 27 commandes + gouvernance + Context Mesh = trop pour adoption | Élevée | Élevé | Onboarding progressif. Mode "essentiel" avec seulement Intent → SPEC → Gate → Exec → Validate. Context Mesh et gouvernance introduits graduellement |
| **Performance agents** : latence des LLM impacte l'UX | Moyenne | Moyen | Sessions persistantes + compaction. Monitoring temps réel. Feedback loop via Context Audit |
| **Drift Lock en pratique** : les équipes bypasse le Drift Lock par commodité | Élevée | Élevé | Hook CI/CD bloquant. Pas de merge sans Drift Lock vérifié. Gamification (score de conformité) |
| **Coûts agents** : explosion des coûts LLM sur gros projets | Moyenne | Élevé | Budget enforcement multi-niveaux. Auto-pause. Alertes proactives. Context Budget optimization. Caching du contexte hérité |
| **Adoption entreprise** : résistance au changement dans les grandes structures | Élevée | Élevé | Mode compatible (AIAD Studio peut coexister avec Jira/Azure DevOps). Import/export. API ouverte. Importeurs de contexte depuis Notion/Confluence |
| **Maintenance open source** : charge de maintenance sans revenus directs | Moyenne | Moyen | Communauté AIAD active. Revenus services (consulting, formation). Contributions entreprise |
| **Studio reste un outil de niche** : pas d'adoption organique au-delà des clients directs | Moyenne | Élevé | Onboarding autonome, démo cloud éphémère, documentation exemplaire, présence GitHub active, getting started en <30 min |
| **Qualité du réseau praticiens** : praticiens certifiés qui délivrent mal dégradent la marque | Faible | Élevé | Examen de certification exigeant, supervision trimestrielle, feedback client, droit de retrait du label |
| **Context Mesh ignoré** : les équipes utilisent Studio sans structurer leur contexte | Élevée | Moyen | Onboarding inclut une étape contexte. Signaux d'accompagnement. Friction intentionnelle (sessions moins efficaces sans contexte hérité = la douleur pousse à structurer). Ne pas rendre le Context Mesh obligatoire pour utiliser le cycle SDD |
| **Surcharge de contexte** : le Context Mesh grossit sans contrôle et dépasse les budgets | Moyenne | Moyen | Context Health dashboard. Alerte AE si ratio hérité > 40%. Context Review trimestriel. Principe de sobriété intentionnelle appliqué au contexte |

---

## 12. Roadmap Post-V1

### V1.1 — Consolidation + Acquisition (M+3)

- Démo cloud éphémère (14 jours, environnement partagé, zéro friction d'installation)
- Système de plugins (extensibilité sans fork)
- Templates de projets pré-configurés (par industrie, par taille d'équipe)
- Notifications (email, Slack/Teams)
- Import depuis Jira / Azure DevOps / Linear
- Mode "essentiel" (onboarding encore plus simplifié pour les débutants)
- **Importeurs Context Mesh** : import Notion / Confluence / Google Drive via API (V1 = upload manuel)
- **Context Sync amélioré** : détection plus fine, propositions plus précises basées sur l'historique

### V1.2 — Intelligence + Certification + Skills (M+6)

- SQS assisté par IA (suggestions d'amélioration de SPEC)
- Estimation automatique du Context Budget basée sur l'historique
- Analyse prédictive des risques de drift
- Rapports automatiques de rétrospective
- Chatbot contextuel PE (assistant intégré)
- **Tableau de bord Certification** : suivi des prérequis (≥ 3 cycles SDD complets + Context Mesh ≥ 2 scopes) pour la certification Praticien AIAD, lien vers le parcours e-learning
- **Bibliothèque de templates** : Intent templates, SPEC templates, AGENT-GUIDEs contextualisés (AI-ACT, RGPD, RGAA, RGESN) — payants sur aiad.ovh
- **Marketplace de skills AIAD** : skills versionnés, certifiés par des Praticiens AIAD, partagés entre équipes. Skills gratuits (communauté) et premium (Étage 2 du modèle économique). Exemples : `/rapport`, `/vital`, `/prep-comite`, `/daily-briefing`

### V2.0 — Plateforme + Réseau (M+12)

- Marketplace de templates AIAD (équivalent "Clipmart" de Paperclip) avec templates gratuits et premium
- Multi-tenant (une instance, plusieurs organisations)
- Cloud agents (exécution dans des sandboxes cloud)
- **Portail praticiens certifiés** : listing sur aiad.ovh, badge in-app, gestion des missions référées
- **Contenu premium par abonnement** (29-49€/mois) : masterclass mensuelles, templates mis à jour, sessions Q&A en groupe
- Desktop app (Electron/Tauri)
- Application mobile (consultation dashboards)
- Intégrations natives supplémentaires (Slack, Teams, Notion, Confluence — bidirectionnel)
- **Context Mesh fédéré** : partage de contexte `organization` entre instances (opt-in, pour les ESN multi-projets)

---

## 13. Critères de Succès

### 13.1 Succès Technique (V1 Launch)

- [ ] Cycle SDD complet exécutable de bout en bout dans l'UI (Intent → Drift Lock)
- [ ] ≥ 3 adapters agents fonctionnels (Claude, Codex, + 1 autre)
- [ ] Métriques DORA calculées automatiquement via intégration Git/CI
- [ ] Gouvernance Tier 1 obligatoire au Gate et au Validate
- [ ] Drift Lock vérifié automatiquement via hook Git
- [ ] Déploiement self-hosted en < 30 minutes (docker-compose up)
- [ ] Onboarding éducatif : un nouvel utilisateur complète un 1er cycle SDD sans aide externe
- [ ] Télémétrie opt-in fonctionnelle et documentée
- [ ] **Context Mesh fonctionnel** : 4 scopes configurables, résolution cascade opérationnelle
- [ ] **Context Sync Loop** : propositions de mise à jour fonctionnelles post-session
- [ ] **CLI native** : toutes les commandes /sdd-* et /aiad-* disponibles en CLI

### 13.2 Succès Adoption — Canal d'acquisition (M+6)

- [ ] ≥ 10 instances Studio déployées par des équipes distinctes
- [ ] ≥ 100 cycles SDD complets exécutés / mois (toutes instances — North Star)
- [ ] Taux de complétion onboarding > 60%
- [ ] Score NPS > 40 auprès des utilisateurs PE
- [ ] ≥ 3 contributions communautaires (PRs, adapters, templates)
- [ ] ≥ 5 certifications Praticien AIAD vendues
- [ ] **≥ 50% des instances ont un Context Mesh configuré sur ≥ 2 scopes**

### 13.3 Succès Impact — Modèle économique (M+12)

- [ ] ≥ 50 instances Studio déployées
- [ ] ≥ 500 cycles SDD complets / mois
- [ ] Taux de conversion instance → premier contact commercial ≥ 5%
- [ ] ≥ 20 certifications Praticien AIAD vendues (cumul)
- [ ] ≥ 15 praticiens certifiés actifs
- [ ] ≥ 1 ESN partenaire
- [ ] Ratio revenu hors services directs ≥ 18%
- [ ] Au moins 1 grande entreprise / ESN en production
- [ ] Framework AIAD adopté par ≥ 50 équipes (avec ou sans AIAD Studio)
- [ ] **≥ 80% des sessions agent utilisent un contexte hérité à jour** (North Star secondaire)

---

## Annexes

### A. Glossaire

| Terme | Définition |
|-------|------------|
| **Intent Statement** | Artefact de premier ordre capturant le POURQUOI d'un développement |
| **SPEC** | Spécification technique détaillée dérivée d'un Intent |
| **SQS** | Spec Quality Score — score 0-5 validant la qualité d'une SPEC |
| **Execution Gate** | Point de contrôle obligatoire entre SPEC validée et lancement agent |
| **Drift Lock** | Contrainte : code + SPEC (+ contexte si impacté) committés dans la même PR |
| **Anti-Drift Check** | Vérification de synchronisation artefacts ↔ code ↔ contexte |
| **Context Engineering Budget** | Budget de tokens injectés par session agent — 3 dimensions : hérité, SPEC, on-demand |
| **Context Audit** | Feedback post-session sur la consommation de contexte, ventilé par couche |
| **Human Authorship** | Principe : l'intention est toujours rédigée par un humain identifié |
| **Human Learnings** | Documentation des écarts entre intention humaine et résultat obtenu |
| **Atelier d'Intention** | Rituel mensuel pur humain : "Construisons-nous toujours ce que nous voulions ?" |
| **Gouvernance Tier 1** | Artefacts avec droit de veto (AI-ACT, RGPD, RGAA, RGESN) |
| **PE** | Product Engineer — gardien de l'intention et du contexte tout au long du cycle |
| **AE** | Agents Engineer — configure et optimise l'écosystème d'agents et la mécanique du Context Mesh |
| **DORA** | 4 métriques de performance livraison (Deployment Frequency, Lead Time, Change Failure Rate, MTTR) |
| **Flow Metrics** | 5 métriques de flux (Cycle Time, Lead Time, Throughput, WIP, Flow Efficiency) |
| **Synchronisation Alignement Stratégique** | Sync mensuelle PM/PE/AE/TL sur la stratégie et les Intents |
| **Patrimoine Intentionnel** | Le substrat partagé de contexte accumulé par les intentions, décisions et apprentissages d'une organisation — concept narratif du Context Mesh |
| **Context Mesh** | Architecture technique du Patrimoine Intentionnel : 4 scopes (organization, team, project, personal) avec héritage en cascade, gouvernance et propagation |
| **Context Scope** | Unité de contexte dans le Context Mesh. Porte un CONTEXT.md, des skills, des rules et des decisions |
| **Context Sync Loop** | Mécanisme de propagation post-session : détection → classification → proposition humaine → application |
| **Context Steward** | Rôle instance (non-responsabilité AIAD) portant la gouvernance du scope `organization`. Typiquement le CTO, le Gardien AIAD client, ou un comité |
| **Context Review** | Rituel trimestriel d'audit de cohérence et fraîcheur du Context Mesh |
| **Context Health** | Dashboard de santé du Context Mesh : poids, fraîcheur, utilisation, alertes |
| **Personal OS** | Système personnel de contexte, skills et préférences d'un individu travaillant avec des agents IA |
| **Company OS** | Extension du Personal OS à l'échelle de l'équipe et de l'entreprise — matérialisé par le Context Mesh dans AIAD Studio |

### B. Document Stratégique Associé

Ce PRD s'articule avec le document **"Modèle Économique AIAD Studio — Stratégie de Scale"** (v1.0, 11 avril 2026) qui détaille l'architecture économique en 4 étages, les projections financières sur 3 ans, et les indicateurs de pilotage stratégique. Les choix produit de ce PRD (onboarding éducatif, télémétrie opt-in, signaux d'accompagnement, friction intentionnelle, Context Mesh) sont directement dérivés de cette stratégie.

### C. Références

- Framework AIAD v1.5 — aiad.ovh
- SDD Mode v1.3 — Documentation interne AIAD
- Constitution AIAD v1.0 — Mars 2026
- Paperclip — github.com/paperclipai/paperclip
- EU AI Act — Règlement (UE) 2024/1689
- RGPD — Règlement (UE) 2016/679
- RGAA 4.1 — Référentiel Général d'Amélioration de l'Accessibilité
- RGESN — Référentiel Général d'Écoconception de Services Numériques
- Conférence *"Claude Code au-delà du code : construire les bases d'une Agentic Company"* — Julie Prieur & Yoann Benoit, AI Product Day, avril 2026

---

*Ce document est un artefact vivant. Il sera mis à jour au fil des itérations de conception et de développement d'AIAD Studio.*
