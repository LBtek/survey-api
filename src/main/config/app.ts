import setupDocumentation from './config-documentation'
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'
import express from 'express'

const app = express()

setupDocumentation(app)
setupMiddlewares(app)
setupRoutes(app)

export default app
