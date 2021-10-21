import { v4 as uuid } from 'uuid'
import { mongo } from '../utils'
import { Example } from '../@types'

const { Schema, model } = mongo.mongoose

const exampleSchema = new Schema<Example>({
  _id: {
    type: String,
    default: uuid,
  },
  text: {
    type: String,
    default: '',
  },
})

export default model<Example>('example', exampleSchema)
