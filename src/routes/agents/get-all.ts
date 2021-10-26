import { RequestHandler } from 'express'
import { logger } from '../../utils'
import { Agent } from '../../models'
import { transformError } from '../../lib/error-handling'

const getAll: RequestHandler = async (req, res) => {
  try {
    logger.debug('querying database')

    const agents = await Agent.find({}, { uri: 0, __v: 0 }).lean().exec()

    logger.debug('got agents from db')

    return res.status(200).json(agents)
  } catch (error) {
    const e = transformError(error)

    logger.error(e.message, { stack: e.stack })

    return res.status(e.statusCode).json({
      message: e.message,
    })
  }
}

export default getAll
