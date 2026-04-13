import { Router } from 'express';

export const issuesRouter = Router();

issuesRouter.get('/', (_req, res) => {
  res.json({ data: [] });
});
