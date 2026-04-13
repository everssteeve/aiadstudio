# ARCHITECTURE : AIAD Studio

> Ce fichier est le contexte technique permanent. Un résumé condensé (max 500 tokens) est injecté dans chaque session agent.
> Mainteneur : Tech Lead

## 1. Principes Architecturaux [7 principes]

1. **AIAD-Native** : Le cycle SDD, le Context Mesh et les concepts AIAD ne sont pas des plugins — ils sont le coeur de l'architecture. Chaque entité, route et service est pensé autour du cycle Intent -> SPEC -> Gate -> Exec -> Validate -> Drift Lock et du Patrimoine Intentionnel.

2. **Intention Traceable** : Chaque action dans le système est traçable jusqu'à un Intent Statement. Cost event -> SPEC -> Intent. Issue -> SPEC -> Intent. Context change -> Commit -> Session -> SPEC -> Intent. Matérialise la valeur "Primauté de l'Intention Humaine".

3. **Gouvernance by Design** : Les artefacts de gouvernance Tier 1 ne sont pas optionnels. Ils sont évalués à chaque Gate et chaque Validation. Le système ne permet pas de bypass. La gouvernance du contexte est auditée trimestriellement.

4. **Atomic Execution** : Inspiré de Paperclip — une tâche ne peut être travaillée que par un seul agent à la fois. Le verrouillage est transactionnel (`execution_locked_at`).

5. **Human in the Loop** : Aucun agent n'est lancé sans validation PE explicite. Aucune propagation de contexte ne se fait sans validation humaine. Les suggestions sont des recommandations, jamais des actions automatiques.

6. **Education par l'Usage** : L'onboarding et l'aide contextuelle enseignent le *pourquoi* du framework AIAD, pas seulement le *comment* de l'interface. Studio est un vecteur de transmission de la méthodologie.

7. **API-first + CLI native** : Toute fonctionnalité UI doit avoir son pendant API REST et CLI. Le terminal est un point d'entrée de première classe, pas un wrapper secondaire. Les power users (PE, AE) peuvent piloter Studio entièrement depuis leur terminal.

## 2. Vue d'Ensemble

```
                           ┌─────────────────────────────────────┐
                           │           AIAD Studio               │
                           └──────────────┬──────────────────────┘
                                          │
            ┌─────────────────────────────┼─────────────────────────────┐
            │                             │                             │
     ┌──────┴──────┐             ┌────────┴────────┐           ┌───────┴───────┐
     │   UI (React) │             │  CLI (native)   │           │  Webhooks in  │
     │   Vite + TW  │             │  pnpm cli       │           │  Git/CI events│
     └──────┬──────┘             └────────┬────────┘           └───────┬───────┘
            │                             │                             │
            └─────────────────────────────┼─────────────────────────────┘
                                          │ HTTP / WebSocket
                                          ▼
                              ┌───────────────────────┐
                              │   Server (Express 5)  │
                              │                       │
                              │  ┌─ routes/          ─┤◄── REST API
                              │  ├─ middleware/       ─┤◄── Auth, RBAC, Activity Log
                              │  ├─ services/        ─┤◄── Logique métier SDD + AIAD
                              │  ├─ adapters/        ─┤◄── Agents IA (Claude, Codex...)
                              │  └─ realtime/        ─┤◄── WebSocket (logs agents, notifs)
                              └───────────┬───────────┘
                                          │
                              ┌───────────┴───────────┐
                              │    PostgreSQL 16      │
                              │  (ou embedded-postgres)│
                              │                       │
                              │  Entités SDD :        │
                              │  Intent -> SPEC ->    │
                              │  Gate -> Run -> Drift  │
                              │                       │
                              │  Context Mesh :       │
                              │  Scopes (org/team/    │
                              │  project/personal)    │
                              │                       │
                              │  Métriques :          │
                              │  DORA + Flow          │
                              └───────────────────────┘
```

**Flux type — cycle SDD complet :**
```
PE (UI/CLI)
  │
  ├── POST /intents ──────────────────────────► intent-service.ts
  ├── POST /specs ────────────────────────────► spec-service.ts
  ├── POST /gates ────► SQS scoring ─────────► gate-service.ts (SQS >= 4/5 ?)
  │                         │
  │                    [REJECT si < 4/5]
  │                         │
  ├── POST /agents/run ──► context-resolver.ts ──► adapter (Claude/Codex/...)
  │                         │                         │
  │                    [Context Mesh                [Heartbeat: tokens, coûts,
  │                     résolution cascade]          logs temps réel via WS]
  │                         │
  ├── POST /validate ─────► drift-service.ts ────► governance-service.ts
  │                         │
  └── Drift Lock OK ──────► SPEC + Code dans même PR
```

## 3. Stack Technique

| Composant | Technologie | Justification |
|-----------|-------------|---------------|
| **Langage** | TypeScript (full-stack, strict) | Typage fort, écosystème riche, cohérence front/back |
| **Runtime** | Node.js 20 LTS | Mature, performant, large communauté. Cohérent avec Paperclip |
| **Framework Backend** | Express 5 | Séparation claire front/back, plus simple pour self-hosted |
| **Framework Frontend** | React 18 + Vite | Build rapide, écosystème composants riche, large adoption entreprise |
| **Styling** | Tailwind CSS + shadcn/ui | Composants accessibles (RGAA), design system cohérent |
| **Database** | PostgreSQL 16 | JSONB natif, extensions (pg_cron), standard entreprise, ACID pour atomic checkout |
| **Fallback DB** | embedded-postgres | Evaluation sans infrastructure PostgreSQL externe |
| **ORM** | Drizzle ORM | Type-safe, léger, migrations intégrées. Cohérent avec Paperclip |
| **Temps réel** | WebSocket (ws) | Streaming logs agents, notifications, mises à jour live |
| **Auth** | better-auth | Flexible, SSO-ready (OIDC/SAML pour entreprise) |
| **Mono-repo** | pnpm workspaces | Gestion dépendances efficace, builds parallèles |
| **Tests** | Vitest + Playwright | Unitaires + E2E, rapide, TypeScript natif |
| **CI/CD** | GitHub Actions / GitLab CI | Standard, extensible |
| **Conteneur** | Docker + docker-compose | Déploiement self-hosted simplifié |

## 4. Structure du Projet

```
aiad-studio/
├── server/                          # API REST Express
│   ├── src/
│   │   ├── app.ts                   # Configuration Express
│   │   ├── index.ts                 # Point d'entrée
│   │   ├── routes/
│   │   │   ├── projects.ts
│   │   │   ├── intents.ts
│   │   │   ├── specs.ts
│   │   │   ├── gates.ts
│   │   │   ├── issues.ts
│   │   │   ├── agents.ts
│   │   │   ├── heartbeat.ts
│   │   │   ├── rituals.ts
│   │   │   ├── metrics.ts
│   │   │   ├── governance.ts
│   │   │   ├── context.ts           # Routes Context Mesh
│   │   │   └── activity.ts
│   │   ├── services/
│   │   │   ├── sdd-cycle.ts         # Orchestration cycle SDD
│   │   │   ├── intent-service.ts
│   │   │   ├── spec-service.ts
│   │   │   ├── gate-service.ts      # SQS scoring + validation
│   │   │   ├── execution-service.ts # Lancement + monitoring agents
│   │   │   ├── drift-service.ts     # Drift detection
│   │   │   ├── agent-orchestrator.ts # Suggestion + assignation agents
│   │   │   ├── agent-instructions.ts # Composition payload contexte
│   │   │   ├── budget-service.ts    # Tracking coûts + enforcement
│   │   │   ├── governance-service.ts # Audits AI-ACT/RGPD/RGAA/RGESN/Context
│   │   │   ├── ritual-service.ts    # Planification + données rituels
│   │   │   ├── metrics-service.ts   # Calcul DORA + Flow
│   │   │   ├── health-service.ts    # Signaux santé
│   │   │   ├── git-service.ts       # Intégration Git
│   │   │   ├── ci-service.ts        # Intégration CI/CD
│   │   │   ├── activity-service.ts  # Audit log
│   │   │   ├── onboarding-service.ts # Parcours onboarding éducatif
│   │   │   ├── telemetry-service.ts # Télémétrie opt-in anonymisée
│   │   │   ├── context-resolver.ts  # Résolution cascade Context Mesh
│   │   │   ├── context-sync.ts      # Context Sync Loop (détection, classification, diff)
│   │   │   └── context-import.ts    # Importeurs Notion/Confluence/GDrive
│   │   ├── adapters/
│   │   │   ├── adapter-interface.ts # Interface commune
│   │   │   ├── claude-local.ts
│   │   │   ├── codex-local.ts
│   │   │   ├── cursor-local.ts
│   │   │   ├── gemini-local.ts
│   │   │   ├── process.ts
│   │   │   └── http.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── project-scope.ts     # Isolation multi-projet
│   │   │   ├── responsibility-guard.ts # Vérification responsabilité AIAD
│   │   │   ├── context-access.ts    # Vérification accès contextuel (RBAC)
│   │   │   └── activity-logger.ts
│   │   └── realtime/
│   │       ├── websocket.ts
│   │       └── events.ts
│   └── package.json
│
├── ui/                              # Interface React
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── ProjectDetail.tsx
│   │   │   ├── IntentList.tsx
│   │   │   ├── IntentForm.tsx       # Formulaire guidé 5 étapes
│   │   │   ├── SpecEditor.tsx       # Editeur SPEC structuré
│   │   │   ├── ExecutionGate.tsx    # Checklist SQS interactive
│   │   │   ├── ExecutionMonitor.tsx # Monitoring agent temps réel
│   │   │   ├── DriftReport.tsx
│   │   │   ├── IssueBoard.tsx       # Kanban
│   │   │   ├── IssueDetail.tsx
│   │   │   ├── AgentList.tsx
│   │   │   ├── AgentDetail.tsx
│   │   │   ├── AgentConfig.tsx
│   │   │   ├── RitualDashboard.tsx
│   │   │   ├── StandupWorkflow.tsx
│   │   │   ├── MetricsDashboard.tsx # DORA + Flow
│   │   │   ├── GovernanceAudit.tsx
│   │   │   ├── HealthCheck.tsx
│   │   │   ├── ADRList.tsx
│   │   │   ├── CostAnalytics.tsx
│   │   │   ├── ActivityLog.tsx
│   │   │   ├── OnboardingWizard.tsx # Parcours guidé d'adoption
│   │   │   ├── ContextMeshExplorer.tsx  # Visualisation arborescence contexte
│   │   │   ├── ContextEditor.tsx        # Editeur guidé de CONTEXT.md
│   │   │   ├── ContextSyncReview.tsx    # Validation propositions Context Sync
│   │   │   ├── ContextHealth.tsx        # Dashboard santé contexte
│   │   │   └── Settings.tsx
│   │   ├── components/
│   │   │   ├── sdd/                 # Composants cycle SDD
│   │   │   ├── agents/              # Composants agents
│   │   │   ├── governance/          # Composants gouvernance
│   │   │   ├── metrics/             # Graphiques métriques
│   │   │   ├── rituals/             # Composants rituels
│   │   │   ├── context/             # Composants Context Mesh
│   │   │   └── shared/              # Composants partagés
│   │   ├── hooks/
│   │   ├── api/                     # Clients API typés
│   │   └── context/
│   └── package.json
│
├── packages/
│   ├── db/                          # Schema Drizzle + migrations
│   │   ├── src/schema/
│   │   └── src/migrations/
│   ├── shared/                      # Types + validators partagés
│   │   ├── src/types/
│   │   └── src/validators/
│   └── adapters/                    # Implémentations adapters
│       ├── claude-local/
│       ├── codex-local/
│       ├── cursor-local/
│       ├── gemini-local/
│       ├── process/
│       └── http/
│
├── cli/                             # CLI native — parité avec l'UI
│   └── src/commands/
│       ├── sdd/                     # Toutes les commandes /sdd-*
│       ├── aiad/                    # Toutes les commandes /aiad-*
│       └── context/                 # Commandes Context Mesh (sync, audit, edit)
│
├── docker-compose.yml               # Déploiement self-hosted
├── Dockerfile
└── doc/
    ├── SPEC.md
    ├── DEVELOPING.md
    └── DEPLOYMENT.md
```

## 5. Conventions de Code

### Nommage
- **Variables / fonctions** : camelCase (`intentStatement`, `calculateSqsScore`)
- **Types / interfaces** : PascalCase (`IntentStatement`, `SpecStatus`)
- **Fichiers** : kebab-case (`intent-service.ts`, `gate-service.ts`)
- **Base de données** : snake_case (`intent_statements`, `sqs_score`, `created_at`)
- **Routes API** : kebab-case pluriel (`/api/v1/intent-statements`, `/api/v1/specs`)

### Formatting
- **Indentation** : 2 espaces
- **Line length** : max 120 chars
- **Semicolons** : non (prettier)
- **Quotes** : simples

### Imports
```typescript
// 1. Node built-ins
import { readFile } from 'node:fs/promises'

// 2. Dépendances externes
import express from 'express'
import { eq } from 'drizzle-orm'

// 3. Packages internes (@aiad-studio/*)
import { IntentStatement } from '@aiad-studio/shared'
import { db } from '@aiad-studio/db'

// 4. Imports relatifs
import { validateSqs } from '../services/gate-service'
```

## 6. Patterns Utilisés

### Adapter Pattern (Agents IA)

Chaque agent IA est interfacé via un adapter commun. Ajout d'un nouvel agent = implémentation de l'interface, aucun changement core.

```typescript
interface AgentAdapter {
  readonly type: string
  capabilities: AgentCapability[]

  execute(input: ExecutionInput): AsyncGenerator<HeartbeatEvent>
  estimateCost(input: ExecutionInput): Promise<CostEstimate>
  healthCheck(): Promise<HealthStatus>
}
```

### Atomic Checkout (Issues)

Une tâche ne peut être travaillée que par un seul acteur à la fois. Le verrouillage est transactionnel via `execution_locked_at`.

```typescript
// Transition in_progress = verrouillage atomique
await db.transaction(async (tx) => {
  const issue = await tx.query.issues.findFirst({
    where: and(eq(issues.id, issueId), isNull(issues.executionLockedAt))
  })
  if (!issue) throw new ConflictError('Issue already locked')

  await tx.update(issues)
    .set({ status: 'in_progress', executionLockedAt: new Date() })
    .where(eq(issues.id, issueId))
})
```

### Context Mesh — Résolution en Cascade

Le contexte d'une session agent est résolu par héritage : `personal -> project -> team -> organization`. Chaque scope hérite de son parent, avec override possible.

```typescript
async function resolveContext(projectId: string, userId: string): Promise<ResolvedContext> {
  const scopes = await db.query.contextScopes.findMany({
    where: inArray(contextScopes.type, ['organization', 'team', 'project', 'personal']),
    orderBy: [asc(contextScopes.type)] // org first, personal last
  })

  return scopes.reduce((merged, scope) => ({
    ...merged,
    ...parseContextMd(scope.content),
    _tokenWeight: merged._tokenWeight + scope.tokenWeight,
    _sources: [...merged._sources, { type: scope.type, version: scope.version }]
  }), emptyContext())
}
```

### Service Layer

Toute la logique métier vit dans les services (`services/*.ts`). Les routes sont des contrôleurs fins qui valident l'input, appellent le service, et formatent l'output. Pas de logique métier dans les routes.

## 7. Gestion des Erreurs

```typescript
// Erreurs métier typées
class AiadError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400,
    public readonly details?: Record<string, unknown>
  ) {
    super(message)
  }
}

class GateRejectedError extends AiadError {
  constructor(sqsScore: number, feedback: string) {
    super(
      `Execution Gate rejected: SQS ${sqsScore}/5 < 4/5`,
      'GATE_REJECTED',
      422,
      { sqsScore, feedback }
    )
  }
}

class DriftDetectedError extends AiadError {
  constructor(specId: string, diffs: DriftDiff[]) {
    super(
      `Drift detected on SPEC ${specId}`,
      'DRIFT_DETECTED',
      409,
      { specId, diffs }
    )
  }
}

// Middleware global Express
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AiadError) {
    activityLogger.log(req, 'error', err.code, err.details)
    return res.status(err.statusCode).json({
      error: err.code,
      message: err.message,
      details: err.details
    })
  }
  // Erreur non prévue — log + 500 générique
  logger.error('Unhandled error', err)
  res.status(500).json({ error: 'INTERNAL_ERROR', message: 'An unexpected error occurred' })
})
```

## 8. Architecture Données

### Entités Principales

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
└──────┬───────┘     └──────────────┘     │ acceptance   │
       │                                   │ sqs_score    │
       │                                   │ status       │
       │             ┌──────────────┐     │ context_est  │
       ├────────────<│  Issue       │<────┘              │
       │             │ title        │     └──────┬───────┘
       │             │ status       │            │
       │             │ priority     │     ┌──────┴───────┐
       │             │ assignee     │     │  Execution   │
       │             │ spec_id      │     │  Gate        │
       │             │ locked_at    │     │ sqs_scores   │
       │             └──────────────┘     │ decision     │
       │                                   └──────────────┘
       │             ┌──────────────┐
       ├────────────<│  Agent       │     ┌──────────────┐
       │             │ adapter_type │────<│ Heartbeat    │
       │             │ capabilities │     │ Run          │
       │             │ budget       │     │ tokens_in/out│
       │             │ status       │     │ cost_cents   │
       │             └──────────────┘     └──────────────┘
       │
       │             ┌──────────────┐     ┌──────────────┐
       ├────────────<│ Membership   │     │ Context      │
       │             │ user_id      │     │ Scope        │
       │             │ responsibility│    │ type (4)     │
       │             └──────────────┘     │ parent_id    │
       │                                   │ access_policy│
       │             ┌──────────────┐     │ token_weight │
       ├────────────<│ Ritual       │     └──────────────┘
       │             │ type         │
       │             │ cadence      │     ┌──────────────┐
       │             └──────────────┘     │ Context Sync │
       │                                   │ Event        │
       │             ┌──────────────┐     │ proposals    │
       └────────────<│ ADR          │     │ accepted     │
                     │ title        │     │ rejected     │
                     │ decision     │     └──────────────┘
                     └──────────────┘
```

### Tables Clés

| Entité | Champs clés | Notes |
|--------|-------------|-------|
| `projects` | id, name, repository_url, repository_provider, context_scope_id | Unité organisationnelle principale |
| `intent_statements` | id, project_id, author_id, pourquoi/pour_qui/objectif/contraintes/critere_drift, status | Artefact de premier ordre. Author = humain uniquement |
| `specs` | id, intent_id, acceptance_criteria (JSONB), governance_applicable (JSONB), context_budget_estimate, sqs_score, status | Liée à un Intent. Status: draft -> review -> ready -> in-progress -> validation -> done |
| `execution_gates` | id, spec_id, sqs_clarity/completude/testabilite/realisabilite/alignement, decision | SQS >= 4/5 requis pour approval |
| `issues` | id, spec_id (nullable), assignee_type (user\|agent), execution_locked_at | Atomic checkout via locked_at |
| `agents` | id, adapter_type, runtime_config (JSONB chiffré), budget_monthly_cents | Multi-adapter, budget enforcement |
| `heartbeat_runs` | id, agent_id, spec_id, tokens in/out/inherited, cost_cents, session_id | Traçabilité complète par run |
| `context_scopes` | id, type (org\|team\|project\|personal), parent_id, token_weight, access_policy | Héritage hiérarchique, RBAC contextuel |
| `context_sync_events` | id, scope_id, session_id, proposals (JSONB), accepted/rejected_count | Context Sync Loop — validation humaine |
| `dora_metrics` | project_id, deploy_freq, lead_time, failure_rate, mttr | Calculé automatiquement via Git/CI |
| `flow_metrics` | project_id, cycle_time, lead_time, throughput, wip, efficiency | Calculé automatiquement |

## 9. Sécurité

- **Authentification** : better-auth (email/password + SSO OIDC/SAML + MFA TOTP)
- **Autorisation** : Responsabilité AIAD par projet via `responsibility-guard.ts` + Contextual RBAC via `context-access.ts`
- **Secrets** : `runtime_config` agents chiffré en base, `personal_context` chiffré AES-256
- **Input validation** : Zod validators dans `@aiad-studio/shared`, appliqués côté route
- **Audit trail** : `activity_log` immuable de toutes les actions, `context_access_log` pour les accès contexte

## 10. Performance (Budgets)

| Métrique | Budget | Monitoring |
|----------|--------|-----------|
| **Response time p95** | < 200ms (hors appels agents) | Métriques Express intégrées |
| **WebSocket latency** | < 100ms (heartbeat agent -> UI) | Monitoring realtime |
| **Context resolution** | < 50ms (résolution cascade 4 scopes) | `context-resolver.ts` metrics |
| **Error rate** | < 0.1% | Activity log + alertes |
| **Build time** | < 60s (pnpm build all packages) | CI pipeline |
| **Docker startup** | < 30s (docker-compose up -> ready) | Health check endpoint |

## 11. ADRs (Architecture Decision Records)

> Les ADRs sont stockés dans `.aiad/adrs/` au format :
> `ADR-NNN-[titre].md`

### ADR-001 : Stack Express + React vs Next.js

**Date** : 2026-04-13 | **Statut** : Accepté

**Contexte**
AIAD Studio est une application self-hosted pour grandes entreprises/ESN. Deux options de stack ont été évaluées : Next.js (SSR, App Router) et Express + React séparé (pattern Paperclip).

**Décision**
Express 5 (backend) + React 18 + Vite (frontend), en monorepo pnpm.

**Alternatives Considérées**

| Alternative | Pour | Contre | Rejetée car |
|-------------|------|--------|-------------|
| Next.js (SSR, App Router) | SSR natif, DX moderne, routing intégré | Couplage front/back, complexité SSR pour self-hosted, moins de contrôle sur l'API | Séparation front/back nécessaire pour CLI native et API-first. Self-hosted plus simple avec Express standalone |

**Conséquences**
- La CLI et l'UI consomment la même API REST
- Le déploiement est plus flexible (front et back peuvent scaler indépendamment)
- Pas de SSR — le frontend est un SPA servi statiquement

---

### ADR-002 : Single-assignee (Atomic Execution) vs Multi-assignee

**Date** : 2026-04-13 | **Statut** : Accepté

**Contexte**
Une tâche (issue) peut-elle être assignée à plusieurs agents/humains simultanément ?

**Décision**
Single-assignee avec verrouillage transactionnel (`execution_locked_at`).

**Alternatives Considérées**

| Alternative | Pour | Contre | Rejetée car |
|-------------|------|--------|-------------|
| Multi-assignee | Parallélisation, flexibilité | Race conditions, responsabilité floue, merge conflicts | Contradictoire avec le principe Atomic Execution. Responsabilité claire = intention traceable |

**Conséquences**
- Elimination des race conditions d'exécution
- Responsabilité claire sur chaque tâche
- Le parallélisme se fait par décomposition (split de SPECs/issues), pas par multi-assignation

---

### ADR-003 : PostgreSQL vs SQLite vs MongoDB

**Date** : 2026-04-13 | **Statut** : Accepté

**Contexte**
Choix de la base de données principale pour un outil self-hosted entreprise.

**Décision**
PostgreSQL 16, avec fallback embedded-postgres pour l'évaluation.

**Alternatives Considérées**

| Alternative | Pour | Contre | Rejetée car |
|-------------|------|--------|-------------|
| SQLite | Zéro config, embarqué | Pas de concurrence, pas de JSONB riche, limites scale | Ne supporte pas le checkout atomique transactionnel ni la concurrence multi-agents |
| MongoDB | JSONB natif, flexible | Pas d'ACID strict, overhead opérationnel, moins standard en entreprise | Les transactions ACID sont critiques pour l'atomic checkout et la traçabilité |

**Conséquences**
- JSONB natif pour les champs structurés (acceptance_criteria, checklist, proposals...)
- embedded-postgres abaisse la friction d'évaluation
- Standard entreprise — les équipes ops connaissent PostgreSQL

---

### ADR-004 : Context Mesh versionné dans Git vs Wiki intégré

**Date** : 2026-04-13 | **Statut** : Accepté

**Contexte**
Le Patrimoine Intentionnel (contexte partagé) doit être stocké quelque part. Un wiki intégré à l'app serait plus accessible ; des fichiers Markdown versionnés dans Git seraient plus rigoureux.

**Décision**
Fichiers CONTEXT.md versionnés dans Git, avec éditeur guidé dans l'UI.

**Alternatives Considérées**

| Alternative | Pour | Contre | Rejetée car |
|-------------|------|--------|-------------|
| Wiki intégré (type Notion) | UX familière, édition riche | Pas de versioning natif, pas de diff, pas de rollback, drift inévitable | Le contexte est du code — il mérite le même traitement : versioning, diff, revue, rollback |

**Conséquences**
- Le contexte suit le même workflow que le code (branches, PRs, reviews)
- L'éditeur guidé dans l'UI abstrait la complexité Git pour les non-tech (Julie)
- Les importeurs (Notion, Confluence, GDrive) permettent d'initialiser le contexte depuis les sources existantes

---

### ADR-005 : Propagation de contexte humaine vs automatique

**Date** : 2026-04-13 | **Statut** : Accepté

**Contexte**
Après une session agent, le Context Sync Loop détecte des mises à jour potentielles du contexte partagé. Faut-il les appliquer automatiquement ou exiger une validation humaine ?

**Décision**
Validation humaine obligatoire (Context Sync Loop : l'agent propose, l'humain dispose).

**Alternatives Considérées**

| Alternative | Pour | Contre | Rejetée car |
|-------------|------|--------|-------------|
| Sync automatique post-session | Zéro friction, contexte toujours à jour | Dérive non contrôlée, perte de l'intention humaine sur le contexte | Contradictoire avec la valeur "Primauté de l'Intention Humaine". Le contexte partagé est un actif stratégique — pas un sous-produit automatique |

**Conséquences**
- Chaque mise à jour de contexte est un acte conscient
- Le PE valide les propositions via `ContextSyncReview.tsx`
- Le taux d'acceptation/rejet est une métrique de santé du système

---

### ADR-006 : Gouvernance obligatoire vs optionnelle au Gate

**Date** : 2026-04-13 | **Statut** : Accepté

**Contexte**
Les checklists de gouvernance Tier 1 (AI-ACT, RGPD, RGAA, RGESN) doivent-elles être bloquantes au Gate ?

**Décision**
Obligatoire — la gouvernance Tier 1 a droit de veto.

**Alternatives Considérées**

| Alternative | Pour | Contre | Rejetée car |
|-------------|------|--------|-------------|
| Checklists bypassables | Moins de friction, adoption plus rapide | Conformité optionnelle = conformité absente en pratique | Un bypass serait une trahison du framework. La gouvernance Tier 1 est une valeur fondatrice, pas une feature |

**Conséquences**
- Le Gate bloque si les critères gouvernance ne sont pas satisfaits
- Cela force l'éducation à la conformité dès les premiers cycles
- Les équipes qui trouvent ça lourd sont le public cible de l'accompagnement (friction intentionnelle)

---

### ADR-007 : CLI native vs CLI wrapper

**Date** : 2026-04-13 | **Statut** : Accepté

**Contexte**
La CLI doit-elle être un citoyen de première classe (parité fonctionnelle avec l'UI) ou un wrapper simplifié de l'API ?

**Décision**
CLI native avec parité complète. Toute fonctionnalité UI a son pendant CLI.

**Alternatives Considérées**

| Alternative | Pour | Contre | Rejetée car |
|-------------|------|--------|-------------|
| CLI wrapper (sous-ensemble de l'API) | Plus rapide à développer, maintenance réduite | Power users (PE, AE) limités, frein à l'adoption dev | Les PE et AE vivent dans le terminal. Une CLI secondaire trahirait le principe API-first |

**Conséquences**
- L'architecture API-first rend la parité naturelle
- Le package `cli/` est un consumer de l'API au même titre que `ui/`
- La CLI peut devenir un point d'intégration pour les workflows automatisés
