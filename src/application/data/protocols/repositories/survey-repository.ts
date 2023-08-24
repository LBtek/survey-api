import { type Survey } from '@/domain/entities'
import {
  type AnswerToUserContext,
  type UserLoadOneSurvey as UserLoadOneSurveyModel,
  type UserLoadAllSurveys as UserLoadAllSurveysModel
} from '@/domain/models'

export namespace SurveyRepository {
  export namespace PublisherAddSurvey {
    export type Params = Survey.BaseDataModel.Body
    export type Result = { surveyId: string }
  }

  export namespace LoadSurveyById {
    export type Params = { id: string }
    export type Result = { id: string } & Survey.BaseDataModel.Body
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
      surveyId: string
      oldAnswer: string
      newAnswer: string
      accountId: string
    }
    export type Result = UserLoadOneSurvey.Result
  }
}

export type LoadSurveyByIdResult = SurveyRepository.LoadSurveyById.Result
export type LoadSurveyByIdParams = SurveyRepository.LoadSurveyById.Params

export interface LoadSurveyByIdRepository {
  loadById: (data: LoadSurveyByIdParams) => Promise<LoadSurveyByIdResult>
}

export interface PublisherAddSurveyRepository {
  add: (data: SurveyRepository.PublisherAddSurvey.Params) => Promise<SurveyRepository.PublisherAddSurvey.Result>
}

export interface UserLoadOneSurveyRepository {
  loadSurvey: (data: SurveyRepository.UserLoadOneSurvey.Params) => Promise<SurveyRepository.UserLoadOneSurvey.Result>
}

export interface UserLoadAllSurveysRepository {
  loadAll: (data: SurveyRepository.UserLoadAllSurveys.Params) => Promise<SurveyRepository.UserLoadAllSurveys.Result>
}

export interface UserUpdateSurveyRepository {
  update: (data: SurveyRepository.UserUpdateSurvey.Params) => Promise<SurveyRepository.UserUpdateSurvey.Result>
}
