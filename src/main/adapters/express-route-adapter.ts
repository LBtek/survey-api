import { type Response, type Request } from 'express'
import { type IController } from '@/presentation/protocols'

export const adaptRoute = (controller: IController) => {
  return async (req: Request, res: Response) => {
    const request = {
      accessToken: req.headers?.['x-access-token'],
      ...(req.body),
      ...(req.params),
      ...(req.query),
      ip: req.ip,
      userId: req.userId || null,
      accountId: req.accountId || null,
      role: req.role || req.body.role || null
    }
    const httpResponse = await controller.handle(request)
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      if (req.newAccessToken) {
        httpResponse.body = {
          newAccessToken: req.newAccessToken,
          res: httpResponse.body
        }
        if (httpResponse.statusCode === 204) {
          httpResponse.statusCode = 200
        }
      }
      res.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
