import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  jsonb,
  timestamp,
  primaryKey,
} from 'drizzle-orm/pg-core'
import { projects } from './projects.js'
import { specs, intentStatements } from './sdd-cycle.js'
import { issues } from './issues.js'

export const agentStatus = pgEnum('agent_status', ['active', 'paused', 'disabled'])

export const heartbeatStatus = pgEnum('heartbeat_status', [
  'queued',
  'in_progress',
  'completed',
  'failed',
])

export const budgetAction = pgEnum('budget_action', ['alert', 'pause'])

export const agents = pgTable('agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  adapterType: text('adapter_type').notNull(),
  // chiffré applicativement — configuration publique de l'adapter
  adapterConfig: jsonb('adapter_config').$type<Record<string, unknown>>(),
  // chiffré applicativement (AES-256) — clés API, secrets
  runtimeConfig: jsonb('runtime_config').$type<Record<string, unknown>>(),
  capabilities: jsonb('capabilities').$type<string[]>(),
  budgetMonthlyCents: integer('budget_monthly_cents').notNull().default(0),
  spentMonthlyCents: integer('spent_monthly_cents').notNull().default(0),
  status: agentStatus('status').notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// Table de liaison agent ↔ projet — PK composite, pas de colonne id
export const agentProjectAccess = pgTable(
  'agent_project_access',
  {
    agentId: uuid('agent_id')
      .notNull()
      .references(() => agents.id, { onDelete: 'cascade' }),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.agentId, table.projectId] })],
)

export const agentSessions = pgTable('agent_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  agentId: uuid('agent_id')
    .notNull()
    .references(() => agents.id, { onDelete: 'cascade' }),
  // nullable : une session peut démarrer avant d'être liée à une SPEC
  specId: uuid('spec_id').references(() => specs.id),
  adapterType: text('adapter_type').notNull(),
  // Données de session compactées (messages, fichiers ouverts, état)
  sessionData: jsonb('session_data').$type<Record<string, unknown>>(),
  tokenCount: integer('token_count').notNull().default(0),
  inheritedContextTokens: integer('inherited_context_tokens').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }).defaultNow().notNull(),
})

export const heartbeatRuns = pgTable('heartbeat_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  agentId: uuid('agent_id')
    .notNull()
    .references(() => agents.id, { onDelete: 'cascade' }),
  specId: uuid('spec_id').references(() => specs.id),
  issueId: uuid('issue_id').references(() => issues.id),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id),
  sessionId: uuid('session_id').references(() => agentSessions.id),
  status: heartbeatStatus('status').notNull().default('queued'),
  inputTokens: integer('input_tokens').notNull().default(0),
  cachedTokens: integer('cached_tokens').notNull().default(0),
  outputTokens: integer('output_tokens').notNull().default(0),
  inheritedContextTokens: integer('inherited_context_tokens').notNull().default(0),
  costCents: integer('cost_cents').notNull().default(0),
  provider: text('provider'),
  model: text('model'),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  // Chemin vers les logs de la session (fichier ou S3 path)
  logsPath: text('logs_path'),
})

export const costEvents = pgTable('cost_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  agentId: uuid('agent_id')
    .notNull()
    .references(() => agents.id, { onDelete: 'cascade' }),
  specId: uuid('spec_id').references(() => specs.id),
  intentId: uuid('intent_id').references(() => intentStatements.id),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id),
  provider: text('provider').notNull(),
  model: text('model').notNull(),
  inputTokens: integer('input_tokens').notNull().default(0),
  cachedTokens: integer('cached_tokens').notNull().default(0),
  outputTokens: integer('output_tokens').notNull().default(0),
  inheritedContextTokens: integer('inherited_context_tokens').notNull().default(0),
  costCents: integer('cost_cents').notNull().default(0),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
})

export const budgetIncidents = pgTable('budget_incidents', {
  id: uuid('id').primaryKey().defaultRandom(),
  agentId: uuid('agent_id')
    .notNull()
    .references(() => agents.id, { onDelete: 'cascade' }),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id),
  thresholdPercent: integer('threshold_percent').notNull(),
  budgetCents: integer('budget_cents').notNull(),
  spentCents: integer('spent_cents').notNull(),
  actionTaken: budgetAction('action_taken').notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
})

export type Agent = typeof agents.$inferSelect
export type NewAgent = typeof agents.$inferInsert
export type AgentProjectAccess = typeof agentProjectAccess.$inferSelect
export type NewAgentProjectAccess = typeof agentProjectAccess.$inferInsert
export type AgentSession = typeof agentSessions.$inferSelect
export type NewAgentSession = typeof agentSessions.$inferInsert
export type HeartbeatRun = typeof heartbeatRuns.$inferSelect
export type NewHeartbeatRun = typeof heartbeatRuns.$inferInsert
export type CostEvent = typeof costEvents.$inferSelect
export type NewCostEvent = typeof costEvents.$inferInsert
export type BudgetIncident = typeof budgetIncidents.$inferSelect
export type NewBudgetIncident = typeof budgetIncidents.$inferInsert
