import { loginPath, logoutPathByQuery, logoutPathByParams, logoutPathPostAndPut, publisherAddSurveyPath, publisherLoadSurveysPath, signUpPath, userLoadAllSurveysPath, userLoadOneSurveyPath, userSurveyVotePath, guestSurveyVotePath, guestLoadOneSurveyPath } from './paths'
import { addSurveyParamsSchema, apiKeyAuthSchema, errorSchema, guestSurveyVoteParamsSchema, guestSurveyVoteSchema, loginParamsSchema, loginResponseSchema, logoutParamsSchema, publisherSurveySchema, signUpParamsSchema, surveyAnswerForBasicUserSchema, surveyAnswerSchema, surveyForBasicUserSchema, surveyIdParamSchema, surveySchema, surveyVoteParamsSchema, surveysForBasicUserSchema } from './schemas'
import { badRequest, serverError, unauthorized, forbidden } from './components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node Api',
    description: 'API de enquetes',
    version: '1.0.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Conta de Acesso'
  }, {
    name: 'Enquetes'
  }],
  paths: {
    '/signup': signUpPath,
    '/login': loginPath,
    '/logout': logoutPathPostAndPut,
    '/logout/{accessToken}': logoutPathByParams,
    '/logout?accessToken={accessToken}': logoutPathByQuery,
    '/publisher/surveys': { ...publisherAddSurveyPath, ...publisherLoadSurveysPath },
    '/user/surveys': userLoadAllSurveysPath,
    '/user/surveys/{surveyId}': { ...userLoadOneSurveyPath, ...userSurveyVotePath },
    '/guest/surveys/{surveyId}': { ...guestSurveyVotePath, ...guestLoadOneSurveyPath }
  },
  schemas: {
    signUpParams: signUpParamsSchema,
    logoutParams: logoutParamsSchema,
    loginParams: loginParamsSchema,
    loginResponse: loginResponseSchema,
    addSurveyParams: addSurveyParamsSchema,
    surveyVoteParams: surveyVoteParamsSchema,
    guestSurveyVoteParams: guestSurveyVoteParamsSchema,
    guestSurveyVote: guestSurveyVoteSchema,
    surveyIdParam: surveyIdParamSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema,
    surveyAnswerForBasicUser: surveyAnswerForBasicUserSchema,
    surveyForBasicUser: surveyForBasicUserSchema,
    surveysForPublisher: publisherSurveySchema,
    surveysForBasicUser: surveysForBasicUserSchema,
    error: errorSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    serverError,
    badRequest,
    unauthorized,
    forbidden
  }
}
