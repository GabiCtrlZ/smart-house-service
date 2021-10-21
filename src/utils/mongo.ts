import mongoose from 'mongoose'
import {
  MONGO_URI,
  MONGO_ALL_OPTIONS,
} from '../consts'
import logger from './logger'
import {
  ErrorHandlerType,
} from '../@types'

class MongoDB {
  mongoose: typeof mongoose

  // Variables From Developer:

  bufferCommands: boolean // set if mongoose will use buffer commands

  errorHandler?: null | ErrorHandlerType // custom function to use in case of an error

  constructor(errorHandler?: null | ErrorHandlerType, bufferCommands = false) {
    // mongoose setup
    this.mongoose = mongoose
    this.mongoose.Promise = global.Promise

    // setting options
    this.bufferCommands = bufferCommands

    // functions
    this.errorHandler = errorHandler
  }

  // handle mongoose error
  onMogooseError(errorHandler?: null | ErrorHandlerType): void {
    this.mongoose.connection.on('error', (err = null) => {
      if (errorHandler) errorHandler(err)
      else logger.error(err)
    })
  }

  // the connect function
  async connectDb():
  Promise<typeof mongoose | never> {
    this.mongoose.set('bufferCommands', this.bufferCommands)

    try {
      this.onMogooseError(this.errorHandler)

      await this.mongoose.connect(MONGO_URI, MONGO_ALL_OPTIONS)

      logger.info('connected successfully to the mongodb database')

      return this.mongoose
    } catch (e: any) {
      throw new Error(e)
    }
  }

  // disconnect function
  async disconnectDb():
  Promise<void | never> {
    try {
      await this.mongoose.disconnect()

      logger.info('disconnected from the mongodb database')
    } catch (e: any) {
      throw new Error(e)
    }
  }
}

const mongo = new MongoDB(null, true)

export default mongo
