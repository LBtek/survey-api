import { type IController } from '@/presentation/protocols'
import { UserLoadAllSurveysController } from '@/presentation/controllers'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeUserLoadAllSurveysUsecase } from '@/main/factories/usecases/survey'

export const makeUserLoadAllSurveysController = (): IController => {
  const controller = new UserLoadAllSurveysController(makeUserLoadAllSurveysUsecase())
  return makeLogControllerDecorator(controller)
}
