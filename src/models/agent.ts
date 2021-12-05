import { v4 as uuid } from 'uuid'
import { mongo } from '../utils'
import { Agent } from '../@types'

const { Schema, model } = mongo.mongoose

const agentSchema = new Schema<Agent>({
  _id: {
    type: String,
    default: uuid,
  },
  type: String,
  room: {
    type: String,
    default: '',
  },
  uri: {
    type: String,
    default: '',
  },
  switched: {
    type: String,
    default: '',
  },
  active: {
    type: Boolean,
    default: false,
  },
  online: {
    type: Boolean,
    default: false,
  },
})

export default model<Agent>('agent', agentSchema)
