import { z } from 'zod'

export const surveyIdSchema = z.string().trim().min(3)
