import { type LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { type Middleware, type HttpRequest, type HttpResponse } from '@/presentation/protocols'
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken'

export class LogAuthMiddlewareDecorator implements Middleware {
  constructor (
    private readonly middleware: Middleware,
    private readonly logErrorRepository: LogErrorRepository
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
