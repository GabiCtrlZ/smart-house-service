import mongoose from 'mongoose'
import axios from 'axios'
import joi from 'joi'
import { TransformedError, TransformError } from '../@types'

class StandardError extends Error {
  statusCode: number

  constructor(message: string, statusCode?: number) {
    super(message)

    this.statusCode = statusCode ?? 500
  }
}

const transformError: TransformError = (e) => {
  const error = {} as TransformedError

  if (e instanceof joi.ValidationError) {
    // Joi withSchema()
    error.statusCode = 400
    error.message = JSON.stringify(e.details.map((obj) => obj.message))
  } else if (e instanceof mongoose.Error) {
    // Mongoose
    error.statusCode = 500
    error.message = 'An unexpected server error occurred'
  } else if (axios.isAxiosError(e)) {
    // Axios
    error.statusCode = Number(e.response?.status ?? 502)
    if (error.statusCode === 401 || error.statusCode === 403) {
      error.message = 'Unauthorized'
    } else {
      error.message = 'An unexpected gateway error occurred'
    }
  } else {
    error.statusCode = e?.statusCode ?? e?.status ?? 500
    error.message = e?.message ?? 'An unexpected server error occurred'
  }

  error.stack = e?.stack ?? 'Stack unavailable'

  return error
}

export {
  StandardError,
  transformError,
  TransformedError,
}
