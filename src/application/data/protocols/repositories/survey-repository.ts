import { type UserID, type SurveyID, type Survey, type GuestID } from '@/domain/entities'
import {
  type AnswerToUserContext,
  type UserLoadOneSurvey as UserLoadOneSurveyModel,
  type UserLoadAllSurveys as UserLoadAllSurveysModel
} from '@/domain/models'

export namespace SurveyRepository {
  export namespace PublisherAddSurvey {
    export type Params = Survey.BaseDataModel.Body
    export type Result = { surveyId: SurveyID }
  }

  export namespace LoadSurveyById {
    export type Params = { id: SurveyID }
    export type Result = Survey.Model
  }

  export namespace LoadOneSurvey {
    export type Params = { surveyId: SurveyID, userOrGuestId: UserID | GuestID, type: 'user' | 'guest' }
    export type Result = Omit<UserLoadOneSurveyModel.Result, 'answers' | 'didAnswer'>
    & { answers: Array<Survey.BaseDataModel.BaseAnswer & { isCurrentAccountAnswer?: boolean }>, didAnswer?: boolean }
  }

  export namespace UserLoadAllSurveys {
    export type Params = UserLoadAllSurveysModel.Params
    export type Result = Array<Omit<UserLoadOneSurveyModel.Result, 'answers'>
    & { answers: Array<Omit<AnswerToUserContext, 'percent'>> }>
  }

  export namespace UpdateSurvey {
    export type Params = {
      userOrGuestId: UserID | GuestID
      type: 'user' | 'guest'
      surveyId: SurveyID
      oldAnswer: string
      newAnswer: string
    }
    export type Result = LoadOneSurvey.Result
  }
}

export type LoadSurveyByIdResult = SurveyRepository.LoadSurveyById.Result
export type LoadSurveyByIdParams = SurveyRepository.LoadSurveyById.Params

export interface ILoadSurveyByIdRepository {
  loadById: (data: LoadSurveyByIdParams) => Promise<LoadSurveyByIdResult>
}

export interface IPublisherAddSurveyRepository {
  add: (data: SurveyRepository.PublisherAddSurvey.Params) => Promise<SurveyRepository.PublisherAddSurvey.Result>
}

export interface ILoadOneSurveyRepository {
  loadSurvey: (data: SurveyRepository.LoadOneSurvey.Params) => Promise<SurveyRepository.LoadOneSurvey.Result>
}

export interface IUserLoadAllSurveysRepository {
  loadAll: (data: SurveyRepository.UserLoadAllSurveys.Params) => Promise<SurveyRepository.UserLoadAllSurveys.Result>
}

export interface IUserUpdateSurveyRepository {
  update: (data: SurveyRepository.UpdateSurvey.Params) => Promise<SurveyRepository.UpdateSurvey.Result>
}

export interface IGuestUpdateSurveyRepository {
  update: (data: SurveyRepository.UpdateSurvey.Params) => Promise<SurveyRepository.UpdateSurvey.Result>
}
