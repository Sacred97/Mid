import { Module } from '@nestjs/common';
import { AutoApplicabilityController } from './auto-applicability.controller';
import { AutoApplicabilityService } from './auto-applicability.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AutoApplicability} from "./auto-applicability.entity";
import {RedisCacheModule} from "../redis-cache/redis-cache.module";

@Module({
  imports: [TypeOrmModule.forFeature([AutoApplicability]), RedisCacheModule],
  exports: [AutoApplicabilityService],
  controllers: [AutoApplicabilityController],
  providers: [AutoApplicabilityService]
})
export class AutoApplicabilityModule {}
