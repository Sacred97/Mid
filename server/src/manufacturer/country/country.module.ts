import { Module } from '@nestjs/common';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Country} from "./country.entity";
import {RegionModule} from "../region/region.module";
import {RedisCacheModule} from "../../redis-cache/redis-cache.module";

@Module({
  imports: [TypeOrmModule.forFeature([Country]), RegionModule, RedisCacheModule],
  exports: [CountryService],
  controllers: [CountryController],
  providers: [CountryService]
})
export class CountryModule {}
