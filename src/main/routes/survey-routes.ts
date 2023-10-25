/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import {
  makePublisherAddSurveyController,
  makeUserLoadOneSurveyController,
  makeUserLoadAllSurveysController
} from '../factories/controllers'
import { authUser, authPublisher } from '../middlewares/auth'
import { zodValidation } from '../middlewares/zod-validation'
import { addSurveyZodSchema, userLoadOneSurveyZodSchema } from '@/infra/validators/zod-schemas'

export default (router: Router): void => {
  router.post('/publisher/surveys', zodValidation(addSurveyZodSchema), authPublisher, adaptRoute(makePublisherAddSurveyController()))
  router.get('/user/surveys/:surveyId', zodValidation(userLoadOneSurveyZodSchema), authUser, adaptRoute(makeUserLoadOneSurveyController()))
  router.get('/user/surveys', authUser, adaptRoute(makeUserLoadAllSurveysController()))
}
