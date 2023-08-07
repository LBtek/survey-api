import { type LogTypeError, type LogErrorRepository } from '@/application/data/protocols/repositories/log'
import { MongoHelper } from '../helpers/mongo-helper'

export class LogMongoRepository implements LogErrorRepository {
  async logError (stack: string, typeError: LogTypeError): Promise<void> {
    const collectionName = typeError + '_errors'
    const errorCollection = await MongoHelper.getCollection(collectionName)
    await errorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
