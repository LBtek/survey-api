import { type Collection, MongoClient, type InsertOneResult } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,

  async connect (uri: string) {
    this.client = await MongoClient.connect(uri)
  },

  async disconnect () {
    await this.client.close()
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },

  mapOneResult (result: InsertOneResult, restData: object): any {
    if (!result.acknowledged) {
      return null
    }
    return { id: result.insertedId.toString(), ...restData }
  }
}
