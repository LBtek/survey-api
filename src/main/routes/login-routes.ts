/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoginController, makeSignUpController, makeLogoutController } from '../factories/controllers'
import { zodValidation } from '../middlewares/zod-validation'
import { loginZodSchema, logoutZodSchema, signUpZodSchema } from '@/infra/validators/zod-schemas'

const logout = adaptRoute(makeLogoutController())
const zodLogoutValidation = zodValidation(logoutZodSchema)

export default (router: Router): void => {
  router.post('/signup', zodValidation(signUpZodSchema), adaptRoute(makeSignUpController()))
  router.post('/login', zodValidation(loginZodSchema), adaptRoute(makeLoginController()))
  router.get('/logout', zodLogoutValidation, logout)
  router.get('/logout/:accessToken', zodLogoutValidation, logout)
  router.post('/logout', zodLogoutValidation, logout)
  router.post('/logout/:accessToken', zodLogoutValidation, logout)
}
