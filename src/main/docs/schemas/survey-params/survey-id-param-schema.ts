import { surveyIdSchema as surveyIdZodSchema } from '@/infra/validators/zod-schemas/survey/common'
import { generateSchema } from '@anatine/zod-openapi'

export const surveyIdParamSchema = generateSchema(surveyIdZodSchema)
