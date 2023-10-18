// import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'
import { accessTokenSchema } from './common'

export const logoutZodSchema = z.object({
  accessToken: accessTokenSchema()
})
