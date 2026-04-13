import { Router } from 'express'

export const issuesRouter: Router = Router()

issuesRouter.get('/', (_req, res) => {
  res.json({ data: [] });
});
