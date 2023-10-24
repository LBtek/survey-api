import express, { type Express } from 'express'
import { serve, setup } from 'swagger-ui-express'
import { noCache } from '@/main/middlewares/no-cache'
import documentationConfig from '@/main/docs'
import { resolve } from 'path'

export default (app: Express): void => {
  app.use('/api-swagger-doc', noCache, serve, setup(documentationConfig))
  app.get('/openapi-documentation', noCache, (request, response) => {
    return response.send(JSON.stringify(documentationConfig))
  })
  app.use('/api-redoc', noCache, express.static(resolve(__dirname, '../docs/redoc')))
}
