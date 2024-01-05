import { type Account, type IP } from '@/application/entities'
import { type GuestSaveSurveyVote } from '@/domain/models'
import { type ISaveGuest as ISaveGuestUsecase, type IGuestSaveSurveyVote as IGuestSaveSurveyVoteUsecase } from '@/domain/usecases/guest-context'
import { type IValidation, type HttpResponse, type IController, type ICheckSurveyContainsAnswerService } from '@/presentation/protocols'
import { type ICheckUserAccountByEmailRepository } from '@/application/data/protocols/repositories'
import { type Email } from '@/domain/value-objects'
import { EmailInUseError } from '@/domain/errors'
import { AccessDeniedError } from '@/application/errors'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'

const checkEmail = async (checkUserAccountByEmailRepository: ICheckUserAccountByEmailRepository, email: string): Promise<Error> => {
  const exist = await checkUserAccountByEmailRepository.checkByEmail({ email })
  if (exist) {
    return new EmailInUseError()
  }
}

export class GuestSaveSurveyVoteController implements IController {
  constructor (
    private readonly validation: IValidation,
    private readonly guestSaveSurveyVote: IGuestSaveSurveyVoteUsecase,
    private readonly checkSurveyContainsAnswer: ICheckSurveyContainsAnswerService,
    private readonly saveGuest: ISaveGuestUsecase,
    private readonly checkUserAccountByEmailRepository: ICheckUserAccountByEmailRepository
  ) { }

  async handle (
    request: GuestSaveSurveyVote.Params &
    {
      ip: IP
      name: string
      email: Email
      userAgent: string
      guestAgentId: string | null
      role?: Account.BaseDataModel.Roles
    }
  ): Promise<HttpResponse> {
    try {
      if (request.role) return forbidden(new AccessDeniedError())
      let error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { surveyId, answer } = request

      const errors = await Promise.all([
        this.checkSurveyContainsAnswer.verify({ surveyId, answer }),
        checkEmail(this.checkUserAccountByEmailRepository, request.email)
      ])

      error = errors.find(error => error instanceof Error)
      if (error) {
        return badRequest(error)
      }

      const guest = await this.saveGuest.save(request)

      const survey = await this.guestSaveSurveyVote.save(
        {
          guestId: guest.guestId,
          guestAgentId: guest.guestAgentId,
          surveyId,
          answer,
          date: new Date()
        }
      )
      return ok({
        guest,
        survey
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
