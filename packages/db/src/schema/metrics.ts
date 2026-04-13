import { pgTable, uuid, integer, doublePrecision, timestamp } from 'drizzle-orm/pg-core'
import { projects } from './projects.js'

export const doraMetrics = pgTable('dora_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  periodStart: timestamp('period_start', { withTimezone: true }).notNull(),
  periodEnd: timestamp('period_end', { withTimezone: true }).notNull(),
  // Nombre de déploiements par jour (calculé automatiquement via Git/CI)
  deploymentFrequency: doublePrecision('deployment_frequency'),
  // Temps moyen entre commit et déploiement en secondes
  leadTimeSeconds: integer('lead_time_seconds'),
  // Taux d'échec des changements (0.0–1.0)
  changeFailureRate: doublePrecision('change_failure_rate'),
  // Mean Time To Restore en secondes
  mttrSeconds: integer('mttr_seconds'),
  calculatedAt: timestamp('calculated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const flowMetrics = pgTable('flow_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  periodStart: timestamp('period_start', { withTimezone: true }).notNull(),
  periodEnd: timestamp('period_end', { withTimezone: true }).notNull(),
  // Temps moyen entre début et fin d'une tâche en heures
  cycleTimeHours: doublePrecision('cycle_time_hours'),
  // Temps total de l'idée au déploiement en heures
  leadTimeHours: doublePrecision('lead_time_hours'),
  // Nombre d'items livrés sur la période
  throughput: integer('throughput'),
  // Work In Progress (nombre de tâches en cours)
  wip: integer('wip'),
  // Ratio temps actif / temps total (0.0–1.0)
  flowEfficiency: doublePrecision('flow_efficiency'),
  calculatedAt: timestamp('calculated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type DoraMetric = typeof doraMetrics.$inferSelect
export type NewDoraMetric = typeof doraMetrics.$inferInsert
export type FlowMetric = typeof flowMetrics.$inferSelect
export type NewFlowMetric = typeof flowMetrics.$inferInsert
