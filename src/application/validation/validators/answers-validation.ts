import { type Survey } from '@/domain/entities'
import { type Validation } from '@/presentation/protocols'
import { AnswerFormatError, AnswersInstanceTypeError } from '@/presentation/errors'

export class AnswersValidation implements Validation {
  validate (survey: Survey.PublisherAddSurvey.Params): Error {
    if (!(survey.answers instanceof Array)) {
      return new AnswersInstanceTypeError()
    }
    if (
      survey.answers.some(a => typeof a.answer !== 'string' || a.answer.trim() === '') ||
      survey.answers.some(a => a.image ? typeof a.image !== 'string' || a.image.trim() === '' : false)
    ) {
      return new AnswerFormatError()
    }
  }
}
