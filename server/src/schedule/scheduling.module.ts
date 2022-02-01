import { Module } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { UsersModule } from '../users/users.module';
import { DetailsModule } from '../details/details.module';
import {ManufacturerModule} from "../manufacturer/manufacturer.module";
import {RedisCacheModule} from "../redis-cache/redis-cache.module";

@Module({
  imports: [UsersModule, DetailsModule, ManufacturerModule, RedisCacheModule],
  exports: [],
  providers: [SchedulingService]
})
export class SchedulingModule {}
