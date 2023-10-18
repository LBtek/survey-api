import { type OpenApiZodAny, extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

export const userNameSchema = (): OpenApiZodAny => (extendApi(
  z.string().trim().min(3), {
    title: 'User Name Param',
    description: 'User Name Param',
    example: 'Fulano Ciclano das Quantas'
  }
))
