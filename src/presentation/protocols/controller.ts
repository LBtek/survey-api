import { type HttpResponse } from './http'

export interface Controller {
  handle: (request: any) => Promise<HttpResponse>
}
