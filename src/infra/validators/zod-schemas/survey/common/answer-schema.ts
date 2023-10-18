import { z } from 'zod'

export const answerSchema = z.string().trim().min(3)
