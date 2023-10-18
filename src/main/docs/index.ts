import { loginPath, logoutByQueryPath, logoutPathGet, logoutPathPostAndPut, signUpPath, surveyPath } from './paths'
import { addSurveyParamsSchema, apiKeyAuthSchema, errorSchema, loginParamsSchema, loginResponseSchema, logoutParamsSchema, signUpParamsSchema, surveyAnswerSchema, surveySchema, surveysSchema } from './schemas'
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
    '/surveys': surveyPath
  },
  schemas: {
    signUpParams: signUpParamsSchema,
    logoutParams: logoutParamsSchema,
    loginParams: loginParamsSchema,
    loginResponse: loginResponseSchema,
    addSurveyParams: addSurveyParamsSchema,
    error: errorSchema,
    surveys: surveysSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema
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
