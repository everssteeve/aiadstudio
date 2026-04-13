import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as schema from './schema/index.js'

const { Pool } = pg

export const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(dbPool, { schema })
