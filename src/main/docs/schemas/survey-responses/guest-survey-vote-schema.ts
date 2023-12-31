import { surveySchema } from './survey-schema'

export const guestSurveyVoteSchema = {
  type: 'object',
  properties: {
    guest: {
      type: 'object',
      properties: {
        status: {
          type: 'string'
        },
        guestId: {
          type: 'string'
        },
        guestAgentId: {
          type: 'string'
        }
      },
      required: ['status', 'guestId', 'guestAgentId']
    },
    survey: surveySchema
  }
}

export const surveyForGuestExample = {
  guest: {
    status: 'Added new guest',
    guestId: 'Any-Guest-ID',
    guestAgentId: 'Any-Guest-Agent-ID'
  },
  survey: {
    id: 'Any-Survey-ID',
    question: 'Any Question',
    answers: [
      {
        answer: 'Any answer',
        numberOfVotes: 0,
        percent: 0
      },
      {
        image: 'Any image',
        answer: 'Other answer',
        numberOfVotes: 1,
        percent: 100
      }
    ],
    totalNumberOfVotes: 1,
    date: 'Date'
  }
}
