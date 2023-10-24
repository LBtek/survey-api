import { MissingParamError } from '@/presentation/errors'
import { z } from 'zod'

export const surveyIdSchema = z.string({
  required_error: new MissingParamError('surveyId').message
}).trim().min(3)
