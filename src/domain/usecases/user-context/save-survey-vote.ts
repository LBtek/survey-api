import { type UserSaveSurveyVote as UserSaveSurveyVoteModel } from '@/domain/models'

export interface IUserSaveSurveyVote {
  save: (data: UserSaveSurveyVoteModel.Params) => Promise<UserSaveSurveyVoteModel.Result>
}
