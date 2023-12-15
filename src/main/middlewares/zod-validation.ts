/* istanbul ignore file */

/* eslint-disable @typescript-eslint/no-floating-promises */

import { type ILogErrorRepository } from '@/application/data/protocols/repositories'
import { type Response, type Request, type NextFunction } from 'express'
import { ZodError, type AnyZodObject } from 'zod'
import { LogMongoRepository } from '@/infra/db/mongodb/log'
import { ServerError } from '@/presentation/errors'

/**
 * @deprecated
 * This middleware is not used anymore
 *
 * Instead of using this middleware, try injecting a validation composition into the controller
 * with the zodValidation validator found in the '@/application/validation/validators' folder
 */
export const zodValidation = (
  zodValidatorSchema: AnyZodObject,
  logErrorRepository: ILogErrorRepository = new LogMongoRepository()
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let objToParse: any =
        req.headers['x-access-token']
          ? { accessToken: req.headers['x-access-token'] }
          : { }

      if (req.method === 'GET') {
        objToParse = { ...objToParse, ...req.params, ...req.query }
      } else if (req.method === 'POST' || req.method === 'PUT') {
        objToParse = { ...objToParse, ...req.body, ...req.params }
      }
      zodValidatorSchema.parse(objToParse)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: error.errors[0].message
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
