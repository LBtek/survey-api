/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeSaveSurveyVoteController } from '../factories/controllers'
import { authUser } from '../middlewares/auth'
import { zodValidation } from '../middlewares/zod-validation'
import { surveyVoteZodSchema } from '@/infra/validators/zod-schemas'
import { surveyIdSchema } from '@/infra/validators/zod-schemas/survey/common'
import { z } from 'zod'

const surveyVoteValidation = z.object({ surveyId: surveyIdSchema }).extend(surveyVoteZodSchema.shape)

export default (router: Router): void => {
  router.put('/user/surveys/:surveyId', zodValidation(surveyVoteValidation), authUser, adaptRoute(makeSaveSurveyVoteController()))
}
