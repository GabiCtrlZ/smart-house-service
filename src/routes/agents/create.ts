import { RequestHandler } from 'express'
import Joi from 'joi'
import withSchema from '../../lib/with-schema'
import { logger } from '../../utils'
import { Agent } from '../../models'
import { StandardError, transformError } from '../../lib/error-handling'

const bodySchema = Joi.object().keys({
  type: Joi.string().required(),
  room: Joi.string().required(),
  uri: Joi.string().required(),
})

const create: RequestHandler = async (req, res) => {
  try {
    await withSchema(bodySchema, req, 'body')

    const {
      body: {
        type,
      },
    } = req

    logger.debug('make sure type is valid')

    if (type !== 'ac' && type !== 'light') {
      throw new StandardError('type can only be ac or light', 400)
    }

    const agent = new Agent({
      ...req.body,
      switched: new Date().toISOString(),
    })

    await agent.save()

    logger.debug('saved new agent')

    return res.status(200).json({
      agent,
    })
  } catch (error) {
    const e = transformError(error)

    logger.error(e.message, { stack: e.stack })

    return res.status(e.statusCode).json({
      message: e.message,
    })
  }
}

export default create
