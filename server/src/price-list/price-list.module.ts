import {Module} from '@nestjs/common';
import { PriceListController } from './price-list.controller';
import { PriceListService } from './price-list.service';
import {MailModule} from "../mail/mail.module";
import {OneCModule} from "../one-c/one-c.module";

@Module({
  imports: [MailModule, OneCModule],
  exports: [PriceListService],
  controllers: [PriceListController],
  providers: [PriceListService]
})
export class PriceListModule {}
