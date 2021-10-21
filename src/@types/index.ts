import { ObjectSchema } from 'joi'
import {
  Application,
  Request,
} from 'express'

export interface Example {
  _id: string,
  text: string,
}

export type ErrorHandler = (
  event: 'uncaughtException' | 'uncaughtExceptionMonitor' | 'unhandledRejection' | 'beforeExit' | 'disconnect' | 'exit' | 'message' | 'multipleResolves' | 'rejectionHandled' | 'warning' | 'worker',
) => void

export type WithSchema = (schema: ObjectSchema, data: Record<any, any> | Request, dataPath: string) => Promise<void>

export type Init = (app: Application, callback: () => void, consts?: Record<any, any>) => void

export interface TransformedError {
  statusCode: number;
  type: string;
  code: string;
  message: string;
  stack: string;
  additionalInfo?: any;
}
export type TransformError = (e: any) => TransformedError

export type ErrorHandlerType = (err: Error) => void
