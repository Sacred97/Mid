import { Module } from '@nestjs/common';
import { DetailsService } from './details.service';
import { DetailsController } from './details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Detail } from './entity/detail.entity';
import { PhotoDetail } from './entity/photoDetail.entity';
import { FilesModule } from '../files/files.module';
import {AdditionalVendorCode} from "./entity/additional-vendor-code.entity";
import {AlternativeName} from "./entity/alternative-name.entity";
import {ManufacturerModule} from "../manufacturer/manufacturer.module";
import {CategoryModule} from "../category/category.module";
import {ProductGroupModule} from "../category/product-group/product-group.module";
import {RedisCacheModule} from "../redis-cache/redis-cache.module";
import {KeyWordsModule} from "../key-words/key-words.module";
import {AutoApplicabilityModule} from "../auto-applicability/auto-applicability.module";
import {AutoPartsModule} from "../auto-parts/auto-parts.module";
import {OneCModule} from "../one-c/one-c.module";

@Module({
  imports: [TypeOrmModule.forFeature([
    Detail, PhotoDetail, AdditionalVendorCode, AlternativeName,
  ]), FilesModule, RedisCacheModule,
    ManufacturerModule, CategoryModule, ProductGroupModule,
    KeyWordsModule, AutoApplicabilityModule, AutoPartsModule, OneCModule],
  exports: [DetailsService],
  providers: [DetailsService],
  controllers: [DetailsController]
})
export class DetailsModule {}
