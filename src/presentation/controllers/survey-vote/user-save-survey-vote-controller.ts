import { type SurveyVote } from '@/domain/entities'
import { type UserSaveSurveyVote } from '@/domain/usecases/user-context'
import { type Controller, type HttpResponse } from '@/presentation/protocols'
import { type CheckSurveyContainsAnswerService } from '@/presentation/protocols/services'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'

export class UserSaveSurveyVoteController implements Controller {
  constructor (
    private readonly checkSurveyContainsAnswerService: CheckSurveyContainsAnswerService,
    private readonly useSaveSurveyVote: UserSaveSurveyVote
  ) { }

  async handle (request: SurveyVote.Save.Params): Promise<HttpResponse> {
    try {
      const { surveyId, answer, accountId } = request
      const error = await this.checkSurveyContainsAnswerService.verify({ surveyId, answer })
      if (error) {
        return forbidden(error)
      }
      const surveyVote = await this.useSaveSurveyVote.save(
        {
          accountId,
          surveyId,
          answer,
          date: new Date()
        }
      )
      return ok(surveyVote)
    } catch (error) {
      return serverError(error)
    }
  }
}
