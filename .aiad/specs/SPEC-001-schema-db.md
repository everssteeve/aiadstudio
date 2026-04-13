# SPEC-001-schema-db

**Intent parent** : INTENT-001
**Auteur** : Steeve Evers (PE)
**Date** : 2026-04-13
**Statut** : done
**SQS** : 4/5 — Gate ouverte avec réserve (voir §6)

---

## 1. Contexte

AIAD Studio n'a aucune infrastructure technique à ce jour. Le package `@aiad/db`
existe (Drizzle ORM + pg installés) mais son schéma est vide. Sans ce schéma, aucune
feature métier (cycle SDD, agents, métriques, context mesh) ne peut être développée.
Cette SPEC livre le schéma Drizzle complet couvrant les 24 tables du PRD §7.2,
structuré en fichiers domaine et prêt pour la première migration.

---

## 2. Comportement Attendu

### Input

- PRD §7.2 : définitions des 24 tables (colonnes, types, FKs, contraintes)
- `packages/db/src/schema/index.ts` : fichier vide à remplacer
- `packages/db/src/migrations/` : répertoire vide à alimenter
- `packages/db/package.json` : `@aiad/db`, Drizzle ORM ^0.45, drizzle-kit ^0.31

### Processing

**1. Organiser le schéma en 10 fichiers domaine** dans `packages/db/src/schema/` :

| Fichier | Tables contenues |
|---------|-----------------|
| `users.ts` | `users` |
| `projects.ts` | `projects`, `project_memberships` |
| `sdd-cycle.ts` | `intent_statements`, `specs`, `execution_gates` |
| `issues.ts` | `issues` |
| `agents.ts` | `agents`, `agent_project_access`, `heartbeat_runs`, `agent_sessions`, `cost_events`, `budget_incidents` |
| `governance.ts` | `governance_audits`, `rituals`, `adrs` |
| `metrics.ts` | `dora_metrics`, `flow_metrics` |
| `activity.ts` | `activity_log` |
| `onboarding.ts` | `onboarding_progress`, `telemetry_config` |
| `context.ts` | `context_scopes`, `context_sync_events`, `context_access_log` |

**2. Pour chaque table, respecter :**
- Types Drizzle natifs : `uuid()` (PK, default `crypto.randomUUID()`), `text()`,
  `integer()`, `boolean()`, `jsonb()`, `timestamp()` (`{ withTimezone: true }`)
- PK : `uuid` avec `defaultRandom()` sur toutes les tables sauf `agent_project_access`
  (PK composite `[agent_id, project_id]`)
- `created_at` / `updated_at` : `timestamp({ withTimezone: true }).defaultNow().notNull()`
- FKs Drizzle : `.references(() => table.column)` — pas de `.onDelete()` sauf exceptions
  listées ci-dessous
- Champs JSONB : `jsonb()` avec type générique `$type<T>()` annoté
- Champs chiffrés applicativement (`personal_context`, `runtime_config`, `adapter_config`) :
  `text()` standard — le chiffrement est applicatif, pas DB

**3. FKs avec cascade explicite :**
- `intent_statements.project_id` → `projects.id` `.onDelete('cascade')`
- `specs.intent_id` → `intent_statements.id` `.onDelete('cascade')`
- `execution_gates.spec_id` → `specs.id` `.onDelete('cascade')`
- `issues.project_id` → `projects.id` `.onDelete('cascade')`
- `heartbeat_runs.agent_id` → `agents.id` `.onDelete('cascade')`
- `cost_events.agent_id` → `agents.id` `.onDelete('cascade')`
- `context_sync_events.scope_id` → `context_scopes.id` `.onDelete('cascade')`
- `context_access_log.scope_id` → `context_scopes.id` `.onDelete('cascade')`

**4. Enums Drizzle** (`pgEnum`) à définir dans chaque fichier domaine :
- `projectStatus` : `active`, `archived`
- `repositoryProvider` : `github`, `gitlab`
- `intentStatus` : `draft`, `active`, `done`, `archived`
- `specStatus` : `draft`, `review`, `ready`, `in_progress`, `validation`, `done`, `archived`
- `gateDecision` : `approved`, `rejected`
- `issueStatus` : `backlog`, `todo`, `in_progress`, `in_review`, `done`, `blocked`, `cancelled`
- `issuePriority` : `critical`, `high`, `medium`, `low`
- `assigneeType` : `user`, `agent`
- `agentStatus` : `active`, `paused`, `disabled`
- `heartbeatStatus` : `queued`, `in_progress`, `completed`, `failed`
- `actorType` : `user`, `agent`, `system`
- `governanceDomain` : `ai_act`, `rgpd`, `rgaa`, `rgesn`, `context`
- `ritualType` : `standup`, `drift_check`, `tech_review`, `demo`, `intention`, `sync_strat`, `retro`, `gouvernance`, `context_review`
- `ritualCadence` : `daily`, `weekly`, `biweekly`, `monthly`, `quarterly`
- `ritualStatus` : `scheduled`, `in_progress`, `completed`, `skipped`
- `adrStatus` : `proposed`, `accepted`, `deprecated`, `superseded`
- `responsibilityRole` : `pm`, `pe`, `ae`, `qa`, `tech_lead`
- `contextScopeType` : `organization`, `team`, `project`, `personal`
- `contextAccessPolicy` : `public_org`, `restricted_team`, `project_only`, `personal`
- `contextAccessorType` : `user`, `agent`
- `contextAccessAction` : `read`, `write`
- `onboardingStep` : `welcome`, `first_project`, `first_context`, `first_intent`, `first_spec`, `first_gate`, `first_cycle`, `exploration`
- `budgetAction` : `alert`, `pause`

**5. Mettre à jour `packages/db/src/schema/index.ts`** pour ré-exporter tous les fichiers :
```typescript
export * from './users.js'
export * from './projects.js'
export * from './sdd-cycle.js'
export * from './issues.js'
export * from './agents.js'
export * from './governance.js'
export * from './metrics.js'
export * from './activity.js'
export * from './onboarding.js'
export * from './context.js'
```

**6. Créer `packages/db/drizzle.config.ts`** :
```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/schema/index.ts',
  out: './src/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

**7. Générer la migration initiale** via `drizzle-kit generate` — le fichier SQL
résultant dans `src/migrations/` est commité avec le schéma.

### Output

```
packages/db/src/
├── schema/
│   ├── index.ts          ← ré-exports
│   ├── users.ts
│   ├── projects.ts
│   ├── sdd-cycle.ts
│   ├── issues.ts
│   ├── agents.ts
│   ├── governance.ts
│   ├── metrics.ts
│   ├── activity.ts
│   ├── onboarding.ts
│   └── context.ts
├── migrations/
│   └── 0000_initial_schema.sql   ← générée par drizzle-kit
└── index.ts              ← inchangé (export * from './schema/index.js')

packages/db/
└── drizzle.config.ts
```

Le package `@aiad/db` exporte : tous les schémas Drizzle (tables + enums) + le type
inféré de chaque table (`type User = typeof users.$inferSelect`).

### Cas limites

1. **Auto-référence `context_scopes.parent_id`** : FK nullable vers `context_scopes.id`
   (un scope `organization` n'a pas de parent). Drizzle : utiliser une fonction arrow
   pour éviter la référence circulaire : `.references((): AnyPgColumn => contextScopes.id)`.

2. **`agent_project_access` sans PK auto** : PK composite `primaryKey({ columns: [agentId, projectId] })`.
   Pas de colonne `id` sur cette table.

3. **`issues.parent_id` auto-référence** : même pattern que `context_scopes.parent_id` —
   FK nullable vers `issues.id` avec arrow function.

4. **`issues.execution_locked_at` nullable** : `timestamp({ withTimezone: true })` sans
   `.notNull()` — null = non verrouillé, présent = verrouillé par un acteur.

5. **Champs chiffrés** : `users.personal_context`, `agents.runtime_config`,
   `agents.adapter_config` sont des `text()` standard dans Drizzle. La mention
   `-- chiffré applicativement` est documentée en commentaire TypeScript dans le schéma.
   Ne pas créer de type spécial ou wrapper dans cette SPEC.

6. **`telemetry_config` — table singleton** : pas de `project_id`. Une seule ligne
   attendue en base (configuration globale de l'instance). Pas de contrainte DB pour
   l'enforcer dans cette SPEC — c'est une responsabilité applicative.

7. **`specs.acceptance_criteria` / `specs.dependencies` / `specs.governance_applicable`**
   sont des colonnes JSONB. Annoter avec `$type<string[]>()` pour `acceptance_criteria`,
   `$type<string[]>()` pour `dependencies`, `$type<Record<string, boolean>>()` pour
   `governance_applicable`.

---

## 3. Critères d'Acceptation

- [ ] Les 24 tables du PRD §7.2 sont présentes dans le schéma Drizzle
- [ ] Aucune table non listée dans le PRD §7.2 n'est créée
- [ ] Tous les enums Drizzle correspondent aux valeurs PRD
- [ ] `drizzle-kit generate` produit un fichier SQL valide sans erreur
- [ ] `drizzle-kit push` applique le schéma sur une instance PostgreSQL 16 locale sans erreur
- [ ] Le package `@aiad/db` build sans erreur TypeScript (`pnpm --filter @aiad/db build`)
- [ ] `tsc --noEmit` passe sans erreur (`strict: true`)
- [ ] Les auto-références (`context_scopes.parent_id`, `issues.parent_id`) ne produisent pas d'erreur de référence circulaire
- [ ] Les exports de `schema/index.ts` couvrent toutes les tables et enums
- [ ] Les types inférés (`$inferSelect`, `$inferInsert`) sont exportés pour les 24 tables

---

## 4. Interface / API

Le package `@aiad/db` expose :

```typescript
// Tables (Drizzle TableConfig)
export { users, projects, projectMemberships,
         intentStatements, specs, executionGates,
         issues, agents, agentProjectAccess,
         heartbeatRuns, agentSessions, costEvents, budgetIncidents,
         governanceAudits, rituals, adrs,
         doraMetrics, flowMetrics,
         activityLog, onboardingProgress, telemetryConfig,
         contextScopes, contextSyncEvents, contextAccessLog }

// Types inférés (select + insert)
export type { User, NewUser,
              Project, NewProject,
              ProjectMembership, NewProjectMembership,
              IntentStatement, NewIntentStatement,
              Spec, NewSpec,
              ExecutionGate, NewExecutionGate,
              Issue, NewIssue,
              Agent, NewAgent,
              HeartbeatRun, NewHeartbeatRun,
              AgentSession, NewAgentSession,
              CostEvent, NewCostEvent,
              BudgetIncident, NewBudgetIncident,
              GovernanceAudit, NewGovernanceAudit,
              Ritual, NewRitual,
              Adr, NewAdr,
              DoraMetric, NewDoraMetric,
              FlowMetric, NewFlowMetric,
              ActivityLog, NewActivityLog,
              OnboardingProgress, NewOnboardingProgress,
              TelemetryConfig, NewTelemetryConfig,
              ContextScope, NewContextScope,
              ContextSyncEvent, NewContextSyncEvent,
              ContextAccessLog, NewContextAccessLog }

// Enums
export { projectStatus, repositoryProvider, intentStatus,
         specStatus, gateDecision, issueStatus, issuePriority,
         assigneeType, agentStatus, heartbeatStatus, actorType,
         governanceDomain, ritualType, ritualCadence, ritualStatus,
         adrStatus, responsibilityRole, contextScopeType,
         contextAccessPolicy, contextAccessorType, contextAccessAction,
         onboardingStep, budgetAction }
```

---

## 5. Dépendances

- `drizzle-orm ^0.45` — déjà installé dans `packages/db`
- `drizzle-kit ^0.31` — déjà installé en devDependency
- `pg ^8.20` — déjà installé
- PostgreSQL 16 (instance locale ou docker-compose) — pour `drizzle-kit push` et tests
- **Aucune dépendance vers `server/` ou `ui/`** — ce package est une feuille du graphe

---

## 6. Estimation Context Budget

**Contexte à injecter pour cette tâche :**
- AGENT-GUIDE (condensé) : ~300 tokens
- Cette SPEC : ~900 tokens
- `.aiad/PRD.md` §7.2 (tables détaillées — colonnes, types, contraintes) : ~800 tokens
- `packages/db/src/schema/index.ts` (actuel, vide) : ~10 tokens
- `packages/db/package.json` : ~50 tokens
- **Total estimé** : ~2 060 tokens

> **Note (réserve Gate)** : le PRD §7.2 DOIT être lu par l'agent — cette SPEC définit
> la structure et les patterns, mais les colonnes de chaque table sont dans le PRD §7.2.
> L'agent lira `.aiad/PRD.md` offset ~1229 pour extraire les définitions de colonnes.

---

## 7. Definition of Output Done (DoOD)

- [ ] Code implémenté : 10 fichiers schéma + `index.ts` + `drizzle.config.ts`
- [ ] Migration SQL générée : `src/migrations/0000_initial_schema.sql`
- [ ] `pnpm --filter @aiad/db build` passe sans erreur
- [ ] `drizzle-kit push` valide sur PostgreSQL 16 (vérification manuelle PE)
- [ ] Lint passing (`eslint packages/db/src/`)
- [ ] Tests unitaires : vérifier que les 24 tables et tous les enums sont bien exportés
  (test d'imports, pas de tests DB — pas encore de setup de test DB dans cette SPEC)
- [ ] SPEC mise à jour si écart constaté pendant l'exécution (Drift Lock)
- [ ] Gouvernance vérifiée :
  - RGESN : schéma sans index superflus, JSONB utilisé à bon escient ✓
  - RGPD : champs sensibles (`personal_context`, `runtime_config`) identifiés et documentés ✓
  - RGAA : N/A (pas d'UI)
  - AI-ACT : N/A (pas de composant IA)
