import { MongoClient } from 'mongodb'

export const mongoHelper = {
  client: null as MongoClient,

  async connect (uri: string) {
    this.client = await MongoClient.connect(uri)
  },

  async disconnect () {
    await this.client.close()
  }
}
