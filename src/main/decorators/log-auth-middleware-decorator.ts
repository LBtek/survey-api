import { type ILogErrorRepository } from '@/application/data/protocols/repositories/log'
import { type IMiddleware, type HttpRequest, type HttpResponse } from '@/presentation/protocols'
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken'

export class LogAuthMiddlewareDecorator implements IMiddleware {
  constructor (
    private readonly middleware: IMiddleware,
    private readonly logErrorRepository: ILogErrorRepository
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.middleware.handle(httpRequest)
    const { body: error, statusCode } = httpResponse
    if (statusCode === 500) {
      await this.logErrorRepository.logError(error.stack, 'server')
    }
    if (
      error instanceof JsonWebTokenError ||
      error instanceof TokenExpiredError ||
      error instanceof NotBeforeError
    ) {
      await this.logErrorRepository.logError(error.stack, 'auth')
    }
    return httpResponse
  }
}
