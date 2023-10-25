import { z } from 'zod'
import { answerSchema } from '../survey/common'

export const surveyVoteZodSchema = z.object({
  answer: answerSchema
})
