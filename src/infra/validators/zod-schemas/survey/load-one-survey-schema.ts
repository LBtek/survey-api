import { z } from 'zod'
import { surveyIdSchema } from './common'

export const loadOneSurveyZodSchema = z.object({
  surveyId: surveyIdSchema
})
