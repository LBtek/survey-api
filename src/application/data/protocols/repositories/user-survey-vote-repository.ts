import { type UserSurveyVote } from '@/domain/entities'
import { type UserSaveSurveyVote } from '@/domain/models'

export namespace UserSurveyVoteRepository {
  export namespace UserSaveVote {
    export type Params = UserSaveSurveyVote.Params
    export type Result = { id: string } & UserSurveyVote.BaseDataModel.Body | null | undefined
  }
}

export interface IUserSaveSurveyVoteRepository {
  userSaveVote: (data: UserSurveyVoteRepository.UserSaveVote.Params) => Promise<UserSurveyVoteRepository.UserSaveVote.Result>
}
