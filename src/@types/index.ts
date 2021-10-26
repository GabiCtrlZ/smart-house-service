import { ObjectSchema } from 'joi'
import {
  Application,
  Request,
} from 'express'

export interface Agent {
  _id: string,
  type: 'ac' | 'light',
  room: string,
  active: boolean,
  switched: string,
  uri: string,
}

export type ErrorHandler = (
  event: 'uncaughtException' | 'uncaughtExceptionMonitor' | 'unhandledRejection' | 'beforeExit' | 'disconnect' | 'exit' | 'message' | 'multipleResolves' | 'rejectionHandled' | 'warning' | 'worker',
) => void

export type WithSchema = (schema: ObjectSchema, data: Record<any, any> | Request, dataPath: string) => Promise<void>

export type Init = (app: Application, callback: () => void, consts?: Record<any, any>) => void

export interface TransformedError {
  statusCode: number;
  message: string;
  stack: string;
}
export type TransformError = (e: any) => TransformedError

export type ErrorHandlerType = (err: Error) => void
