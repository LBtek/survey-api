import { type NextFunction, type Request, type Response } from 'express'

export const noCache = (req: Request, res: Response, next: NextFunction): void => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.set('expires', '0')
  res.set('surrogate-control', 'no-store')
  next()
}
