import { logoutZodSchema } from '@/infra/validators/zod-schemas'
import { generateSchema } from '@anatine/zod-openapi'

export const logoutParamsSchema = generateSchema(logoutZodSchema)
