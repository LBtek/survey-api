import { type HttpResponse } from './http'

export interface IMiddleware {
  handle: (request: any) => Promise<HttpResponse>
}
