import { surveyForPublisherExample } from '../../schemas/survey-responses/publisher-survey-schema'

export const publisherAddSurveyPath = {
  post: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Enquetes'],
    summary: 'API para criar uma enquete',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/addSurveyParams'
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
}

export const publisherLoadSurveysPath = {
  get: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Enquetes'],
    summary: 'API para um publicador listar as suas enquetes',
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveysForPublisher'
            },
            examples: {
              example01: {
                value: [surveyForPublisherExample]
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

export const publisherLoadOneSurveyPath = {
  get: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Enquetes'],
    summary: 'API para um publicador buscar uma de suas enquetes',
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyForPublisher'
            },
            examples: {
              example01: {
                value: surveyForPublisherExample
              }
            }
          }
        }
      },
      204: {
        description: 'Nenhuma enquete encontrada'
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
