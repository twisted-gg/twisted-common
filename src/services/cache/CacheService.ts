import { Injectable } from '@nestjs/common'
import * as Redis from 'redis'
import * as utils from './CacheService.utils'

export interface ICacheServiceOptions {
  available: boolean
  url: string
  /**
   * Default expiration time
   */
  expiration: number
  version: string
}

export class CacheService {
  private client?: Redis.RedisClient

  constructor (private readonly options: ICacheServiceOptions) {
    if (this.options.available) {
      this.client = Redis.createClient({ url: this.options.url })
      this.client.on('error', () => utils.tryQuit(this.client))
    } else {
      utils.serviceDisabled()
    }
  }

  private getClient () {
    return this.client as Redis.RedisClient
  }

  async get<T> (key: string) {
    if (!utils.redisIsAvailable(this.client)) {
      return
    }
    const client = this.getClient()
    return new Promise<T>((resolve, reject) => {
      client.get(key, (err, result) => {
        if (err) {
          reject(err)
          return
        }
        const value = JSON.parse(result)
        resolve(value)
      })
    })
  }

  async set<T> (key: string, value: T, expiration?: number): Promise<void> {
    if (!utils.redisIsAvailable(this.client)) {
      return
    }
    const parsedValue = JSON.stringify(value)
    const client = this.getClient()
    return new Promise<void>((resolve, reject) => {
      client.setex(
        key,
        expiration || this.options.expiration,
        parsedValue,
        (err) => {
          if (err) reject(err)
          else resolve()
        })
    })
  }
}
