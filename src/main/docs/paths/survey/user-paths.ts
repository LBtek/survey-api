import { surveyForBasicUserExample } from '../../schemas'

export const userLoadOneSurveyPath = {
  get: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Enquetes'],
    summary: 'API para um usuário comum buscar uma enquete',
    parameters: [{
      name: 'surveyId',
      in: 'path',
      schema: {
        $ref: '#/schemas/surveyIdParam'
      },
      required: true
    }],
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
      204: {
        description: 'Nenhuma enquete encontrada'
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

export const userLoadAllSurveysPath = {
  get: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Enquetes'],
    summary: 'API para um usuário comum listar todas as enquetes',
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveysForBasicUser'
            },
            examples: {
              example01: {
                value: [surveyForBasicUserExample]
              }
            }
          }
        }
      },
      204: {
        description: 'Nenhuma enquete encontrada'
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
