import { type SurveyVote } from '@/domain/entities'
import { type SaveSurveyVote } from '@/domain/models'

export namespace SurveyVoteRepository {
  export namespace Save {
    export type Params = SaveSurveyVote.Params
    export type Result = { id: string } & SurveyVote.BaseDataModel.Body | null | undefined
  }
}

export interface ISaveSurveyVoteRepository {
  save: (data: SurveyVoteRepository.Save.Params) => Promise<SurveyVoteRepository.Save.Result>
}
