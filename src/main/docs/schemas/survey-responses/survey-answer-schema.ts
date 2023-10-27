export const surveyAnswerSchema = {
  type: 'object',
  properties: {
    image: {
      type: 'string'
    },
    answer: {
      type: 'string'
    },
    amountVotes: {
      type: 'number'
    }
  },
  required: ['answer', 'amountVotes']
}
