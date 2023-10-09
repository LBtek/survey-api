import { loginPath, signUpPath, surveyPath } from './paths'
import { accountSchema, apiKeyAuthSchema, errorSchema, loginParamsSchema, signUpParamsSchema, surveyAnswerSchema, surveySchema, surveysSchema } from './schemas'
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
    name: 'Login'
  }, {
    name: 'Enquete'
  }],
  paths: {
    '/login': loginPath,
    '/signup': signUpPath,
    '/surveys': surveyPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    signUpParams: signUpParamsSchema,
    error: errorSchema,
    surveys: surveysSchema,
    survey: surveySchema,
    surveyAnswers: surveyAnswerSchema
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
