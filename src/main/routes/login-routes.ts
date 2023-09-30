/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoginController, makeSignUpController, makeLogoutController } from '../factories/controllers'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
  router.get('/logout', adaptRoute(makeLogoutController()))
  router.get('/logout/:accessToken', adaptRoute(makeLogoutController()))
  router.post('/logout', adaptRoute(makeLogoutController()))
  router.post('/logout/:accessToken', adaptRoute(makeLogoutController()))
}
