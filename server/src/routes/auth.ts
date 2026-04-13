import { Router } from 'express'

export const authRouter: Router = Router()

authRouter.post('/login', (_req, res) => {
  res.json({ token: null });
});
