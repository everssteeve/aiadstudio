# AGENT-GUIDE — AIAD Studio

## IDENTITÉ DU PROJET

- **Nom** : AIAD Studio
- **Description** : Plateforme open source de gestion de projets logiciels avec agents IA, basée sur le framework AIAD et le SDD Mode
- **Domaine** : Développement logiciel, orchestration d'agents IA
- **Mission** : Rendre le framework AIAD opérationnel via un outillage applicatif natif

## DOCUMENTATION DE RÉFÉRENCE

| Document | Chemin | Usage |
|----------|--------|-------|
| PRD | @.aiad/PRD.md | Cadrage produit |
| Architecture | @.aiad/ARCHITECTURE.md | Condensé technique permanent |
| SPEC active | @.aiad/specs/SPEC-XXX.md | Par tâche uniquement |
| Index SPECs | @.aiad/specs/_index.md | Planification |
| Gouvernance | @.aiad/gouvernance/ | Permanent (Tier 1, veto) |

## STACK TECHNIQUE

TypeScript full-stack. Express 5 (API) + React 18 (UI) + PostgreSQL 16 (DB) + Drizzle ORM.
Mono-repo pnpm. Tailwind + shadcn/ui. React Router + TanStack Query. WebSocket (ws) pour temps réel.
Tests : Vitest (unit) + Playwright (E2E). Docker pour infra locale.

## RÈGLES ABSOLUES

### TOUJOURS
- Valider les inputs avec Zod avant tout traitement
- Utiliser les types partagés de `@aiad-studio/shared`
- Logger avec Pino (jamais console.log)
- Écrire les tests AVANT ou AVEC le code (pas après)
- Respecter le single-assignee sur les issues (verrouillage atomique)
- Commiter SPEC + Code + Contexte ensemble (Drift Lock élargi)

### JAMAIS
- Ne jamais bypasser l'Execution Gate (SQS < 4/5 = pas d'exécution)
- Ne jamais stocker de secrets en clair en base
- Ne jamais utiliser `any` en TypeScript
- Ne jamais merger une PR sans Drift Check passé
- Ne jamais lancer un agent sans validation PE

## CONVENTIONS DE CODE

### Nommage
- Fichiers : kebab-case
- Types : PascalCase
- Fonctions : camelCase
- Tables DB : snake_case

### Structure des composants React
- Un composant par fichier
- Props typées avec interface
- Hooks custom dans `/hooks`
- Pas de logique métier dans les composants (déléguer aux hooks/services)

### Gestion des erreurs
- Classes `AiadError` custom pour les erreurs métier (sous-classes : `GateRejectedError`, `DriftDetectedError`)
- Codes d'erreur structurés : `DOMAIN.ACTION.REASON`
- Middleware Express centralisé pour le formatage des réponses d'erreur

## VOCABULAIRE MÉTIER

| Terme | Définition | À éviter |
|-------|------------|----------|
| Intent Statement | Artefact capturant le POURQUOI d'un développement | "ticket", "story" |
| SPEC | Spécification technique dérivée d'un Intent | "tâche", "issue" (quand on parle de spécification) |
| Execution Gate | Checkpoint SQS ≥ 4/5 avant lancement agent | "validation", "approval" |
| Drift Lock | Code + SPEC + Contexte dans même PR | "sync", "update" |
| PE | Product Engineer — gardien de l'intention | "dev lead", "scrum master" |
| AE | Agents Engineer — gestionnaire écosystème agents | "devops", "infra" |
| Synchronisation alignement stratégique | Sync mensuelle PM/PE/AE/TL | "alignement stratégique" (seul) |
| Context Mesh | Architecture de contexte partagé en 4 scopes (organization, team, project, personal) avec héritage cascade | "wiki", "knowledge base" |
| Context Sync Loop | Mécanisme de propagation post-session : détection → classification → proposition → validation humaine | "auto-sync", "sync automatique" |
| Context Steward | Rôle instance portant la gouvernance du scope organization | "admin contexte" |
| Patrimoine Intentionnel | Le substrat partagé de contexte accumulé par les intentions, décisions et apprentissages | "knowledge management" |

## PATTERNS DE DÉVELOPPEMENT

- **Service Layer** : Toute logique métier dans `services/`. Routes = validation + appel service + réponse.
- **Repository Pattern** : Accès DB via Drizzle dans les services, pas dans les routes.
- **Event-Driven** : Actions métier émettent des événements (`activity_log`) pour audit trail.
- **Adapter Pattern** : Chaque agent IA derrière une interface commune (`AgentAdapter`).

## ANTI-PATTERNS

| Anti-pattern | Raison | Solution |
|--------------|--------|----------|
| Logique métier dans les routes | Impossible à tester, duplication | Service layer |
| SQL brut dans les services | Injection, maintenance | Drizzle ORM |
| State global React | Race conditions, debugging | Context scoped + hooks |
| Polling pour temps réel | Performance, latence | WebSocket |
| Secrets dans les env vars en clair | Sécurité | Chiffrement en base |

## LESSONS LEARNED

| Date | Erreur agent | Correction | Impact |
|------|-------------|------------|--------|
| 2026-04-13 | SPEC-001 : enum `budgetAction` (24ème) oublié lors de l'exécution — liste longue traitée de façon non exhaustive | Vérifier systématiquement le count d'items attendus vs produits quand la SPEC énumère une liste (`n` enums, `n` tables, etc.) | Drift silencieux en base — budget_action absent du schéma initial |
| 2026-04-13 | SPEC-001 : nom de fichier migration `0000_tiresome_bug.sql` (auto-généré drizzle-kit) livré sans vérification contre le nom attendu dans la SPEC (`0000_initial_schema.sql`) | Après `drizzle-kit generate`, vérifier que le nom du fichier SQL produit correspond au nom attendu dans la SPEC Output section | Drift de nommage non détecté, cohérence SPEC/code rompue |

## HUMAN LEARNINGS

| Date | Intention exprimée | Résultat obtenu | Apprentissage |
|------|-------------------|-----------------|---------------|
| 2026-04-13 | Drift Lock joué à la fin de SPEC-001 | 2 drifts non détectés : enum manquant + nom migration | Le Drift Check doit être joué activement (commande `/sdd-drift-check`) avec une checklist point par point — pas une relecture rapide. Planifier le Drift Check comme étape obligatoire post-exécution, avant le commit. |
| 2026-04-13 | Réserve Gate : l'agent devait lire PRD §7.2 pendant l'exécution | Zéro correction manuelle sur les colonnes — pattern validé | Injecter une section externe (ex: PRD §7.2) en réserve dans la SPEC (note "lire offset X") est un pattern efficace. À réutiliser quand une SPEC dépend de données volumineuses hors SPEC. |
| 2026-04-13 | SPEC-002 : validation TypeScript sur monorepo | `rootDir: "./src"` bloque les imports cross-package | Règle monorepo : `server/tsconfig.json` doit avoir `rootDir: "../"` pour permettre les imports depuis `packages/`. S'assurer dès la création d'un nouveau package. |
| 2026-04-13 | SPEC-002 : dual-instance drizzle-orm | `drizzle-orm` dans server/ ET packages/db/ → deux builds incompatibles (TS2345) | Règle : `drizzle-orm` est encapsulé dans `@aiad/db`. Le server et les autres packages ne l'importent JAMAIS directement — ils passent par `@aiad/db` qui re-exporte ce dont ils ont besoin (ex: `sql`). |
