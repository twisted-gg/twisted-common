import { Logger } from '@nestjs/common'
import { EnvEnum, CacheMessages } from '../../enum'

export function serviceDisabled (force?: boolean) {
  if (!force && process.env.NODE_ENV === EnvEnum.TEST) {
    return
  }
  return Logger.warn(
    CacheMessages.DISCONNECTED,
    CacheMessages.CONTEXT
  )
}

export function generateKey (version, className, propertyName, args) {
  const key =
    [
      version,
      className,
      propertyName,
      ...args.map(a => JSON.stringify(a))
    ].join()
  return key
}

export function redisIsAvailable (client: any) {
  return !!(client && client.connected)
}

export function tryQuit (client: any) {
  if (!client) {
    return false
  }
  client.quit()
  exports.serviceDisabled()
  return true
}
