import { surveyForGuestExample } from '../../schemas'

export const guestLoadOneSurveyPath = {
  get: {
    tags: ['Enquetes'],
    summary: 'API para um convidado buscar uma enquete',
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
              $ref: '#/schemas/survey'
            },
            examples: {
              example01: {
                value: surveyForGuestExample.survey
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
