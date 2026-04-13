import { pgTable, pgEnum, uuid, text, integer, jsonb, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users.js'
import { projects } from './projects.js'

export const intentStatus = pgEnum('intent_status', [
  'draft',
  'active',
  'done',
  'archived',
])

export const specStatus = pgEnum('spec_status', [
  'draft',
  'review',
  'ready',
  'in_progress',
  'validation',
  'done',
  'archived',
])

export const gateDecision = pgEnum('gate_decision', ['approved', 'rejected'])

export const intentStatements = pgTable('intent_statements', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  // Numéro auto-incrémenté par projet — géré applicativement
  number: integer('number').notNull(),
  slug: text('slug').notNull(),
  // author_id = humain uniquement — jamais un agent (contrainte métier, pas DB)
  authorId: uuid('author_id')
    .notNull()
    .references(() => users.id),
  pourquoiMaintenant: text('pourquoi_maintenant').notNull(),
  pourQui: text('pour_qui').notNull(),
  objectif: text('objectif').notNull(),
  contraintes: text('contraintes').notNull(),
  critereDeDrift: text('critere_de_drift').notNull(),
  status: intentStatus('status').notNull().default('draft'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  lastActivityAt: timestamp('last_activity_at', { withTimezone: true }),
})

export const specs = pgTable('specs', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  intentId: uuid('intent_id')
    .notNull()
    .references(() => intentStatements.id, { onDelete: 'cascade' }),
  number: integer('number').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  inputs: text('inputs'),
  processing: text('processing'),
  outputs: text('outputs'),
  edgeCases: text('edge_cases'),
  acceptanceCriteria: jsonb('acceptance_criteria').$type<string[]>(),
  dependencies: jsonb('dependencies').$type<string[]>(),
  // { ai_act: true, rgpd: false, rgaa: true, rgesn: true }
  governanceApplicable: jsonb('governance_applicable').$type<Record<string, boolean>>(),
  // Estimation en tokens pour le Context Budget
  contextBudgetEstimate: integer('context_budget_estimate'),
  sqsScore: integer('sqs_score'),
  status: specStatus('status').notNull().default('draft'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const executionGates = pgTable('execution_gates', {
  id: uuid('id').primaryKey().defaultRandom(),
  specId: uuid('spec_id')
    .notNull()
    .references(() => specs.id, { onDelete: 'cascade' }),
  // Scores SQS individuels (0 ou 1 par critère)
  sqsClarity: integer('sqs_clarity').notNull(),
  sqsCompletude: integer('sqs_completude').notNull(),
  sqsTestabilite: integer('sqs_testabilite').notNull(),
  sqsRealisabilite: integer('sqs_realisabilite').notNull(),
  sqsAlignement: integer('sqs_alignement').notNull(),
  // Test de l'Étranger — non-scorable, texte libre
  sqsTestEtrangerNotes: text('sqs_test_etranger_notes'),
  // Score total calculé (0–5)
  sqsTotal: integer('sqs_total').notNull(),
  // Checklist détaillée de gouvernance : { "ai_act_checked": true, ... }
  checklist: jsonb('checklist').$type<Record<string, boolean>>(),
  decision: gateDecision('decision').notNull(),
  // Liste des participants (user IDs ou noms)
  participants: jsonb('participants').$type<string[]>(),
  feedback: text('feedback'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export type IntentStatement = typeof intentStatements.$inferSelect
export type NewIntentStatement = typeof intentStatements.$inferInsert
export type Spec = typeof specs.$inferSelect
export type NewSpec = typeof specs.$inferInsert
export type ExecutionGate = typeof executionGates.$inferSelect
export type NewExecutionGate = typeof executionGates.$inferInsert
