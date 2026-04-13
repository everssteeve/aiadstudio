export interface HealthResponse {
  status: 'ok' | 'degraded'
  uptime: number
  db: 'ok' | 'error'
  version: string
}
