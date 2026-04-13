import { Router } from 'express';

export const intentsRouter = Router();

intentsRouter.get('/', (_req, res) => {
  res.json({ data: [] });
});
