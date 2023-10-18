import { type OpenApiZodAny, extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

const description = 'Access Token must be a JWT (Json Web Token)'

export const accessTokenSchema = (): OpenApiZodAny => (
  extendApi(z.string().trim().min(3).describe(description), {
    description,
    example: 'Um token qualquer'
  })
)
