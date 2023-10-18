import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'
import { passwordSchema } from './common'
import { emailSchema } from '../user/common'

export const loginZodSchema = extendApi(z.object({
  email: emailSchema(),
  password: passwordSchema()
}), {
  title: 'Login Params',
  description: 'Arguments to send '
})
