import type { Request, Response, NextFunction } from 'express';

export function contextAccessMiddleware(_req: Request, _res: Response, next: NextFunction): void {
  next();
}
