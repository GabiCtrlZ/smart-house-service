import express, {
  Request,
  Response,
  NextFunction,
} from 'express'
import compression from 'compression'
import morganBody from 'morgan-body'
import helmet from 'helmet'
import cors from 'cors'
import { logger } from '../utils'
import { Init } from '../@types'
import { DEV, JSON_LIMIT, WITHOUT_HELMET } from '../consts'

const init: Init = (app, callback) => {
  const allowedDomain = ['http://localhost:3000']

  app.use(cors({ origin: DEV ? '*' : allowedDomain }))
  app.use(compression())
  if (!WITHOUT_HELMET) app.use(helmet({ contentSecurityPolicy: false }))
  app.use(express.json({ limit: JSON_LIMIT }))
  app.use(express.urlencoded({ limit: JSON_LIMIT, extended: true }))

  app.get('/healthz', (req, res) => res.status(200).json())

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error('internal express error', { message: err.toString(), stack: err.stack })
    res.status(500).json()
    next()
  })

  if (DEV) morganBody(app, { skip: (req) => req.url === '/healthz' })

  callback()

  app.use('/*', (req, res) => res.status(404).json())
}

export default init
