import { MissingParamError } from '@/presentation/errors'
import { z } from 'zod'

export const answerSchema = z.string({
  required_error: new MissingParamError('answer').message
}).trim().min(3)
