/* istanbul ignore file */

import { createClient } from 'redis'
import env from '@/main/config/env'

export const RedisClient = createClient({
  url: env.redis.url
})
  .on('error', err => { console.log('Redis Client Error', err) })
