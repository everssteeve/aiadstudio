import { Router } from 'express'
import { db, sql } from '@aiad/db'
import type { HealthResponse } from '@aiad/shared'

export function createHealthRouter(version: string): Router {
  const router = Router()

  router.get('/', async (_req, res) => {
    let dbStatus: 'ok' | 'error' = 'ok'

    try {
      await db.execute(sql`SELECT 1`)
    } catch {
      dbStatus = 'error'
    }

    const body: HealthResponse = {
      status: dbStatus === 'ok' ? 'ok' : 'degraded',
      uptime: Math.round(process.uptime() * 10) / 10,
      db: dbStatus,
      version,
    }

    res.status(body.status === 'ok' ? 200 : 503).json(body)
  })

  return router
}
