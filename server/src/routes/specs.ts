import { Router } from 'express';

export const specsRouter = Router();

specsRouter.get('/', (_req, res) => {
  res.json({ data: [] });
});
