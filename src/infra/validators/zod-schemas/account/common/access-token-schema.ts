import { type OpenApiZodAny, extendApi } from '@anatine/zod-openapi'
import { MissingParamError } from '@/presentation/errors'
import { z } from 'zod'

const description = 'Access Token must be a JWT (Json Web Token)'

export const accessTokenSchema = (): OpenApiZodAny => (
  extendApi(z
    .string(
      {
        required_error: new MissingParamError('accessToken').message
      }
    ).trim().min(3).describe(description),
  {
    description,
    example: 'Um token qualquer'
  })
)
