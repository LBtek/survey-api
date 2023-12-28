export const surveyAnswerSchema = {
  type: 'object',
  properties: {
    image: {
      type: 'string'
    },
    answer: {
      type: 'string'
    },
    percent: {
      type: 'string'
    },
    numberOfVotes: {
      type: 'number'
    }
  },
  required: ['answer', 'numberOfVotes']
}
