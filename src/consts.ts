import { config } from 'dotenv'
import packagejson from '../package.json'

config()

const {
  LOGGER_LEVEL = 'info',
  PORT = 1337,
  MONGO_HOST,
  MONGO_DBNAME,
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_AUTHSOURCE,
  WITHOUT_HELMET = false,
  JSON_LIMIT = '5mb',
  DEV,
} = process.env

const SERVICE_NAME = `${packagejson.name}:${packagejson.version}`

const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

const MONGO_AUTH_OPTIONS = (() => {
  const options: { auth: any, authSource?: any } = {
    auth: {
      username: MONGO_USER,
      password: MONGO_PASSWORD,
    },
  }

  if (MONGO_AUTHSOURCE) {
    options.authSource = MONGO_AUTHSOURCE
  }

  return options
})()

const MONGO_URI = (() => {
  const URI = `mongodb://${MONGO_HOST}/${MONGO_DBNAME}`

  return URI
})()

const MONGO_ALL_OPTIONS = {
  ...MONGO_OPTIONS,
  ...MONGO_AUTH_OPTIONS,
}

export {
  PORT,
  MONGO_URI,
  MONGO_ALL_OPTIONS,
  LOGGER_LEVEL,
  SERVICE_NAME,
  WITHOUT_HELMET,
  JSON_LIMIT,
  DEV,
}
