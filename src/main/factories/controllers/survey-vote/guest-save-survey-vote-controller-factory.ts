import { type IController } from '@/presentation/protocols'
import { GuestSaveSurveyVoteController } from '@/presentation/controllers'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { ValidationComposite, ZodValidation } from '@/application/validation/validators'
import { guestSaveSurveyVoteZodValidation } from '@/infra/validators/zod-schemas'
import { makeSaveGuestUsecase } from '../../usecases/guest/save-guest-factory'
import { makeGuestSaveSurveyVoteUsecase } from '../../usecases/survey-vote/guest-save-survey-vote-factory'
import { makeCheckSurveyAnswerService } from '../../services/app-services'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-mongo-repository'

export const makeGuestSaveSurveyVoteController = (): IController => {
  const controller = new GuestSaveSurveyVoteController(
    new ValidationComposite([new ZodValidation(guestSaveSurveyVoteZodValidation)]),
    makeGuestSaveSurveyVoteUsecase(),
    makeCheckSurveyAnswerService(),
    makeSaveGuestUsecase(),
    new AccountMongoRepository()
  )
  return makeLogControllerDecorator(controller)
}
