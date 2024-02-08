import { type Express } from 'express'
import { serve, setup } from 'swagger-ui-express'
import { noCache } from '@/main/middlewares/no-cache'
import { resolve } from 'path'
import Handlebars from 'handlebars'
import documentationConfig from '@/main/docs'
import fs from 'fs'

Handlebars.registerHelper('link', function (text: string, url: string) {
  url = Handlebars.escapeExpression(url)
  text = Handlebars.escapeExpression(text)
  return new Handlebars.SafeString("<a href='" + url + "'>" + text + '</a>')
})

export default (app: Express): void => {
  app.use('/api-swagger-doc', noCache, serve, setup(documentationConfig))
  app.get('/api-documentation', noCache, (request, response) => {
    return response.send(JSON.stringify(documentationConfig))
  })
  app.use('/api-redoc', noCache, (req, response) => {
    const template = fs.readFileSync(`${resolve(__dirname, '../docs/redoc')}/index.hbs`, 'utf8')
    const compiled = Handlebars.compile(template)
    const url = `${req.protocol + '://' + req.get('host')}/api-documentation`
    const html = compiled({ url })
    return response.send(html)
  })
}
