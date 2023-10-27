import { surveyForBasicUserExample } from '../schemas'

export const userSurveyVotePath = {
  put: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Enquetes'],
    summary: 'API para um usuário votar numa enquete',
    parameters: [{
      name: 'surveyId',
      in: 'path',
      schema: {
        $ref: '#/schemas/surveyIdParam'
      },
      required: true
    }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/surveyVoteParams'
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
              $ref: '#/schemas/surveyForBasicUser'
            },
            examples: {
              example01: {
                value: surveyForBasicUserExample
              }
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequest'
      },
      403: {
        $ref: '#/components/forbidden'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
