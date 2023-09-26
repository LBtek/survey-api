import { type UserID, type SurveyID, type Survey } from '@/domain/entities'
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

  export namespace UserLoadOneSurvey {
    export type Params = UserLoadOneSurveyModel.Params
    export type Result = Omit<UserLoadOneSurveyModel.Result, 'answers'>
    & { answers: Array<Omit<AnswerToUserContext, 'percent'>> }
  }

  export namespace UserLoadAllSurveys {
    export type Params = UserLoadAllSurveysModel.Params
    export type Result = UserLoadOneSurvey.Result[]
  }

  export namespace UserUpdateSurvey {
    export type Params = {
      userId: UserID
      surveyId: SurveyID
      oldAnswer: string
      newAnswer: string
    }
    export type Result = UserLoadOneSurvey.Result
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

export interface IUserLoadOneSurveyRepository {
  loadSurvey: (data: SurveyRepository.UserLoadOneSurvey.Params) => Promise<SurveyRepository.UserLoadOneSurvey.Result>
}

export interface IUserLoadAllSurveysRepository {
  loadAll: (data: SurveyRepository.UserLoadAllSurveys.Params) => Promise<SurveyRepository.UserLoadAllSurveys.Result>
}

export interface IUserUpdateSurveyRepository {
  update: (data: SurveyRepository.UserUpdateSurvey.Params) => Promise<SurveyRepository.UserUpdateSurvey.Result>
}
