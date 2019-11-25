import { CacheServiceCommon } from './CacheService'
import { stub, restore } from 'sinon'
import { InternalServerErrorException } from '@nestjs/common'
import * as _ from 'lodash'
import * as utils from './CacheService.utils'

describe('CacheServiceCommon', () => {
  let service: CacheServiceCommon
  const plainOptions = { expiration: 0, available: false, url: '', version: '' }
  function forceAvailable (service, connected = true) {
    service.client = service.client || {}
    service.client.connected = connected
  }

  it('should show log when client is disable', async () => {
    let passByLogger = false
    stub(utils, 'serviceDisabled')
      .callsFake(() => {
        passByLogger = true
      })
    service = new CacheServiceCommon(plainOptions)
    const available = utils.redisIsAvailable(_.get(service, 'client'))
    expect(available).toEqual(false)
    expect(passByLogger).toEqual(true)
    restore()
  })

  describe('Get', () => {
    beforeEach(() => {
      restore()
    })

    it('should return mocked value', async () => {
      stub(service as any, 'getClient')
        .callsFake(() => ({
          get: (key: string, cb: Function) => {
            cb(null, key)
          }
        }))
      forceAvailable(service)
      const key = '123'
      const response = await service.get(key)
      expect(response).toEqual(+key)
    })

    it('should return undefined when service is disabled', async () => {
      stub(service as any, 'getClient')
        .callsFake(() => ({
          get: (key: string, cb: Function) => {
            cb(null, key)
          }
        }))
      forceAvailable(service, false)
      const key = '123'
      const response = await service.get(key)
      expect(response).toEqual(undefined)
    })

    it('should catch error when client return doesnt exists', () => {
      stub(service as any, 'getClient')
        .callsFake(() => ({
          get: (_, cb: Function) => {
            cb(new InternalServerErrorException())
          }
        }))
      forceAvailable(service)
      const key = '123'
      expect(service.get(key)).rejects.toBeInstanceOf(InternalServerErrorException)
    })
  })

  describe('Set', () => {
    beforeEach(() => {
      restore()
    })
    it('should set a value', async () => {
      const storage: any = {}
      stub(service as any, 'getClient')
        .callsFake(() => ({
          setex: (key: string, expiration: number, value: any, cb: Function) => {
            storage[key] = {
              value,
              expiration
            }
            cb()
          }
        }))
      forceAvailable(service)
      const key = '123'
      await service.set(key, 123)
      expect(storage[key].value).toEqual('123')
    })

    it('should set a value with expiration', async () => {
      const storage: any = {}
      stub(service as any, 'getClient')
        .callsFake(() => ({
          setex: (key: string, expiration: number, value: any, cb: Function) => {
            storage[key] = {
              value,
              expiration
            }
            cb()
          }
        }))
      forceAvailable(service)
      const key = '123'
      await service.set(key, 123, 1)
      expect(storage[key].value).toEqual('123')
      expect(storage[key].expiration).toEqual(1)
    })

    it('should doesn\'t set a value when response error', () => {
      const storage: any = {}
      stub(service as any, 'getClient')
        .callsFake(() => ({
          setex: (key: string, expiration: number, value: any, cb: Function) => {
            cb(new InternalServerErrorException())
          }
        }))
      forceAvailable(service)
      const key = '123'
      expect(service.set(key, 123)).rejects.toBeInstanceOf(InternalServerErrorException)
      expect(storage[key]).toEqual(undefined)
    })

    it('should doesn\'t set a value when redis is disable', async () => {
      const storage: any = {}
      stub(service as any, 'getClient')
        .callsFake(() => ({
          setex: (key: string, expiration: number, value: any, cb: Function) => {
            storage[key] = {
              value,
              expiration
            }
            cb()
          }
        }))
      forceAvailable(service, false)
      const key = '123'
      await service.set(key, 123)
      expect(storage[key]).toEqual(undefined)
    })
  })

  describe('Get client', () => {
    beforeEach(() => {
      restore()
    })
    it('should return client', () => {
      forceAvailable(service)
      const client = _.get(service, 'getClient').bind(service)()
      expect(client).toBeDefined()
    })
  })
})
