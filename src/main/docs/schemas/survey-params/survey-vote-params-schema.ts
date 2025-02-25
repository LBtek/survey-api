import { guestSurveyVoteSchema, surveyVoteZodSchema } from '@/infra/validators/zod-schemas'
import { generateSchema } from '@anatine/zod-openapi'

export const surveyVoteParamsSchema = generateSchema(surveyVoteZodSchema)

export const guestSurveyVoteParamsSchema = generateSchema(guestSurveyVoteSchema)
