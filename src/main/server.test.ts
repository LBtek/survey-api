import request from 'supertest'
import app from './config/app'

describe('POST /signup', () => {
  test('Should return 200 on server ok', async () => {
    await request(app)
      .get('/api')
      .send()
      .expect(200)
  })
})
