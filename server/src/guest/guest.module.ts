import { Module } from '@nestjs/common';
import { GuestController } from './guest.controller';
import { GuestService } from './guest.service';
import {MailModule} from "../mail/mail.module";
import {DetailsModule} from "../details/details.module";
import {OneCModule} from "../one-c/one-c.module";
import {UsersModule} from "../users/users.module";

@Module({
  imports: [MailModule, DetailsModule, OneCModule, UsersModule],
  exports: [GuestService],
  controllers: [GuestController],
  providers: [GuestService]
})
export class GuestModule {}
