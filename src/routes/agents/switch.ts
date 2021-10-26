import { RequestHandler } from 'express'
import Joi from 'joi'
import axios from 'axios'
import withSchema from '../../lib/with-schema'
import { logger } from '../../utils'
import { Agent } from '../../models'
import { transformError } from '../../lib/error-handling'

const bodySchema = Joi.object().keys({
  id: Joi.string().required(),
})

const get: RequestHandler = async (req, res) => {
  try {
    await withSchema(bodySchema, req, 'body')

    const {
      body: {
        id,
      },
    } = req

    logger.debug('querying database')

    const agent = await Agent.findOne({ _id: id }, { __v: 0 }).orFail().exec()

    const {
      uri,
    } = agent

    logger.debug('changing agent state')
    const answer = await axios({
      url: `${uri}/turn`,
      method: 'get',
      timeout: 5000,
    })

    agent.active = answer.data === 1
    agent.switched = new Date().toISOString()

    logger.debug('saving current state in db')
    await agent.save()

    return res.status(200).json({
      _id: id,
      active: agent.active,
      switched: agent.switched,
    })
  } catch (error) {
    const e = transformError(error)

    logger.error(e.message, { stack: e.stack })

    return res.status(e.statusCode).json({
      message: e.message,
    })
  }
}

export default get
