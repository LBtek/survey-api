import { type OpenApiZodAny, extendApi } from '@anatine/zod-openapi'
import { MissingParamError } from '@/presentation/errors'
import { z } from 'zod'

export const passwordSchema = (fieldName = 'password'): OpenApiZodAny => (
  extendApi(z
    .string(
      {
        required_error: new MissingParamError(fieldName).message
      }
    ).trim().min(3),
  {
    title: 'Password Param',
    description: 'Must not be empty and must be at least three characters long',
    example: 'Za1',
    examples: ['654', 'dCb', 'r9T', '77a']
  })
)
