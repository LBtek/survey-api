import { loginZodSchema } from '@/infra/validators/zod-schemas'
import { generateSchema } from '@anatine/zod-openapi'

export const loginParamsSchema = generateSchema(loginZodSchema)

/* export const loginParamsSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string'
    },
    password: {
      type: 'string'
    }
  },
  required: ['email', 'password']
}
*/
