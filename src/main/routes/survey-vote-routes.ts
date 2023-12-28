/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeUserSaveSurveyVoteController, makeGuestSaveSurveyVoteController } from '../factories/controllers'
import { authUser } from '../middlewares/auth'

export default (router: Router): void => {
  router.put('/user/surveys/:surveyId', authUser, adaptRoute(makeUserSaveSurveyVoteController()))
  router.put('/guest/surveys/:surveyId', adaptRoute(makeGuestSaveSurveyVoteController()))
}
