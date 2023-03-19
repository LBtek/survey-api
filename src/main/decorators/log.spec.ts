import { type Controller, type HttpRequest, type HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

describe('Log Controller Decorator', () => {
  const makeController = (): Controller => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
          statusCode: 200,
          body: {
            name: 'Rodrigo'
          }
        }
        return await new Promise(resolve => { resolve(httpResponse) })
      }
    }
    return new ControllerStub()
  }

  interface SutTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
  }

  const makeSut = (): SutTypes => {
    const controllerStub = makeController()
    const sut = new LogControllerDecorator(controllerStub)

    return {
      sut,
      controllerStub
    }
  }

  test('Should call controller handle with correct value', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
