import {CACHE_MANAGER, Inject, Injectable} from '@nestjs/common';
import { Cache } from 'cache-manager'

@Injectable()
export class RedisCacheService {

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    }

    async deleteCacheKey(key: string) {
        const keys: string[] = await this.cacheManager.store.keys()
        keys.forEach(k => {
            if (k.startsWith(key)) {
                this.cacheManager.del(k)
            }
        })
    }

    async clearCache() {
        const keys: string[] = await this.cacheManager.store.keys()
        keys.forEach(key => {
            this.cacheManager.del(key)
        })
    }

}
