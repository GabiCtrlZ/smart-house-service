import { RequestHandler } from 'express'
import Joi from 'joi'
import withSchema from '../../lib/with-schema'
import { logger } from '../../utils'
import { Agent } from '../../models'
import { transformError } from '../../lib/error-handling'

const paramsSchema = Joi.object().keys({
  id: Joi.string().required(),
})

const get: RequestHandler = async (req, res) => {
  try {
    await withSchema(paramsSchema, req, 'params')

    const {
      params: {
        id,
      },
    } = req

    logger.debug('querying database')

    const agent = await Agent.findOne({ _id: id }, { uri: 0, __v: 0 }).lean().orFail().exec()

    logger.debug('got agent object from db')

    return res.status(200).json(agent)
  } catch (error) {
    const e = transformError(error)

    logger.error(e.message, { stack: e.stack })

    return res.status(e.statusCode).json({
      message: e.message,
    })
  }
}

export default get
