import { Module } from '@nestjs/common';
import { ManufacturerController } from './manufacturer.controller';
import { ManufacturerService } from './manufacturer.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {CountryModule} from "./country/country.module";
import {FilesModule} from "../files/files.module";
import {Manufacturer} from "./entity/manufacturer.entity";
import {PhotoCertificate} from "./entity/photoCertificate.entity";
import {RedisCacheModule} from "../redis-cache/redis-cache.module";

@Module({
  imports: [TypeOrmModule.forFeature([Manufacturer, PhotoCertificate]),
    CountryModule, FilesModule, RedisCacheModule],
  exports: [ManufacturerService],
  controllers: [ManufacturerController],
  providers: [ManufacturerService]
})
export class ManufacturerModule {}
