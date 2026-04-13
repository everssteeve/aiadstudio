import { Router } from 'express'

export const projectsRouter: Router = Router()

projectsRouter.get('/', (_req, res) => {
  res.json({ data: [] });
});
