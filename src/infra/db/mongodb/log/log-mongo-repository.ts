import { type LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class LogMongoRepository implements LogErrorRepository {
  async logError (stack: string, typeError: 'server' | 'auth'): Promise<void> {
    const collectionName = typeError + '_errors'
    const errorCollection = await MongoHelper.getCollection(collectionName)
    await errorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
