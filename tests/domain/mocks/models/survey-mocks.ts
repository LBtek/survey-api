import { type Survey } from '@/domain/entities'
import {
  type PublisherAddSurvey,
  type AnswerToUserContext,
  type UserLoadOneSurvey,
  type UserLoadAllSurveys
} from '@/domain/models'
import { type SurveyRepository } from '@/application/data/protocols/repositories'

const date = new Date()

const mockAnswers = (): Array<Omit<Survey.BaseDataModel.BaseAnswer, 'amountVotes'>> => {
  return [{
    image: 'any_image',
    answer: 'any_answer'
  }, {
    answer: 'other_answer'
  }]
}

export const mockAddSurveyParams = (): PublisherAddSurvey.Params => ({
  question: 'any_question',
  answers: mockAnswers(),
  date
})

export const mockAddSurveyRepositoryParams = (): SurveyRepository.PublisherAddSurvey.Params => {
  const answers = mockAnswers().map((answer: Survey.BaseDataModel.BaseAnswer) => {
    answer.amountVotes = 0
    return answer
  })
  return {
    ...mockAddSurveyParams(),
    answers,
    totalAmountVotes: 0
  }
}

export const mockSurvey = (): Survey.BaseDataModel.Body & { id: string } => ({
  id: 'any_survey_id',
  ...mockAddSurveyRepositoryParams()
})

export const mockSurveyToUserContext = (): UserLoadOneSurvey.Result => ({
  ...mockSurvey(),
  answers: mockSurvey().answers.map((answer: AnswerToUserContext) => {
    answer.isCurrentAccountAnswer = false
    return answer
  }),
  didAnswer: false
})

export const mockAllSurveysToUserContext = (): UserLoadAllSurveys.Result => {
  return [
    mockSurveyToUserContext(),
    {
      id: 'other_id',
      question: 'other_question',
      answers: [{
        image: 'other_image',
        answer: 'other_answer',
        isCurrentAccountAnswer: false,
        percent: 0,
        amountVotes: 0
      }],
      date,
      totalAmountVotes: 0,
      didAnswer: false
    }]
}
