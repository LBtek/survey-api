/* eslint-disable n/no-path-concat */
import { type Express, Router } from 'express'
import { readdirSync } from 'fs'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  readdirSync(`${__dirname}/../routes`).map(async file => {
    if (!file.includes('.test.') && !file.endsWith('.map') && !file.endsWith('.http')) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
  router.get('/', (req, res) => {
    res.json('ok')
  })
}
