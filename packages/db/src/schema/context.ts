import { pgTable, pgEnum, uuid, text, integer, jsonb, timestamp } from 'drizzle-orm/pg-core'
import type { AnyPgColumn } from 'drizzle-orm/pg-core'
import { users } from './users.js'

export const contextScopeType = pgEnum('context_scope_type', [
  'organization',
  'team',
  'project',
  'personal',
])

export const contextAccessPolicy = pgEnum('context_access_policy', [
  'public_org',
  'restricted_team',
  'project_only',
  'personal',
])

export const contextAccessorType = pgEnum('context_accessor_type', ['user', 'agent'])

export const contextAccessAction = pgEnum('context_access_action', ['read', 'write'])

export const contextScopes = pgTable('context_scopes', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: contextScopeType('type').notNull(),
  // Auto-référence nullable : les scopes de type organization n'ont pas de parent
  parentId: uuid('parent_id').references((): AnyPgColumn => contextScopes.id),
  name: text('name').notNull(),
  // Chemin dans le repo ou identifiant en base
  path: text('path'),
  // Hash du contenu pour le versioning
  version: text('version'),
  // Poids estimé en tokens pour le Context Budget
  tokenWeight: integer('token_weight').notNull().default(0),
  accessPolicy: contextAccessPolicy('access_policy').notNull(),
  // Context Steward — responsable du scope organization
  ownerId: uuid('owner_id').references(() => users.id),
  lastModifiedAt: timestamp('last_modified_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const contextSyncEvents = pgTable('context_sync_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  scopeId: uuid('scope_id')
    .notNull()
    .references(() => contextScopes.id, { onDelete: 'cascade' }),
  // FK vers agent_sessions — définie sans import direct pour éviter la dépendance circulaire
  // contextScopes ← projects ← sdd-cycle ← agents ← contextScopes (cycle)
  // La contrainte FK est documentée ici ; l'intégrité est assurée au niveau applicatif
  sessionId: uuid('session_id'),
  projectId: uuid('project_id').notNull(),
  triggeredBy: uuid('triggered_by')
    .notNull()
    .references(() => users.id),
  // Liste de propositions avec diff : [{ path, old, new, classification }]
  proposals: jsonb('proposals').$type<Array<Record<string, unknown>>>(),
  acceptedCount: integer('accepted_count').notNull().default(0),
  rejectedCount: integer('rejected_count').notNull().default(0),
  modifiedCount: integer('modified_count').notNull().default(0),
  appliedAt: timestamp('applied_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const contextAccessLog = pgTable('context_access_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  scopeId: uuid('scope_id')
    .notNull()
    .references(() => contextScopes.id, { onDelete: 'cascade' }),
  accessorType: contextAccessorType('accessor_type').notNull(),
  accessorId: uuid('accessor_id').notNull(),
  action: contextAccessAction('action').notNull(),
  tokenCount: integer('token_count').notNull().default(0),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
})

export type ContextScope = typeof contextScopes.$inferSelect
export type NewContextScope = typeof contextScopes.$inferInsert
export type ContextSyncEvent = typeof contextSyncEvents.$inferSelect
export type NewContextSyncEvent = typeof contextSyncEvents.$inferInsert
export type ContextAccessLog = typeof contextAccessLog.$inferSelect
export type NewContextAccessLog = typeof contextAccessLog.$inferInsert
