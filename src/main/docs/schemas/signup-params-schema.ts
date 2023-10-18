import { signUpZodSchema } from '@/infra/validators/zod-schemas'
import { generateSchema } from '@anatine/zod-openapi'

export const signUpParamsSchema = generateSchema(signUpZodSchema)

/* export const signUpParamsSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    password: {
      type: 'string'
    },
    passwordConfirmation: {
      type: 'string'
    }
  },
  required: ['name', 'email', 'password', 'passwordConfirmation']
} */
