import 'module-alias/register'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { RedisClient } from '@/infra/db/in-memory/redis/RedisClient'
import { checkServerIsOk } from '@/infra/http/requests/check-server-is-ok'
import env from '@/main/config/env'

MongoHelper.connect(env.mongodb.url)
  .then(async () => {
    const app = (await import('./config/app')).default

    RedisClient.connect()
      .then(() => {
        app.listen(env.api.port, () => {
          console.log(`Server running at http://${env.api.host}:${env.api.port}`)
          void checkServerIsOk.sendRequest()
        })
      })
      .catch(console.error)
  })
  .catch(console.error)
