import { accessTokenSchema } from '@/infra/validators/zod-schemas/account/common'
import { generateSchema } from '@anatine/zod-openapi'

const pathData = {
  security: [{
    apiKeyAuth: []
  }],
  tags: ['Conta de Acesso'],
  summary: 'API para deslogar o usuário',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/schemas/logoutParams'
        }
      }
    }
  },
  responses: {
    204: {
      description: 'Sucesso'
    },
    400: {
      $ref: '#/components/badRequest'
    },
    500: {
      $ref: '#/components/serverError'
    }
  }
}

export const logoutPathPostAndPut = {
  put: {
    ...pathData
  },
  post: {
    ...pathData
  }
}

const pathParams = [{
  name: 'accessToken',
  in: 'path',
  schema: generateSchema(accessTokenSchema())
}]

export const logoutPathByParams = {
  get: {
    ...pathData,
    parameters: pathParams,
    requestBody: null
  },
  post: {
    ...pathData,
    parameters: pathParams,
    requestBody: null
  },
  put: {
    ...pathData,
    parameters: pathParams,
    requestBody: null
  }
}

const queryParams = [{
  name: 'accessToken',
  in: 'query',
  schema: {
    $ref: '#/schemas/logoutParams'
  }
}]

export const logoutPathByQuery = {
  get: {
    ...pathData,
    parameters: queryParams,
    requestBody: null
  }
}
