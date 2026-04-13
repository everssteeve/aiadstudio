import { pgTable, pgEnum, uuid, boolean, jsonb, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users.js'

export const onboardingStep = pgEnum('onboarding_step', [
  'welcome',
  'first_project',
  'first_context',
  'first_intent',
  'first_spec',
  'first_gate',
  'first_cycle',
  'exploration',
])

export const onboardingProgress = pgTable('onboarding_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  step: onboardingStep('step').notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }).defaultNow().notNull(),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
})

export const telemetryConfig = pgTable('telemetry_config', {
  id: uuid('id').primaryKey().defaultRandom(),
  enabled: boolean('enabled').notNull().default(false),
  // UUID de l'instance — singleton, une seule ligne attendue
  instanceId: uuid('instance_id').notNull().defaultRandom(),
  lastSentAt: timestamp('last_sent_at', { withTimezone: true }),
  // consentement donné par un utilisateur humain
  consentGivenBy: uuid('consent_given_by').references(() => users.id),
  consentGivenAt: timestamp('consent_given_at', { withTimezone: true }),
})

export type OnboardingProgress = typeof onboardingProgress.$inferSelect
export type NewOnboardingProgress = typeof onboardingProgress.$inferInsert
export type TelemetryConfig = typeof telemetryConfig.$inferSelect
export type NewTelemetryConfig = typeof telemetryConfig.$inferInsert
