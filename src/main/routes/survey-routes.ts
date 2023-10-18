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
  router.post('/surveys', authPublisher, zodValidation(addSurveyZodSchema), adaptRoute(makePublisherAddSurveyController()))
  router.get('/surveys/:surveyId', zodValidation(userLoadOneSurveyZodSchema), authUser, adaptRoute(makeUserLoadOneSurveyController()))
  router.get('/surveys', authUser, adaptRoute(makeUserLoadAllSurveysController()))
}
