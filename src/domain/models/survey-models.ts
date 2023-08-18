import { type Survey } from '../entities'
import { type AnswersLengthError } from '../errors'

export namespace PublisherAddSurvey {
  export type Params =
    Omit<Survey.BaseDataModel.Body, 'totalAmountVotes' | 'answers'>
    & { answers: Array<Omit<Survey.BaseDataModel.BaseAnswer, 'amountVotes'>> }

  export type Result = 'Ok' | AnswersLengthError
}

export type AnswerToUserContext = Survey.BaseDataModel.BaseAnswer & { isCurrentAccountAnswer: boolean, percent: number }

export namespace UserLoadOneSurvey {
  export type Params = {
    surveyId: string
    accountId: string
  }

  export type Result =
    Survey.BaseDataModel.Body
    & { id: string }
    & { answers: AnswerToUserContext[] }
    & { didAnswer: boolean }
}

export namespace UserLoadAllSurveys {
  export type Params = {
    accountId: string
  }
  export type Result = UserLoadOneSurvey.Result[]
}
