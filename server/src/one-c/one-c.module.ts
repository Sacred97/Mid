import {HttpModule, Module} from '@nestjs/common';
import { OneCController } from './one-c.controller';
import { OneCService } from './one-c.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AccessKeys} from "./entity/access-keys.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AccessKeys]), HttpModule],
  exports: [OneCService],
  controllers: [OneCController],
  providers: [OneCService]
})
export class OneCModule {}
