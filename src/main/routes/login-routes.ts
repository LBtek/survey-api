/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoginController, makeSignUpController, makeLogoutController } from '../factories/controllers'

const logout = adaptRoute(makeLogoutController())

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
  router.get('/logout', logout)
  router.get('/logout/:accessToken', logout)
  router.put('/logout', logout)
  router.put('/logout/:accessToken', logout)
  router.post('/logout', logout)
  router.post('/logout/:accessToken', logout)
}
