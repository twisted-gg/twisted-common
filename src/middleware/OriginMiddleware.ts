import { NestMiddleware, ForbiddenException } from '@nestjs/common'
import { Request } from 'express'
import { OriginMiddlewareEnum } from '../enum/OriginMiddleware.enum'

export class OriginMiddleware implements NestMiddleware {
  private isLocalhost (host: string) {
    let response = false
    for (const localhost of OriginMiddlewareEnum.LOCALHOST) {
      if (host.indexOf(localhost) === 0) {
        response = true
        break
      }
    }
    return response
  }

  private isAcceptanceHost (origin: string | undefined) {
    if (!origin) {
      return false
    }
    const index = origin.indexOf(OriginMiddlewareEnum.ACCEPTANCE_HOST)
    return index > -1 && index < 7
  }

  private isValidOrigin (origin: string | undefined, host: string): boolean {
    const isLocal = this.isLocalhost(host)
    const isAcceptanceHost = this.isAcceptanceHost(origin)
    if (isLocal || isAcceptanceHost) {
      return true
    }
    return false
  }

  use (req: Request, res: Response, next: Function) {
    const origin = req.headers.referer
    const host = req.hostname
    const isValid = this.isValidOrigin(origin, host)
    if (!isValid) {
      throw new ForbiddenException(OriginMiddlewareEnum.MESSAGE)
    }
    next()
  }
}
