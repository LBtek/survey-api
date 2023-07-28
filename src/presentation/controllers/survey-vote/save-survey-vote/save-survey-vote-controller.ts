import { type Controller, type HttpRequest, type HttpResponse, type SaveSurveyVote, type LoadSurveyByIdRepository } from './save-survey-vote-controller-protocols'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'

export class SaveSurveyVoteController implements Controller {
  constructor (
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
    private readonly saveSurveyVote: SaveSurveyVote
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const { accountId } = httpRequest
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId)
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
        }
      )
      return ok(surveyVote)
    } catch (error) {
      return serverError(error)
    }
  }
}
