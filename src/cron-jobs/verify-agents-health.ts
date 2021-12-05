/* eslint-disable no-param-reassign */
import axios from 'axios'
import { logger } from '../utils'
import { Agent } from '../models'

const verifyAgentsHealth = async (): Promise<void> => {
  const agents = await Agent.find({}).exec()

  logger.info(`Verifying ${agents.length} agents health`)
  const agentsHealthPromises = agents.map(async (agent) => {
    try {
      const {
        uri,
      } = agent

      logger.debug('checking agent health', uri)
      const answer = await axios({
        url: `${uri}/state`,
        method: 'get',
        timeout: 5000,
      })

      const { status } = answer

      if (status !== 200) {
        agent.online = false
        agent.active = false
        await agent.save()

        logger.debug(`agent ${agent._id} is offline`)

        return
      }

      agent.online = true
      agent.active = answer.data === 1

      logger.debug('agent is alive and active', uri)
      await agent.save()
    } catch (error) {
      logger.debug(`agent ${agent._id} is offline`)

      agent.online = false
      agent.active = false
      await agent.save()
    }
  })

  await Promise.all(agentsHealthPromises)
}

export default verifyAgentsHealth
