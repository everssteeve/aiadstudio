import { pgTable, pgEnum, uuid, text, jsonb, timestamp } from 'drizzle-orm/pg-core'
import { projects } from './projects.js'

export const actorType = pgEnum('actor_type', ['user', 'agent', 'system'])

export const activityLog = pgTable('activity_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  // nullable : certaines actions sont globales à l'instance (ex: telemetry, onboarding)
  projectId: uuid('project_id').references(() => projects.id),
  actorType: actorType('actor_type').notNull(),
  actorId: uuid('actor_id').notNull(),
  // Verbe d'action : "intent.created", "spec.gate_passed", "agent.run_completed"...
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: uuid('entity_id').notNull(),
  // Métadonnées libres : diff, scores, contexte supplémentaire
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
})

export type ActivityLog = typeof activityLog.$inferSelect
export type NewActivityLog = typeof activityLog.$inferInsert
