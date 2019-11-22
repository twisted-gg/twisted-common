import { Document } from 'mongoose'

export interface IBaseInterface extends Document {
  createdAt: Date
  updatedAt: Date
}
