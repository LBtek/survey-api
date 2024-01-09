import { z } from 'zod'
import { extendApi } from '@anatine/zod-openapi'
import { answerSchema, surveyIdSchema } from '../survey/common'
import { guestEmailSchema } from '../user/common'

export const surveyVoteZodSchema = z.object({
  answer: answerSchema
})

export const saveSurveyVoteZodValidation = z.object({ surveyId: surveyIdSchema }).extend(surveyVoteZodSchema.shape)

export const guestSurveyVoteSchema = extendApi(z.object({
  guestAgentId: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  email: guestEmailSchema()
}).extend(surveyVoteZodSchema.shape), {
  title: 'Guest Survey Vote Params',
  description: 'Arguments to send'
})

export const guestSaveSurveyVoteZodValidation = z.object({
  surveyId: surveyIdSchema
}).extend(guestSurveyVoteSchema.shape)
