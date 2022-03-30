import { Module } from '@nestjs/common';
import { UsCertificateController } from './us-certificate.controller';
import { UsCertificateService } from './us-certificate.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Certificate} from "./entity/certificate.entity";
import {RedisCacheModule} from "../redis-cache/redis-cache.module";
import {FilesModule} from "../files/files.module";

@Module({
  imports: [TypeOrmModule.forFeature([Certificate]), RedisCacheModule, FilesModule],
  exports: [UsCertificateService],
  controllers: [UsCertificateController],
  providers: [UsCertificateService]
})
export class UsCertificateModule {}
