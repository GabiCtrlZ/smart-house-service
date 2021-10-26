import { ErrorRequestHandler } from 'express'
import jwt from 'express-jwt'
import jwks from 'jwks-rsa'
import { AUTH0_AUDIENCE, AUTH0_ISSUER } from '../consts'
import logger from '../utils/logger'

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${AUTH0_ISSUER}.well-known/jwks.json`,
  }),
  audience: AUTH0_AUDIENCE,
  issuer: AUTH0_ISSUER,
  algorithms: ['RS256'],
})

const tokenError: ErrorRequestHandler = (err, req, res, next) => {
  if (err) {
    logger.error('got error with token', { error: err.toString() })

    return res.status(401).json({
      error: 'invalid token',
    })
  }

  return next()
}

export default [jwtCheck, tokenError]
