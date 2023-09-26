import { type ILogErrorRepository } from '@/application/data/protocols/repositories/log'
import { type IController, type HttpRequest, type HttpResponse } from '@/presentation/protocols'

export class LogControllerDecorator implements IController {
  constructor (
    private readonly controller: IController,
    private readonly logErrorRepository: ILogErrorRepository
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack, 'server')
    }
    return httpResponse
  }
}
