import { RequestHandler } from 'express'
import Joi from 'joi'
import withSchema from '../lib/with-schema'
import { logger } from '../utils'
import { Example } from '../models'

const paramsSchema = Joi.object().keys({
  id: Joi.string().required(),
})

const get: RequestHandler = async (req, res) => {
  try {
    await withSchema(paramsSchema, req, 'params')

    const {
      params: {
        id: itemInternalId,
      },
    } = req

    logger.debug('querying database')

    const example = await Example.findOne({ _id: itemInternalId }).lean().orFail().exec()

    logger.debug('got example object from db')

    return res.status(200).json({
      example,
    })
  } catch (e: any) {
    logger.error(e.message, { stack: e.stack })

    return res.status(e.statusCode || 500).json({
      message: e.message,
    })
  }
}

export default get
