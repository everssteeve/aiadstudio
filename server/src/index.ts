import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import pinoHttp from 'pino-http'
import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'
import { logger } from './logger.js'
import { createHealthRouter } from './routes/health.js'
import { projectsRouter } from './routes/projects.js'
import { intentsRouter } from './routes/intents.js'
import { specsRouter } from './routes/specs.js'
import { issuesRouter } from './routes/issues.js'
import { agentsRouter } from './routes/agents.js'
import { contextRouter } from './routes/context.js'
import { authRouter } from './routes/auth.js'
import { errorMiddleware } from './middleware/error.js'
import { dbPool } from '@aiad/db'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8')) as { version: string }

const PORT = Number(process.env.PORT ?? 3000)

const app = express()

app.use(pinoHttp({ logger }))
app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' }))
app.use(express.json({ limit: '1mb' }))

app.use('/health', createHealthRouter(pkg.version))
app.use('/api/auth', authRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/intents', intentsRouter)
app.use('/api/specs', specsRouter)
app.use('/api/issues', issuesRouter)
app.use('/api/agents', agentsRouter)
app.use('/api/context', contextRouter)

app.use(errorMiddleware)

const server = createServer(app)

server.listen(PORT, () => {
  logger.info({ port: PORT }, 'Server listening')
})

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    logger.error({ port: PORT, err }, 'Port already in use')
    process.exit(1)
  }
  logger.error({ err }, 'Server error')
})

function shutdown(signal: string): void {
  logger.info({ signal }, 'Shutdown signal received')

  const forceExit = setTimeout(() => {
    logger.error('Graceful shutdown timed out — forcing exit')
    process.exit(1)
  }, 10_000)

  server.close(async () => {
    clearTimeout(forceExit)
    try {
      await dbPool.end()
    } catch (err) {
      logger.warn({ err }, 'Error closing DB pool')
    }
    logger.info('Server closed')
    process.exit(0)
  })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
