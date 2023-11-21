/* istanbul ignore file */

import { type PublisherAddSurvey } from '@/domain/models'
import { type IValidation } from '@/presentation/protocols'
import { AnswerFormatError, AnswersInstanceTypeError } from '@/presentation/errors'

/**
 * @deprecated
 * This class is not used anymore
 *
 * Now the zod library is used for this type of validation.
 */
export class AnswersValidation implements IValidation {
  validate (survey: PublisherAddSurvey.Params): Error {
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
