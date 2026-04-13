import { pgTable, pgEnum, uuid, text, integer, jsonb, timestamp } from 'drizzle-orm/pg-core'
import { projects } from './projects.js'
import { users } from './users.js'

export const governanceDomain = pgEnum('governance_domain', [
  'ai_act',
  'rgpd',
  'rgaa',
  'rgesn',
  'context',
])

export const ritualType = pgEnum('ritual_type', [
  'standup',
  'drift_check',
  'tech_review',
  'demo',
  'intention',
  'sync_strat',
  'retro',
  'gouvernance',
  'context_review',
])

export const ritualCadence = pgEnum('ritual_cadence', [
  'daily',
  'weekly',
  'biweekly',
  'monthly',
  'quarterly',
])

export const ritualStatus = pgEnum('ritual_status', [
  'scheduled',
  'in_progress',
  'completed',
  'skipped',
])

export const adrStatus = pgEnum('adr_status', [
  'proposed',
  'accepted',
  'deprecated',
  'superseded',
])

export const governanceAudits = pgTable('governance_audits', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  domain: governanceDomain('domain').notNull(),
  score: integer('score').notNull(),
  // Checklist détaillée : [{ label: "...", passed: true, notes: "..." }]
  items: jsonb('items').$type<Array<{ label: string; passed: boolean; notes?: string }>>(),
  auditorId: uuid('auditor_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const rituals = pgTable('rituals', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  type: ritualType('type').notNull(),
  cadence: ritualCadence('cadence').notNull(),
  nextScheduled: timestamp('next_scheduled', { withTimezone: true }),
  // Liste des participants (user IDs)
  participants: jsonb('participants').$type<string[]>(),
  status: ritualStatus('status').notNull().default('scheduled'),
  // Sortie structurée du rituel (compte-rendu, décisions, actions)
  output: jsonb('output').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const adrs = pgTable('adrs', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  number: integer('number').notNull(),
  title: text('title').notNull(),
  status: adrStatus('status').notNull().default('proposed'),
  context: text('context').notNull(),
  decision: text('decision').notNull(),
  consequences: text('consequences'),
  authorId: uuid('author_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type GovernanceAudit = typeof governanceAudits.$inferSelect
export type NewGovernanceAudit = typeof governanceAudits.$inferInsert
export type Ritual = typeof rituals.$inferSelect
export type NewRitual = typeof rituals.$inferInsert
export type Adr = typeof adrs.$inferSelect
export type NewAdr = typeof adrs.$inferInsert
