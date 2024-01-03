import { type Survey } from '@/domain/entities'
import {
  type PublisherAddSurvey,
  type AnswerToUserContext,
  type UserLoadOneSurvey,
  type UserLoadAllSurveys,
  type GuestLoadOneSurvey
} from '@/domain/models'
import { type SurveyRepository } from '@/application/data/protocols/repositories'

const date = new Date()

const mockAnswers = (): Array<Omit<Survey.BaseDataModel.BaseAnswer, 'numberOfVotes'>> => {
  return [{
    image: 'any_image',
    answer: 'any_answer'
  }, {
    answer: 'other_answer'
  }]
}

export const mockAddSurveyParams = (): PublisherAddSurvey.Params => ({
  publisherAccountId: 'any_account_id',
  question: 'any_question',
  answers: mockAnswers(),
  date
})

export const mockAddSurveyRepositoryParams = (): SurveyRepository.PublisherAddSurvey.Params => {
  const answers = mockAnswers().map((answer: Survey.BaseDataModel.BaseAnswer) => {
    answer.numberOfVotes = 0
    return answer
  })
  return {
    ...mockAddSurveyParams(),
    answers,
    totalNumberOfVotes: 0
  }
}

export const mockSurvey = (): Survey.ModelForPubisher => ({
  id: 'any_survey_id',
  ...mockAddSurveyRepositoryParams()
})

export const mockLoadOneSurveyRepositoryResult = (type: 'user' | 'guest'): SurveyRepository.LoadOneSurvey.Result => {
  const survey = mockSurvey()
  delete survey.publisherAccountId

  const result: SurveyRepository.LoadOneSurvey.Result = {
    ...survey,
    answers: mockSurvey().answers.map((answer: AnswerToUserContext) => {
      if (type === 'user') answer.isCurrentAccountAnswer = false
      return answer
    })
  }
  if (type === 'user') result.didAnswer = false

  return result
}

export const mockUserLoadAllSurveysRepositoryResult = (): SurveyRepository.UserLoadAllSurveys.Result => {
  return [
    mockLoadOneSurveyRepositoryResult('user') as any,
    {
      id: 'other_id',
      question: 'other_question',
      answers: [{
        image: 'other_image',
        answer: 'other_answer',
        isCurrentAccountAnswer: false,
        numberOfVotes: 0
      }],
      date,
      totalNumberOfVotes: 0,
      didAnswer: false
    }]
}

export const mockSurveyToGuestContext = (): GuestLoadOneSurvey.Result => ({
  ...mockLoadOneSurveyRepositoryResult('guest') as GuestLoadOneSurvey.Result,
  answers: mockLoadOneSurveyRepositoryResult('guest').answers.map((answer: AnswerToUserContext) => {
    answer.percent = 0
    return answer
  })
})

export const mockAllSurveysToGuestContext = (): GuestLoadOneSurvey.Result[] => {
  const surveys = [mockSurveyToGuestContext(), mockSurveyToGuestContext()]
  return surveys
}

export const mockSurveyToUserContext = (): UserLoadOneSurvey.Result => ({
  ...mockLoadOneSurveyRepositoryResult('user') as UserLoadOneSurvey.Result,
  answers: mockLoadOneSurveyRepositoryResult('user').answers.map((answer: AnswerToUserContext) => {
    answer.percent = 0
    return answer
  })
})

export const mockAllSurveysToUserContext = (): UserLoadAllSurveys.Result => {
  const surveyTwo = mockUserLoadAllSurveysRepositoryResult()[1] as UserLoadOneSurvey.Result
  surveyTwo.answers[0].percent = 0

  return [
    mockSurveyToUserContext(),
    { ...surveyTwo }
  ]
}
