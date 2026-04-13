import { describe, it, expect, vi, beforeEach } from 'vitest'
import express from 'express'
import request from 'supertest'

vi.mock('@aiad/db', () => ({
  db: { execute: vi.fn() },
  dbPool: { end: vi.fn() },
  sql: (strings: TemplateStringsArray) => ({ queryChunks: [strings[0]] }),
}))

import { db } from '@aiad/db'
import { createHealthRouter } from './health.js'

function buildApp(version = '0.1.0') {
  const app = express()
  app.use('/health', createHealthRouter(version))
  return app
}

describe('GET /health', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 with status ok when DB is reachable', async () => {
    vi.mocked(db.execute).mockResolvedValueOnce([] as never)

    const res = await request(buildApp()).get('/health')

    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
    expect(res.body.db).toBe('ok')
    expect(typeof res.body.uptime).toBe('number')
    expect(res.body.uptime).toBeGreaterThanOrEqual(0)
    expect(res.body.version).toBe('0.1.0')
  })

  it('returns 503 with status degraded when DB is unreachable', async () => {
    vi.mocked(db.execute).mockRejectedValueOnce(new Error('connection refused'))

    const res = await request(buildApp()).get('/health')

    expect(res.status).toBe(503)
    expect(res.body.status).toBe('degraded')
    expect(res.body.db).toBe('error')
    expect(res.body.version).toBe('0.1.0')
  })

  it('includes uptime as a positive number', async () => {
    vi.mocked(db.execute).mockResolvedValueOnce([] as never)

    const res = await request(buildApp()).get('/health')

    expect(res.body.uptime).toBeGreaterThan(0)
  })
})
