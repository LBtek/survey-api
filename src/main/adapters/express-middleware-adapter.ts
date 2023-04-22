import { type Response, type Request, type NextFunction } from 'express'
import { type HttpRequest, type Middleware } from '@/presentation/protocols'

export const adaptMiddleware = (controller: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)
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
