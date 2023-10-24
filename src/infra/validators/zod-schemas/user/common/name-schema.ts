import { type OpenApiZodAny, extendApi } from '@anatine/zod-openapi'
import { MissingParamError } from '@/presentation/errors'
import { z } from 'zod'

export const userNameSchema = (fieldName = 'username'): OpenApiZodAny => (extendApi(
  z.string({
    required_error: new MissingParamError(fieldName).message
  }).trim().min(3), {
    title: 'User Name Param',
    description: 'User Name Param',
    example: 'Fulano Ciclano das Quantas'
  }
))
