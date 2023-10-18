import { z } from 'zod'
import { answerSchema, surveyIdSchema } from '../survey/common'

export const surveyVoteZodSchema = z.object({
  surveyId: surveyIdSchema,
  answer: answerSchema
})
