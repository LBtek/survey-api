import { surveySchema } from './survey-schema'

export const publisherSurveySchema = {
  type: 'object',
  properties: {
    ...surveySchema.properties,
    publisherAccountId: {
      type: 'string'
    }
  },
  required: [...surveySchema.required, 'publisherAccountId']
}

export const surveyForPublisherExample = {
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
  publisherAccountId: 'Any-Account-ID',
  date: 'Date'
}
