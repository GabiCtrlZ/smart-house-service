import os from 'os'
import axios from 'axios'
import { logger } from '../utils'
import { Agent } from '../models'

const getRoom = (data: string) => data.split(':')[0] || 'unknown'
const getType = (data: string) => data.split(':')[1] || 'unknown'

const getLocalIps = () => {
  const interfaces = os.networkInterfaces()

  if (!interfaces) return []

  return Object.keys(interfaces).reduce((acc: string[], key) => {
    if (interfaces[key]) {
      const addresses = (interfaces[key] || []).filter(
        (address) => address.family === 'IPv4' && !address.internal,
      )

      return [...acc, ...addresses.map((address) => address.address)]
    }

    return acc
  }, [])
}

const findAgents = async (): Promise<void> => {
  const ips = getLocalIps()

  const agentsPromises = ips.map(async (ip) => {
    const uri = `http://${ip}`

    try {
      logger.debug('checking if ip is a known agent', { uri })

      const possibleAgent = await Agent.findOne({ uri }).lean().exec()

      if (possibleAgent) {
        logger.debug('ip is a known agent', { uri })

        return
      }

      logger.debug('checking if ip is an agent', { uri })

      const answer = await axios({
        url: `${uri}/who-am-i`,
        method: 'get',
        timeout: 5000,
      })

      const { status } = answer

      if (status !== 200) {
        logger.debug('ip is not an agent', { uri })

        return
      }

      const agent = new Agent({
        uri,
        room: getRoom(answer.data as string),
        type: getType(answer.data as string),
        switched: new Date().toISOString(),
      })

      logger.debug('agent is alive and active')
      await agent.save()
    } catch (error) {
      logger.debug('ip is not an agent', { uri })
    }
  })

  await Promise.all(agentsPromises)
}

export default findAgents
