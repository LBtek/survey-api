import 'module-alias/register'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { checkServerIsOk } from '@/infra/http/requests/check-server-is-ok'
import env from '@/main/config/env'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default

    app.listen(env.port, () => {
      console.log(`Server running at http://${env.apiHost}:${env.port}`)
      void checkServerIsOk.sendRequest()
    })
  })
  .catch(console.error)
