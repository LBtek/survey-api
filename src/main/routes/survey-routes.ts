/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import {
  makePublisherAddSurveyController,
  makeUserLoadOneSurveyController,
  makeUserLoadAllSurveysController,
  makePublisherLoadSurveysController,
  makeGuestLoadOneSurveyController
} from '../factories/controllers'
import { authUser, authPublisher } from '../middlewares/auth'

export default (router: Router): void => {
  router.post('/publisher/surveys', authPublisher, adaptRoute(makePublisherAddSurveyController()))
  router.get('/publisher/surveys', authPublisher, adaptRoute(makePublisherLoadSurveysController()))
  router.get('/guest/surveys/:surveyId', adaptRoute(makeGuestLoadOneSurveyController()))
  router.get('/user/surveys/:surveyId', authUser, adaptRoute(makeUserLoadOneSurveyController()))
  router.get('/user/surveys', authUser, adaptRoute(makeUserLoadAllSurveysController()))
}
