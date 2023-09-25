/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { ControllerSpy } from '#/presentation/_mocks'
import { adaptRoute } from '@/main/adapters/express-route-adapter'

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
})
