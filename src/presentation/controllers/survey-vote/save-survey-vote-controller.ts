import { type SaveSurveyVote } from '@/domain/models'
import { type SaveSurveyVote as SaveSurveyVoteUsecase } from '@/domain/usecases/user-context'
import { type Controller, type HttpResponse } from '@/presentation/protocols'
import { type ICheckSurveyContainsAnswerService } from '@/presentation/protocols/services'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'

export class SaveSurveyVoteController implements Controller {
  constructor (
    private readonly checkSurveyContainsAnswerService: ICheckSurveyContainsAnswerService,
    private readonly useSaveSurveyVote: SaveSurveyVoteUsecase
  ) { }

  async handle (request: SaveSurveyVote.Params): Promise<HttpResponse> {
    try {
      const { surveyId, answer, userId } = request
      const error = await this.checkSurveyContainsAnswerService.verify({ surveyId, answer })
      if (error) {
        return forbidden(error)
      }
      const survey = await this.useSaveSurveyVote.save(
        {
          userId,
          surveyId,
          answer,
          date: new Date()
        }
      )
      return ok(survey)
    } catch (error) {
      return serverError(error)
    }
  }
}
