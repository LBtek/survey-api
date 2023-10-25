const pathData = {
  security: [{
    apiKeyAuth: []
  }],
  tags: ['Conta de Acesso'],
  summary: 'API para deslogar o usuário',
  requestBody: {
    required: true,
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

export const logoutPathGet = {
  get: {
    ...pathData,
    parameters: [{
      name: 'accessToken',
      in: 'path',
      schema: {
        $ref: '#/schemas/logoutParams'
      }
    }],
    requestBody: null
  }
}

export const logoutByQueryPath = {
  get: {
    ...pathData,
    parameters: [{
      name: 'accessToken',
      in: 'query',
      schema: {
        $ref: '#/schemas/logoutParams'
      }
    }],
    requestBody: null
  }
}
