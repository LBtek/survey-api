import { type SurveyVote } from '@/domain/entities'

export namespace SurveyVoteRepository {
  export namespace Save {
    export type Params = SurveyVote.Save.Params
    export type Result = { id: string } & SurveyVote.BaseDataModel.Body | null | undefined
  }
}

export interface UserSaveSurveyVoteRepository {
  save: (data: SurveyVoteRepository.Save.Params) => Promise<SurveyVoteRepository.Save.Result>
}
