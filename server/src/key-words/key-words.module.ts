import { Module } from '@nestjs/common';
import { KeyWordsController } from './key-words.controller';
import { KeyWordsService } from './key-words.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {RedisCacheModule} from "../redis-cache/redis-cache.module";
import {KeyWords} from "./key-words.entity";

@Module({
  imports: [TypeOrmModule.forFeature([KeyWords]), RedisCacheModule],
  exports: [KeyWordsService],
  controllers: [KeyWordsController],
  providers: [KeyWordsService]
})
export class KeyWordsModule {}
