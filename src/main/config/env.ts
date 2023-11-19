export default {
  nodeEnv: process.env.NODE_ENV || 'development',
  api: {
    port: process.env.PORT || 5050,
    host: process.env.API_HOST || '127.0.0.1',
    jwtSecret: process.env.JWT_SECRET || '--!@bC3$c$2B1a#-=='
  },
  mongodb: {
    url: process.env.MONGO_URL || 'mongodb://mongo:27017/survey-api'
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://default:AbcD1234@redis:6379'
  }
}
