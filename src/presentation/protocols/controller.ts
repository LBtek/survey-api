import { type HttpResponse } from './http'

export interface IController {
  handle: (request: any) => Promise<HttpResponse>
}
