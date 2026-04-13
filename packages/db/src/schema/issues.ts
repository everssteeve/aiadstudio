import { pgTable, pgEnum, uuid, text, integer, jsonb, timestamp } from 'drizzle-orm/pg-core'
import type { AnyPgColumn } from 'drizzle-orm/pg-core'
import { projects } from './projects.js'
import { specs } from './sdd-cycle.js'

export const issueStatus = pgEnum('issue_status', [
  'backlog',
  'todo',
  'in_progress',
  'in_review',
  'done',
  'blocked',
  'cancelled',
])

export const issuePriority = pgEnum('issue_priority', [
  'critical',
  'high',
  'medium',
  'low',
])

export const assigneeType = pgEnum('assignee_type', ['user', 'agent'])

export const issues = pgTable('issues', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  // nullable : une issue peut exister sans SPEC parente
  specId: uuid('spec_id').references(() => specs.id),
  // Auto-référence nullable — sous-tâche d'une issue parente
  parentId: uuid('parent_id').references((): AnyPgColumn => issues.id),
  title: text('title').notNull(),
  description: text('description'),
  status: issueStatus('status').notNull().default('backlog'),
  priority: issuePriority('priority').notNull().default('medium'),
  assigneeType: assigneeType('assignee_type'),
  assigneeId: uuid('assignee_id'),
  // Atomic checkout — null = libre, présent = verrouillé par un acteur
  executionLockedAt: timestamp('execution_locked_at', { withTimezone: true }),
  labels: jsonb('labels').$type<string[]>(),
  // Estimation en heures
  estimate: integer('estimate'),
  dueDate: timestamp('due_date', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type Issue = typeof issues.$inferSelect
export type NewIssue = typeof issues.$inferInsert
