export const signUpPath = {
  post: {
    tags: ['Conta de Acesso'],
    summary: 'API para criar conta de um usuário',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/signUpParams'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/loginResponse'
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequest'
      },
      403: {
        $ref: '#/components/forbidden',
        description: 'Email in use'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
