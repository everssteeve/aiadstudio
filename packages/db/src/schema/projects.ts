import { pgTable, pgEnum, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users.js'
import { contextScopes } from './context.js'

export const projectStatus = pgEnum('project_status', ['active', 'archived'])

export const repositoryProvider = pgEnum('repository_provider', ['github', 'gitlab'])

export const responsibilityRole = pgEnum('responsibility_role', [
  'pm',
  'pe',
  'ae',
  'qa',
  'tech_lead',
])

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  repositoryUrl: text('repository_url'),
  repositoryProvider: repositoryProvider('repository_provider'),
  defaultBranch: text('default_branch'),
  status: projectStatus('status').notNull().default('active'),
  // Lien vers le scope Context Mesh de type 'project'
  contextScopeId: uuid('context_scope_id').references(() => contextScopes.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const projectMemberships = pgTable('project_memberships', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  responsibility: responsibilityRole('responsibility').notNull(),
  // Un seul membre peut être "primary" par responsabilité par projet (contrainte applicative)
  isPrimary: boolean('is_primary').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type ProjectMembership = typeof projectMemberships.$inferSelect
export type NewProjectMembership = typeof projectMemberships.$inferInsert
