import {CacheModule, Module} from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
import * as redisStore from 'cache-manager-redis-store';
import {ConfigModule, ConfigService} from "@nestjs/config";

const CacheRegister = CacheModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    store: redisStore,
    host: configService.get('REDIS_HOST'),
    port: configService.get('REDIS_PORT'),
    ttl: 600
  })
})

@Module({
  imports: [CacheRegister],
  exports: [RedisCacheService, CacheRegister],
  providers: [RedisCacheService]
})
export class RedisCacheModule {}
