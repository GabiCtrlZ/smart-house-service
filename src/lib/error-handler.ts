import { ErrorHandler } from '../@types'
import { mongo, logger } from '../utils'

const errorHandler: ErrorHandler = (event) => {
  process.on(event, async (error) => {
    const message = JSON.stringify({ stack: error.stack, message: error.toString() })

    logger.error(`${event}, ${message}`)

    await mongo.disconnectDb()

    process.exit(1)
  })
}

export default errorHandler
