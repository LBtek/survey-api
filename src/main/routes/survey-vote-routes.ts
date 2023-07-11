/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { auth } from '../middlewares/auth'
import { makeSaveSurveyVoteController } from '../factories/controllers/survey-vote/save-survey-vote/save-survey-vote-controller-factory'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSaveSurveyVoteController()))
}
