import { get, set } from 'lodash'
import { logger } from '../utils'
import { WithSchema } from '../@types'

const withSchema: WithSchema = async (schema, data, dataPath) => {
  logger.debug('validating schema')

  const validData = await schema.validateAsync(get(data, dataPath))

  logger.debug('schema validation success')

  set(data, dataPath, validData)
}

export default withSchema
