export default {
  port: process.env.PORT || 5050,
  apiHost: process.env.API_HOST || '127.0.0.1',
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUrl: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/clean-node-api',
  jwtSecret: process.env.JWT_SECRET || '--!@bC3$c$2B1a#-=='
}
