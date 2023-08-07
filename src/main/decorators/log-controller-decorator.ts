import { type LogErrorRepository } from '@/application/data/protocols/repositories/log'
import { type Controller, type HttpRequest, type HttpResponse } from '@/presentation/protocols'

export class LogControllerDecorator implements Controller {
  constructor (
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack, 'server')
    }
    return httpResponse
  }
}
