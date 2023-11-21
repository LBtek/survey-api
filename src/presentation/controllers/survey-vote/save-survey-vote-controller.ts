import { type SaveSurveyVote } from '@/domain/models'
import { type ISaveSurveyVote as ISaveSurveyVoteUsecase } from '@/domain/usecases/user-context'
import { type IController, type HttpResponse, type IValidation } from '@/presentation/protocols'
import { type ICheckSurveyContainsAnswerService } from '@/presentation/protocols/services'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/http-helper'

export class SaveSurveyVoteController implements IController {
  constructor (
    private readonly validation: IValidation,
    private readonly checkSurveyContainsAnswer: ICheckSurveyContainsAnswerService,
    private readonly useSaveSurveyVote: ISaveSurveyVoteUsecase
  ) { }

  async handle (request: SaveSurveyVote.Params): Promise<HttpResponse> {
    try {
      let error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { surveyId, answer, userId } = request
      error = await this.checkSurveyContainsAnswer.verify({ surveyId, answer })
      if (error) {
        return badRequest(error)
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
