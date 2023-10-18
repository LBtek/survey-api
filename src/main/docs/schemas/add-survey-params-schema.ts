import { addSurveyZodSchema } from '@/infra/validators/zod-schemas'
import { generateSchema } from '@anatine/zod-openapi'

export const addSurveyParamsSchema = generateSchema(addSurveyZodSchema)

/* export const addSurveyParamsSchema = {
  type: 'object',
  properties: {
    question: {
      type: 'string'
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyAnswer'
      }
    }
  },
  required: ['question', 'answers']
} */
