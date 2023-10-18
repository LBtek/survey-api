import { z } from 'zod'
import { surveyIdSchema } from './common'

export const userLoadOneSurveyZodSchema = z.object({
  surveyId: surveyIdSchema
})
