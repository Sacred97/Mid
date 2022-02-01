import { HttpModule, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { Manager } from './entities/manager.entity';
import { DetailsModule } from '../details/details.module';
import { ShoppingCart } from './entities/shoppingCart.entity';
import { CartItem } from './entities/cartItem.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { MailModule } from '../mail/mail.module';
import {OneCModule} from "../one-c/one-c.module";
import {Company} from "./entities/company.entity";
import {Address} from "./entities/address.entity";
import {Subscriptions} from "./entities/subscriptions.entity";
import {NewsLetterModule} from "../news-letter/news-letter.module";
import {RequestHistory} from "./entities/request-history.entity";
import {WaitingList} from "./entities/waiting-list.entity";
import {WaitingItem} from "./entities/waiting-item.entity";

@Module({
  imports: [TypeOrmModule.forFeature([
      User, Company, Manager, Address, Subscriptions, RequestHistory,
    ShoppingCart, CartItem, Order, OrderItem, WaitingList, WaitingItem
  ]), DetailsModule, NewsLetterModule, MailModule, OneCModule, HttpModule],
  exports: [UsersService],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
