import { Router } from 'express'

export const contextRouter: Router = Router()

contextRouter.get('/', (_req, res) => {
  res.json({ data: [] });
});
