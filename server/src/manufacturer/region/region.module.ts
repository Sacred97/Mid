import { Module } from '@nestjs/common';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Region} from "./region.entity";
import {RedisCacheModule} from "../../redis-cache/redis-cache.module";

@Module({
  imports: [TypeOrmModule.forFeature([Region]), RedisCacheModule],
  exports: [RegionService],
  controllers: [RegionController],
  providers: [RegionService]
})
export class RegionModule {}
