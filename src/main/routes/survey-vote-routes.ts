/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeUserSaveSurveyVoteController } from '../factories/controllers'
import { authUser } from '../middlewares/auth'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', authUser, adaptRoute(makeUserSaveSurveyVoteController()))
}
