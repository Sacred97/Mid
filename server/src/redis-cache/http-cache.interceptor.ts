import { CACHE_KEY_METADATA, CacheInterceptor, ExecutionContext, Injectable } from '@nestjs/common';
import {Request} from 'express'

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {

  trackBy(context: ExecutionContext): string | undefined {
    const cacheKey = this.reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler()
    )

    if (cacheKey) {
      const request: Request  = context.switchToHttp().getRequest()
      const params: boolean = !!Object.keys(request.params).length
      const query: boolean = !!Object.keys(request.query).length

      if (params && !query) {
        const paramsString = Object.entries(request.params)
            .map(i => i.join('='))
            .join('&')
        return `${cacheKey}-/:-${paramsString}`
      }

      if (query && !params) {
        const queryString = Object.entries(request.query)
            .map(i => i.join('='))
            .join('&')
        return `${cacheKey}-/?-${queryString}`
      }

      if (params && query) {
        const paramsString = Object.entries(request.params)
            .map(i => i.join('='))
            .join('&')
        const queryString = Object.entries(request.query)
            .map(i => i.join('='))
            .join('&')
        return `${cacheKey}-/:-${paramsString}-/?-${queryString}`
      }
    }

    return super.trackBy(context);
  }
}
