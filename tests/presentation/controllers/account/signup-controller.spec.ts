/* eslint-disable @typescript-eslint/no-misused-promises */
import { type AddUserAccount } from '@/domain/models'
import { SignUpController } from '@/presentation/controllers/account/signup-controller'
import { ValidationSpy } from '#/presentation/_mocks'
import { ok, serverError, badRequest, forbidden } from '@/presentation/helpers/http/http-helper'
import { EmailInUserError } from '@/domain/errors'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { mockAddAccountParams } from '#/domain/mocks/models'
import { AddUserAccountSpy } from '#/domain/mocks/usecases'
import { AuthenticationSpy } from '#/presentation/_mocks/services-mocks'
import app from '@/main/config/app'
import request from 'supertest'

const mockRequest = (): AddUserAccount.Params & { passwordConfirmation: string } => ({
  ...mockAddAccountParams(),
  passwordConfirmation: 'any_password'
})

type SutTypes = {
  sut: SignUpController
  addAccountSpy: AddUserAccountSpy
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const addAccountSpy = new AddUserAccountSpy()
  const validationSpy = new ValidationSpy()
  const sut = new SignUpController(addAccountSpy, validationSpy, authenticationSpy)
  return {
    sut,
    addAccountSpy,
    authenticationSpy,
    validationSpy
  }
}

describe('SignUp Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()
    await sut.handle(mockRequest())
    expect(addAccountSpy.addAccountData).toEqual({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountSpy } = makeSut()
    jest.spyOn(addAccountSpy, 'add').mockImplementationOnce(async () => {
      return await Promise.reject(new Error())
    })
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 200 if an valid data is provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(authenticationSpy.authenticationResult))
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toBe(request)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    await sut.handle(mockRequest())
    const { email, password } = mockRequest()
    expect(authenticationSpy.authenticationData).toEqual({ email, password })
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountSpy } = makeSut()
    jest.spyOn(addAccountSpy, 'add').mockReturnValueOnce(
      Promise.resolve(new EmailInUserError())
    )
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUserError()))
  })
})

describe('Express RouteAdapter', () => {
  test('Should adaptRoute() returns the error message if controller throws', async () => {
    const { sut: controller } = makeSut()
    app.post('/api/signup', adaptRoute(controller))

    await request(app)
      .post('/api/signup')
      .send({})
      .expect({
        error: 'Missing param: name'
      })
  })
})
