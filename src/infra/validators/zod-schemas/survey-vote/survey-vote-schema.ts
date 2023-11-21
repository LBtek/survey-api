import { z } from 'zod'
import { answerSchema, surveyIdSchema } from '../survey/common'

export const surveyVoteZodSchema = z.object({
  answer: answerSchema
})

export const saveSurveyVoteZodValidation = z.object({ surveyId: surveyIdSchema }).extend(surveyVoteZodSchema.shape)
