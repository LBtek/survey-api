import { loginPath } from './paths'
import { accountSchema, errorSchema, loginParamsSchema } from './schemas'
import { badRequest, serverError, unauthorized } from './components'

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
  }],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema
  },
  components: {
    serverError,
    badRequest,
    unauthorized
  }
}
