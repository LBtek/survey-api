import { loginPath, logoutPathByQuery, logoutPathByParams, logoutPathPostAndPut, publisherAddSurveyPath, signUpPath, userLoadAllSurveysPath, userLoadOneSurveyPath, userSurveyVotePath } from './paths'
import { addSurveyParamsSchema, apiKeyAuthSchema, errorSchema, loginParamsSchema, loginResponseSchema, logoutParamsSchema, signUpParamsSchema, surveyAnswerForBasicUserSchema, surveyForBasicUserSchema, surveyIdParamSchema, surveyVoteParamsSchema, surveysForBasicUserSchema } from './schemas'
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
    '/publisher/surveys': publisherAddSurveyPath,
    '/user/surveys': userLoadAllSurveysPath,
    '/user/surveys/{surveyId}': { ...userLoadOneSurveyPath, ...userSurveyVotePath }
  },
  schemas: {
    signUpParams: signUpParamsSchema,
    logoutParams: logoutParamsSchema,
    loginParams: loginParamsSchema,
    loginResponse: loginResponseSchema,
    addSurveyParams: addSurveyParamsSchema,
    surveyVoteParams: surveyVoteParamsSchema,
    surveyIdParam: surveyIdParamSchema,
    surveyAnswerForBasicUser: surveyAnswerForBasicUserSchema,
    surveyForBasicUser: surveyForBasicUserSchema,
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
