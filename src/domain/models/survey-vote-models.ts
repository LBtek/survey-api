import { type GuestSurveyVote, type UserSurveyVote } from '../entities'
import { type GuestLoadOneSurvey, type UserLoadOneSurvey } from './survey-models'

export namespace UserSaveSurveyVote {
  export type Params = UserSurveyVote.BaseDataModel.Body
  export type Result = UserLoadOneSurvey.Result
}

export namespace GuestSaveSurveyVote {
  export type Params = GuestSurveyVote.BaseDataModel.Body
  export type Result = GuestLoadOneSurvey.Result
}
