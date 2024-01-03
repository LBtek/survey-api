import { type IController } from '@/presentation/protocols'
import { GuestLoadAllSurveysController } from '@/presentation/controllers'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeGuestLoadAllSurveysUsecase } from '@/main/factories/usecases/survey'

export const makeGuestLoadAllSurveysController = (): IController => {
  const controller = new GuestLoadAllSurveysController(makeGuestLoadAllSurveysUsecase())
  return makeLogControllerDecorator(controller)
}
