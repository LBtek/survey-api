import { type SurveyVote } from '../entities'
import { type UserLoadOneSurvey } from './survey-models'

export namespace SaveSurveyVote {
  export type Params = SurveyVote.BaseDataModel.Body
  export type Result = UserLoadOneSurvey.Result
}
