import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'
import { passwordSchema } from './common'
import { emailSchema, userNameSchema } from '../user/common'

export const signUpZodSchema = z.object({
  email: emailSchema(),
  name: userNameSchema(),
  password: passwordSchema(),
  passwordConfirmation: extendApi(passwordSchema(), {
    description: 'Must be the same password as the password field'
  })
})
