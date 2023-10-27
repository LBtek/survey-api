import { surveySchema } from './survey-schema'

export const surveyForBasicUserSchema = {
  type: 'object',
  properties: {
    ...surveySchema.properties,
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyAnswerForBasicUser'
      }
    },
    didAnswer: {
      type: 'boolean'
    }
  },
  required: [...surveySchema.required, 'didAnswer']
}

export const surveyForBasicUserExample = {
  id: 'Any-Survey-ID',
  question: 'Any Question',
  answers: [
    {
      answer: 'Any answer',
      amountVotes: 0,
      percent: 0,
      isCurrentAccountAnswer: false
    },
    {
      image: 'Any image',
      answer: 'Other answer',
      amountVotes: 1,
      percent: 100,
      isCurrentAccountAnswer: true
    }
  ],
  totalAmountVotes: 1,
  didAnswer: true,
  date: 'Date'
}
