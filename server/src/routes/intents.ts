import { Router } from 'express'

export const intentsRouter: Router = Router()

intentsRouter.get('/', (_req, res) => {
  res.json({ data: [] });
});
