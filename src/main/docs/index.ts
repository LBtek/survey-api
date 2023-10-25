import { loginPath, logoutByQueryPath, logoutPathGet, logoutPathPostAndPut, publisherAddSurvey, signUpPath, userLoadAllSurveysPath, userLoadOneSurveyPath, userSurveyVotePath } from './paths'
import { addSurveyParamsSchema, apiKeyAuthSchema, errorSchema, loginParamsSchema, loginResponseSchema, logoutParamsSchema, signUpParamsSchema, surveyAnswerSchema, surveyIdParamSchema, surveySchema, surveyVoteParamsSchema, surveysSchema } from './schemas'
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
    '/logout/{accessToken}': logoutPathGet,
    '/logout?accessToken={accessToken}': logoutByQueryPath,
    '/publisher/surveys': publisherAddSurvey,
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
    surveys: surveysSchema,
    survey: surveySchema,
    surveyIdParam: surveyIdParamSchema,
    surveyAnswer: surveyAnswerSchema,
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
