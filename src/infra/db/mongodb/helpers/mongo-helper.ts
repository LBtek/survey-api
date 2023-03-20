import { type Collection, MongoClient, type InsertOneResult } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,

  async connect (uri: string) {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },

  async disconnect () {
    await this.client.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client || this.client.mongoLogger.connection === 'off') {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  },

  mapOneResult (result: InsertOneResult, restData: object): any {
    return { id: result.insertedId.toString(), ...restData }
  }
}
