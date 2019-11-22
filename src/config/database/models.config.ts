import { SchemaOptions } from 'mongoose'

export const ModelsOptions: SchemaOptions = {
  timestamps: true,
  versionKey: false
}

export const SubModelOptions: SchemaOptions = {
  _id: false
}
