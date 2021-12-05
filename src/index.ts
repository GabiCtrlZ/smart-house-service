import { Express } from 'express'
import listEndpoints from 'express-list-endpoints'
import app from './app'
import errorHandler from './lib/error-handler'
import { mongo, logger } from './utils'
import { PORT } from './consts'
import jobs from './cron-jobs'

const bootstrap = async (expressApp: Express) => {
  if (!PORT) {
    logger.error('missing port, unable to start express server')

    return process.exit(1)
  }

  await mongo.connectDb()
  await jobs.verifyAgentsHealth()

  return expressApp.listen(PORT, () => {
    logger.info(`server is up and running on ${PORT}`)
    logger.info(`application endpoints: ${JSON.stringify(listEndpoints(expressApp))}`)
  })
}

bootstrap(app)

errorHandler('uncaughtException')
errorHandler('unhandledRejection')
process.on('SIGINT', () => process.exit())
