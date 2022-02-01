import { Module } from '@nestjs/common';
import { BannersController } from './banners.controller';
import { BannersService } from './banners.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {RedisCacheModule} from "../redis-cache/redis-cache.module";
import {FilesModule} from "../files/files.module";
import {Banners} from "./entity/banners.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Banners]), RedisCacheModule, FilesModule],
  exports: [BannersService],
  controllers: [BannersController],
  providers: [BannersService]
})
export class BannersModule {}
