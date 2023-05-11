/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { type Collection, MongoClient, type InsertOneResult, type WithId, type Document, type FindCursor } from 'mongodb'

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

  mapInsertOneResult (result: InsertOneResult<Document>, restData: object): any {
    const res = { id: result.insertedId.toString(), ...restData }
    if (res['_id']) {
      delete res['_id']
    }
    return res
  },

  mapOneDocumentWithId (result: WithId<Document>): any {
    const { _id, ...rest } = result
    return { id: _id.toString(), ...rest }
  },

  async mapManyDocumentsWithId (result: FindCursor<WithId<Document>>): Promise<any> {
    const documents = await result.toArray()
    return documents.map(doc => this.mapOneDocumentWithId(doc))
  }
}
