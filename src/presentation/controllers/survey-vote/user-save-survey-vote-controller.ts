import { type UserSaveSurveyVote } from '@/domain/models'
import { type IUserSaveSurveyVote as IUserSaveSurveyVoteUsecase } from '@/domain/usecases/user-context'
import { type IController, type HttpResponse, type IValidation } from '@/presentation/protocols'
import { type ICheckSurveyContainsAnswerService } from '@/presentation/protocols/services'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/http-helper'

export class UserSaveSurveyVoteController implements IController {
  constructor (
    private readonly validation: IValidation,
    private readonly checkSurveyContainsAnswer: ICheckSurveyContainsAnswerService,
    private readonly userSaveSurveyVote: IUserSaveSurveyVoteUsecase
  ) { }

  async handle (request: UserSaveSurveyVote.Params): Promise<HttpResponse> {
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
      const survey = await this.userSaveSurveyVote.save(
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
