import { type ICheckSurveyContainsAnswerService, type CheckSurveyAnswerParams } from '@/presentation/protocols/services'
import { type ILoadSurveyByIdRepository } from '@/application/data/protocols/repositories'
import { InvalidParamError } from '@/presentation/errors'

export class CheckSurveyContainsAnswer implements ICheckSurveyContainsAnswerService {
  constructor (private readonly loadSurveyByIdRepository: ILoadSurveyByIdRepository) {}

  async verify (data: CheckSurveyAnswerParams): Promise<InvalidParamError> {
    const { surveyId, answer } = data
    const survey = await this.loadSurveyByIdRepository.loadById({ id: surveyId })
    if (survey) {
      const hasAnswer = survey.answers.some(a => a.answer === answer)
      if (!hasAnswer) {
        return new InvalidParamError('answer')
      }
    } else {
      return new InvalidParamError('surveyId')
    }
  }
}
