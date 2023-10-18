import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'
import { answerSchema } from './common'

export const addSurveyZodSchema = extendApi(z.object({
  question: extendApi(z.string().trim().min(8), { example: 'Any Question' }),
  answers: z.array(z.object({
    image: z.string().trim().min(3).optional(),
    answer: answerSchema
  })).min(2)
}), {
  title: 'Add Survey Params',
  description: 'Arguments to add a new survey'
})
