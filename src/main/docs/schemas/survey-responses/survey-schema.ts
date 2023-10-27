export const surveySchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    question: {
      type: 'string'
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyAnswer'
      }
    },
    totalNumberOfVotes: {
      type: 'boolean'
    },
    date: {
      type: 'string'
    }
  },
  required: ['id', 'question', 'answers', 'totalNumberOfVotes', 'date']
}
