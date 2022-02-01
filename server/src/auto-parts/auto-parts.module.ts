import { Module } from '@nestjs/common';
import { AutoPartsController } from './auto-parts.controller';
import { AutoPartsService } from './auto-parts.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AutoParts} from "./auto-parts.entity";
import {RedisCacheModule} from "../redis-cache/redis-cache.module";

@Module({
  imports: [TypeOrmModule.forFeature([AutoParts]), RedisCacheModule],
  exports: [AutoPartsService],
  controllers: [AutoPartsController],
  providers: [AutoPartsService]
})
export class AutoPartsModule {}
