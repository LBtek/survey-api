import { type OpenApiZodAny, extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

export const emailSchema = (): OpenApiZodAny => (extendApi(z.string().email(), {
  title: 'Email Param',
  description: 'Must not be empty and must have a valid email format',
  example: 'user@example.com'
}))
