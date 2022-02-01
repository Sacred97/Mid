import {Module} from '@nestjs/common';
import { PriceListController } from './price-list.controller';
import { PriceListService } from './price-list.service';
import {MailModule} from "../mail/mail.module";

@Module({
  imports: [MailModule],
  exports: [PriceListService],
  controllers: [PriceListController],
  providers: [PriceListService]
})
export class PriceListModule {}
