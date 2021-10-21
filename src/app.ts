import express from 'express'
import init from './lib/init-app'
import routes from './routes'

const app = express()

init(app, () => app.use('/', [], routes))

export default app
