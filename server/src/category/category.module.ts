import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Category} from "./category.entity";
import {ProductGroupModule} from "./product-group/product-group.module";
import {RedisCacheModule} from "../redis-cache/redis-cache.module";

@Module({
  imports: [TypeOrmModule.forFeature([Category]), ProductGroupModule, RedisCacheModule],
  exports: [CategoryService],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule {}
