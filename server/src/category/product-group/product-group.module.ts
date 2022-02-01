import { Module } from '@nestjs/common';
import { ProductGroupController } from './product-group.controller';
import { ProductGroupService } from './product-group.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProductGroup} from "./product-group.entity";
import {RedisCacheModule} from "../../redis-cache/redis-cache.module";

@Module({
  imports: [TypeOrmModule.forFeature([ProductGroup]), RedisCacheModule],
  exports: [ProductGroupService],
  controllers: [ProductGroupController],
  providers: [ProductGroupService]
})
export class ProductGroupModule {}
