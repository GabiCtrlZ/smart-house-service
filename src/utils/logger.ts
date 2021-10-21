import pino from 'pino'
import { LOGGER_LEVEL, SERVICE_NAME } from '../consts'

const PINO_OPTIONS = {
  level: LOGGER_LEVEL,
}

const logger = (pino(PINO_OPTIONS)).child({ service: SERVICE_NAME })

export default logger
