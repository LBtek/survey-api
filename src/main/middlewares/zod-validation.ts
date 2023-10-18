/* eslint-disable @typescript-eslint/no-floating-promises */
import { type ILogErrorRepository } from '@/application/data/protocols/repositories'
import { type Response, type Request, type NextFunction } from 'express'
import { type SomeZodObject, ZodError } from 'zod'
import { LogMongoRepository } from '@/infra/db/mongodb/log'
import { ServerError } from '@/presentation/errors'

export const zodValidation = (
  zodValidatorSchema: SomeZodObject,
  logErrorRepository: ILogErrorRepository = new LogMongoRepository()
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let objToParse: any = { accessToken: req.headers['x-access-token'] }
      if (req.method === 'GET') {
        objToParse = { ...objToParse, ...req.params, ...req.query }
      } else if (req.method === 'POST' || req.method === 'PUT') {
        objToParse = { ...objToParse, ...req.body }
      }
      zodValidatorSchema.parse(objToParse)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: error.errors[0]?.message || error.message
        })
      } else {
        logErrorRepository.logError(error.stack, 'server')
        res.status(500).json({
          error: new ServerError().message
        })
      }
    }
  }
}
