import { Router } from 'express'

export const agentsRouter: Router = Router()

agentsRouter.get('/', (_req, res) => {
  res.json({ data: [] })
})
