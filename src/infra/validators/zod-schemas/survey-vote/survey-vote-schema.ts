import { z } from 'zod'
import { answerSchema, surveyIdSchema } from '../survey/common'

export const surveyVoteZodSchema = z.object({
  answer: answerSchema
})

export const saveSurveyVoteZodValidation = z.object({ surveyId: surveyIdSchema }).extend(surveyVoteZodSchema.shape)

export const guestSurveyVoteSchema = z.object({
  guestAgentId: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  email: z.string().email().optional().nullable()
}).extend(surveyVoteZodSchema.shape)

export const guestSaveSurveyVoteZodValidation = z.object({
  surveyId: surveyIdSchema
}).extend(guestSurveyVoteSchema.shape)
