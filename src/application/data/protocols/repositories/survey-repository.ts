import { type UserID, type SurveyID, type Survey, type GuestID } from '@/domain/entities'
import {
  type AnswerToUserContext,
  type UserLoadOneSurvey as UserLoadOneSurveyModel,
  type UserLoadAllSurveys as UserLoadAllSurveysModel,
  type PublisherLoadSurveys as PublisherLoadSurveysModel
} from '@/domain/models'

export namespace SurveyRepository {
  export namespace PublisherAddSurvey {
    export type Params = Survey.BaseDataModel.DataModelForPublisher
    export type Result = { surveyId: SurveyID }
  }

  export namespace PublisherLoadSurveys {
    export type Params = PublisherLoadSurveysModel.Params
    export type Result = PublisherLoadSurveysModel.Result
  }

  export namespace LoadSurveyById {
    export type Params = { id: SurveyID }
    export type Result = Survey.ModelForPubisher
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

export interface IPublisherLoadSurveysRepository {
  publisherLoadSurveys: (data: SurveyRepository.PublisherLoadSurveys.Params) => Promise<SurveyRepository.PublisherLoadSurveys.Result>
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
