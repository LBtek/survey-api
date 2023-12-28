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
