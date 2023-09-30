import { type Response, type Request, type NextFunction } from 'express'
import { type IMiddleware } from '@/presentation/protocols'

export const adaptMiddleware = (middleware: IMiddleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request = {
      ...(req.headers),
      ...(req.body),
      ip: req.ip,
      accessToken: req.headers['x-access-token']
    }
    const httpResponse = await middleware.handle(request)
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      Object.assign(req, httpResponse.body)
      next()
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
