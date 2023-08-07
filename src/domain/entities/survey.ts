/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { type AnswersLengthError } from '../errors'

export namespace Survey {
  export namespace BaseDataModel {
    export type Body = {
      question: string
      answers: BaseAnswer[]
      date: Date
      totalAmountVotes: number
    }
    export type BaseAnswer = {
      image?: string
      answer: string
      amountVotes: number
    }
  }

  export namespace PublisherAddSurvey {
    export type Params =
      Omit<BaseDataModel.Body, 'totalAmountVotes' | 'answers'>
      & { answers: Array<Omit<BaseDataModel.BaseAnswer, 'amountVotes'>> }

    export type Result = 'Ok' | AnswersLengthError
  }

  export type AnswerToUserContext = BaseDataModel.BaseAnswer & { isCurrentAccountAnswer: boolean, percent: number }

  export namespace UserLoadOneSurvey {
    export type Params = {
      surveyId: string
      accountId: string
    }

    export type Result =
      BaseDataModel.Body
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
}
