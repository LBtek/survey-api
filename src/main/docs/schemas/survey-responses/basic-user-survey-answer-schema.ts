import { surveyAnswerSchema } from './survey-answer-schema'

export const surveyAnswerForBasicUserSchema = {
  type: 'object',
  properties: {
    ...surveyAnswerSchema.properties,
    percent: {
      type: 'string'
    },
    isCurrentAccountAnswer: {
      type: 'boolean'
    }
  },
  required: [...surveyAnswerSchema.required, 'percent', 'isCurrentAccountAnswer']
}
