/* istanbul ignore file */

/* eslint-disable @typescript-eslint/no-misused-promises */

import { zodValidation } from '@/main/middlewares/zod-validation'
import { MissingParamError } from '@/presentation/errors'
import { logoutZodSchema } from '@/infra/validators/zod-schemas'
import app from '@/main/config/app'
import request from 'supertest'

describe('Zod Validation Middleware', () => {
  test('Should validate logout data with zodValidation', async () => {
    app.get('/logout-zod-validation', zodValidation(logoutZodSchema), (req, res) => {
      res.status(204).send()
    })
    app.get('/logout-zod-validation/:accessToken', zodValidation(logoutZodSchema), (req, res) => {
      res.status(204).send()
    })
    app.post('/logout-zod-validation', zodValidation(logoutZodSchema), (req, res) => {
      res.status(204).send()
    })
    app.put('/logout-zod-validation', zodValidation(logoutZodSchema), (req, res) => {
      res.status(204).send()
    })

    const result = await request(app)
      .get('/logout-zod-validation')
      .expect(400)

    expect(result.body).toEqual({ error: new MissingParamError('accessToken').message })

    await request(app)
      .get('/logout-zod-validation')
      .set('x-access-token', 'Any Token')
      .expect(204)

    await request(app)
      .get('/logout-zod-validation/any-token')
      .expect(204)

    await request(app)
      .post('/logout-zod-validation')
      .send({
        accessToken: 'Any Token'
      })
      .expect(204)

    await request(app)
      .put('/logout-zod-validation')
      .send({
        accessToken: 'Any Token'
      })
      .expect(204)

    const errorSchema = { parse: (obj: any) => { throw new Error() } } as any
    const logError = { logError: (stack: any, typeError: string): void => {} } as any

    app.get('/logout-zod-validation-error', zodValidation(errorSchema, logError), (req, res) => {
      res.send()
    })
    await request(app)
      .get('/logout-zod-validation-error')
      .expect(500)
  })
})
