import { type LoadSurveyById, type Controller, type HttpRequest, type HttpResponse, type SaveSurveyVote } from './save-survey-vote-controller-protocols'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'

export class SaveSurveyVoteController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyVote: SaveSurveyVote
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const { accountId } = httpRequest
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (survey) {
        const answers = survey.answers.map(a => a.answer)
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'))
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }
      const surveyVote = await this.saveSurveyVote.save(
        {
          accountId,
          surveyId,
          answer,
          date: new Date()
        },
        survey
      )
      return ok(surveyVote)
    } catch (error) {
      return serverError(error)
    }
  }
}
