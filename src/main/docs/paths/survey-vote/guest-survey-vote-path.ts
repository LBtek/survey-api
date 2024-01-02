import { surveyForGuestExample } from '../../schemas'

export const guestSurveyVotePath = {
  put: {
    tags: ['Enquetes'],
    summary: 'API para um convidado votar numa enquete',
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
            $ref: '#/schemas/guestSurveyVoteParams'
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
              $ref: '#/schemas/guestSurveyVote'
            },
            examples: {
              example01: {
                value: surveyForGuestExample
              }
            }
          }
        }
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
