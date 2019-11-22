import * as utils from './CacheService.utils'
import { stub, restore } from 'sinon'
import { Logger } from '@nestjs/common'
import { version } from '../../../package.json'

describe('Cache utils', () => {
  describe('Service disable', () => {
    it('should return valid log', () => {
      stub(Logger, 'warn')
        .callsFake((message, context) => {
          return `[${context}] ${message}`
        })
      const response = utils.serviceDisabled(true)
      expect(typeof response).toEqual('string')
      restore()
    })
  })

  describe('Key generator', () => {
    it('should return valid key', () => {
      const className = 'className'
      const propertyName = 'propertyName'
      const args = ['a', 'b']

      const key = utils.generateKey(version, className, propertyName, args)
      const expected = `${version},${className},${propertyName},"a","b"`
      expect(key).toEqual(expected)
    })
  })

  describe('Redis', () => {
    it('should return true when all conditions is ok', () => {
      const client = {
        connected: true
      }
      const response = utils.redisIsAvailable(client)
      expect(response).toEqual(true)
    })

    it('should return false when is desconnected', () => {
      const client = {
        connected: false
      }
      const response = utils.redisIsAvailable(client)
      expect(response).toEqual(false)
    })

    it('should return false when is client doesn\'t exosts', () => {
      const client = null
      const response = utils.redisIsAvailable(client)
      expect(response).toEqual(false)
    })
  })

  describe('Try quit', () => {
    it('should return false when client doesn\'t exists', () => {
      const response = utils.tryQuit(null)
      expect(response).toEqual(false)
    })

    it('should return true when client exists', () => {
      let enterQuit = false
      const client = {
        quit: () => {
          enterQuit = true
        }
      }
      const response = utils.tryQuit(client)
      expect(response).toEqual(true)
      expect(enterQuit).toEqual(true)
    })

    it('should show service disable log', () => {
      let enterLogger = false
      stub(utils, 'serviceDisabled')
        .callsFake(() => {
          enterLogger = true
        })
      const client = {
        // tslint:disable-next-line
        quit: () => {}
      }
      const response = utils.tryQuit(client)
      expect(response).toEqual(true)
      expect(enterLogger).toEqual(true)
      restore()
    })
  })
})
