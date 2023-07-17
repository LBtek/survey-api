/* eslint-disable @typescript-eslint/no-misused-promises */
import { type HttpRequest } from './signup-controller-protocols'
import { SignUpController } from './signup-controller'
import { mockAddAccountParams } from '@/domain/models/mocks'
import { AddAccountSpy, AuthenticationSpy } from '@/domain/usecases/_mocks'
import { ValidationSpy } from '@/presentation/_mocks'
import { ok, serverError, badRequest, forbidden } from '@/presentation/helpers/http/http-helper'
import { EmailInUserError, MissingParamError, ServerError } from '@/presentation/errors'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import app from '@/main/config/app'
import request from 'supertest'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    ...mockAddAccountParams(),
    passwordConfirmation: 'any_password'
  }
})

type SutTypes = {
  sut: SignUpController
  addAccountSpy: AddAccountSpy
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const addAccountSpy = new AddAccountSpy()
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
    await sut.handle(makeFakeRequest())
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
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 200 if an valid data is provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(authenticationSpy.authenticationModel))
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut()
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validationSpy.input).toBe(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    await sut.handle(makeFakeRequest())
    const { email, password } = makeFakeRequest().body
    expect(authenticationSpy.authenticationData).toEqual({ email, password })
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountSpy } = makeSut()
    jest.spyOn(addAccountSpy, 'add').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const httpResponse = await sut.handle(makeFakeRequest())
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
