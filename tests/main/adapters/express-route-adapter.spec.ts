/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { ControllerSpy } from '#/presentation/_mocks'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { badRequest } from '@/presentation/helpers/http/http-helper'
import { MissingParamError } from '@/presentation/errors'
import app from '@/main/config/app'
import request from 'supertest'

describe('Express Route Adapter', () => {
  test('Should return newAccessToken if auth middleware refreshes the token', async () => {
    const controller = new ControllerSpy()
    const sut = adaptRoute(controller)
    const newAccessToken = 'new_access_token'
    const response: any = {
      _status: null as number,
      body: null as any,
      status: function (status: number) {
        this._status = status
        return this
      },
      json: function (data: any) { this.body = data }
    }
    await sut({ body: {}, newAccessToken } as any, response)
    expect(response.body.newAccessToken).toBeTruthy()
    expect(response.body.res).toBeTruthy()
    expect(response.body.newAccessToken).toBe(newAccessToken)
    expect(response.body.res).toEqual(controller.bodyResponse)

    controller.httpHelper = (data: any) => ({ statusCode: 204, body: null })
    await sut({ body: {}, newAccessToken } as any, response)
    expect(response._status).toBe(200)
    expect(response.body.newAccessToken).toBeTruthy()
    expect(response.body.res).toBeNull()
    expect(response.body.newAccessToken).toBe(newAccessToken)
  })

  test('Should adaptRoute() returns the error message if controller throws', async () => {
    const controller = new ControllerSpy()
    controller.httpHelper = badRequest
    controller.bodyResponse = new MissingParamError('any_field')
    app.post('/api/adapt-route-test', adaptRoute(controller))

    const result = await request(app)
      .post('/api/adapt-route-test')
      .send({})
      .expect(400)

    expect(result.body).toEqual({ error: new MissingParamError('any_field').message })
  })
})
