import { type UserID, type SurveyID, type Survey } from '../entities'
import { type AccountID } from '@/application/entities'
import { type AnswersLengthError } from '../errors'

export type AnswerToUserContext =
  Survey.BaseDataModel.BaseAnswer & {
    isCurrentAccountAnswer: boolean
    percent: number
  }

export namespace PublisherAddSurvey {
  export type Params =
    Omit<Survey.BaseDataModel.DataModelForPublisher, 'totalNumberOfVotes' | 'answers'>
    & { answers: Array<Omit<Survey.BaseDataModel.BaseAnswer, 'numberOfVotes'>> }

  export type Result = 'Ok' | AnswersLengthError
}

export namespace GuestLoadAllSurveys {
  export type Result = Array<Omit<Survey.Model, 'answers'>
  & { answers: Array<Survey.BaseDataModel.BaseAnswer & { percent: number }> }>
}

export namespace GuestLoadOneSurvey {
  export type Params = {
    surveyId: SurveyID
  }

  export type Result = Omit<Survey.Model, 'answers'>
  & { answers: Array<Survey.BaseDataModel.BaseAnswer & { percent: number }> }
}

export namespace UserLoadOneSurvey {
  export type Params = {
    surveyId: SurveyID
    userId: UserID
  }

  export type Result =
    Survey.BaseDataModel.Body & {
      id: SurveyID
      answers: AnswerToUserContext[]
      didAnswer: boolean
    }
}

export namespace UserLoadAllSurveys {
  export type Params = {
    userId: UserID
  }
  export type Result = UserLoadOneSurvey.Result[]
}

export namespace PublisherLoadSurveys {
  export type Params = {
    publisherAccountId: AccountID
  }
  export type Result = Survey.ModelForPubisher[]
}
