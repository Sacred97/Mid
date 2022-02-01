import {
  Body,
  Controller,
  Delete,
  Get, HttpCode, Param, ParseArrayPipe,
  Post,
  Put, Query,
  Req,
  UseGuards, UseInterceptors
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { UserUpdateDto } from './dto/user-update.dto';
import { UsersService } from './users.service';
import { ManagerCreateDto } from './dto/manager-create.dto';
import { ManagerUpdateDto } from './dto/manager-update.dto';
import { CartItemDto } from './dto/cart-item.dto';
import { OrderCreateDto } from './dto/order-create.dto';
import {ShoppingCart} from "./entities/shoppingCart.entity";
import {FindOneParams} from "../utils/params/findOneParams";
import {CompanyCreateDto} from "./dto/company-create.dto";
import {CompanyUpdateDto} from "./dto/company-update.dto";
import {AddressCreateDto} from "./dto/address-create.dto";
import {AddressUpdateDto} from "./dto/address-update.dto";
import {SubscriptionsCreateDto} from "./dto/subscriptions-create.dto";
import {SubscriptionsUpdateDto} from "./dto/subscriptions-update.dto";
import {RequestHistoryCreateDto} from "./dto/request-history-create.dto";
import {WaitingItemDto} from "./dto/waiting-item.dto";
import {WaitingListEmailsDto} from "./dto/waiting-list-emails.dto";
import {AdminGuard} from "../auth/guards/admin.guard";
import {SearchUserParams} from "../utils/params/search-user-params";
import {TransformToArrayInterceptor} from "../interceptors/transform-to-array.interceptor";
import {RequestHistoryUpdateDto} from "./dto/request-history-update.dto";

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('list')
  async adminGetUsers(@Query() {offset, email}: SearchUserParams) {
    return await this.usersService.getUserWithAdmin(offset, email)
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('list/:id')
  async adminDeleteUser(@Param() {id}: FindOneParams) {
    return await this.usersService.deleteUserWithAdmin(+id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getUserProfile(@Req() request: RequestWithUser) {
    return request.user
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateUserProfile(@Req() request: RequestWithUser, @Body() updateUserDto: UserUpdateDto) {
    return await this.usersService.updateUser(request.user.id, updateUserDto)
  }

  //---------------------------------------- Менеджеры (Managers)---------------------------------------------------------------

  @UseGuards(JwtAuthGuard)
  @Get('manager')
  async getAllUserManagers(@Req() request: RequestWithUser) {
    return this.usersService.getAllManagerOfUser(request.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('manager/:id')
  async getUserManager(@Req() request: RequestWithUser, @Param() {id}: FindOneParams) {
    return this.usersService.getManagerById(request.user.id, +id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('manager')
  async createUserManager(@Req() request: RequestWithUser, @Body() data: ManagerCreateDto) {
    return this.usersService.createManager(request.user, data)
  }

  @UseGuards(JwtAuthGuard)
  @Put('manager')
  async updateUserManager(@Req() request: RequestWithUser, @Body() data: ManagerUpdateDto) {
    return this.usersService.updateManager(request.user, data)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('manager/:id')
  async deleteUserManager(@Req() request: RequestWithUser, @Param() {id}: FindOneParams) {
    return this.usersService.deleteManager(request.user, +id)
  }

  //------------------------------------------------Организация (Company)----------------------------------------------------------

  @UseGuards(JwtAuthGuard)
  @Get('company')
  async getAllUserCompany(@Req() request: RequestWithUser) {
    return await this.usersService.getAllCompanyOfUser(request.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('company/:id')
  async getUserCompany(@Req() request: RequestWithUser, @Param() {id}: FindOneParams) {
    return await this.usersService.getCompanyByIdUser(request.user.id, +id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('company')
  async createUserCompany(@Req() request: RequestWithUser, @Body() data: CompanyCreateDto) {
    return await this.usersService.createCompanyUser(request.user, data)
  }

  @UseGuards(JwtAuthGuard)
  @Put('company')
  async updateUserCompany(@Req() request: RequestWithUser, @Body() data: CompanyUpdateDto) {
    return await this.usersService.updateCompanyUser(request.user, data)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('company/:id')
  async deleteUserCompany(@Req() request: RequestWithUser, @Param() {id}: FindOneParams) {
    return await this.usersService.deleteCompanyUser(request.user, +id)
  }

  //------------------------------------------------Адреса (Address)----------------------------------------------------------

  @UseGuards(JwtAuthGuard)
  @Get('address')
  async getAllUserAddress(@Req() request: RequestWithUser) {
    return await this.usersService.getAllAddressOfUser(request.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('address/:id')
  async getUserAddress(@Req() request: RequestWithUser, @Param() {id}: FindOneParams) {
    return await this.usersService.getAddressById(request.user.id, +id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('address')
  async createUserAddress(@Req() request: RequestWithUser, @Body() data: AddressCreateDto) {
    return await this.usersService.createAddress(request.user, data)
  }

  @UseGuards(JwtAuthGuard)
  @Put('address')
  async updateUserAddress(@Req() request: RequestWithUser, @Body() data: AddressUpdateDto) {
    return await this.usersService.updateAddress(request.user, data)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('address/:id')
  async deleteUserAddress(@Req() request: RequestWithUser, @Param() {id}: FindOneParams) {
    return await this.usersService.deleteAddress(request.user, +id)
  }

  //-----------------------------------------Подписка на рассылки (Subscriptions)---------------------------------------------

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin-subscription')
  async adminGetSubscribers() {
    return await this.usersService.getAllSubscribersByAdmin()
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('admin-subscription/:id')
  async adminDeleteSubscribers(@Param() {id}: FindOneParams) {
    return await this.usersService.removeSubscriptionByAdmin(+id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('subscription')
  async getAllUserSubscriptions(@Req() request: RequestWithUser) {
    return await this.usersService.getAllSubscriptionsOfUser(request.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('subscription/:id')
  async getUserSubscription(@Req() request: RequestWithUser, @Param() {id}: FindOneParams) {
    return await this.usersService.getSubscriptionById(request.user.id, +id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('subscription')
  async createUserSubscription(@Req() request: RequestWithUser, @Body() data: SubscriptionsCreateDto) {
    return await this.usersService.createSubscription(request.user, data)
  }

  @UseGuards(JwtAuthGuard)
  @Put('subscription')
  async updateUserSubscription(@Req() request: RequestWithUser, @Body() data: SubscriptionsUpdateDto) {
    return await this.usersService.updateSubscription(request.user, data)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('subscription/:id')
  async deleteUserSubscription(@Req() request: RequestWithUser, @Param() {id}: FindOneParams) {
    return await this.usersService.deleteSubscription(request.user, +id)
  }

  //-----------------------------------------История запросов (Request History)-----------------------------------------

  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getAllUserRequest(@Req() request: RequestWithUser) {
    return await this.usersService.getAllRequestHistoryOfUser(request.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('history')
  async addUserRequestInHistory(@Req() request: RequestWithUser, @Body() data: RequestHistoryCreateDto) {
    return await this.usersService.addRequestToHistory(request.user, data)
  }

  @UseGuards(JwtAuthGuard)
  @Put('history')
  async updateUserRequestInHistory(@Req() request: RequestWithUser, @Body() data: RequestHistoryUpdateDto) {
    return await this.usersService.updateRequestToHistory(request.user, data)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('history/:id')
  async deleteUserRequestFromHistory(@Req() request: RequestWithUser, @Param() {id}: FindOneParams) {
    return await this.usersService.deleteRequestFromHistory(request.user, +id)
  }

  //-----------------------------------Подписка на товары и Лист ожидания(WaitingList/WaitingItem)----------------------

  @UseGuards(JwtAuthGuard)
  @Get('waiting')
  async getWaitingList(@Req() request: RequestWithUser) {
    return await this.usersService.getWaitingListOfUser(request.user.waitingList.id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('waiting')
  async addItemInWaitingList(@Req() request: RequestWithUser, @Body() data: WaitingItemDto) {
    return await this.usersService.addWaitingItem(request.user, data)
  }

  @UseGuards(JwtAuthGuard)
  @Put('waiting')
  async changeEmailsForNotification(@Req() request: RequestWithUser, @Body() data: WaitingListEmailsDto) {
    return await this.usersService.changeEmailsForNotifications(request.user, data.emails)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('waiting/:id')
  async deleteWaitingItemFromList(@Req() request: RequestWithUser, @Param() {id}: FindOneParams) {
    return await this.usersService.deleteWaitingItem(request.user, +id)
  }

  //------------------------------------------------Корзина (ShoppingCart)---------------------------------------------------------

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransformToArrayInterceptor)
  @Post('shoppingCart')
  async addProduct(@Req() request: RequestWithUser,
                   @Body(new ParseArrayPipe({items: CartItemDto})) cartItem: CartItemDto[]) {
    const user = request.user
    let lastChanges: ShoppingCart
    for (let item of cartItem) {
      lastChanges = await this.usersService.createUpdateCartItem(user, item)
    }
    return lastChanges
  }

  @UseGuards(JwtAuthGuard)
  @Put('shoppingCart')
  async totalRecount(@Req() request: RequestWithUser) {
    return await this.usersService.recountAllPrices(request.user)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('shoppingCart/:id')
  async deleteCartItem(@Req() request: RequestWithUser, @Param() {id}: FindOneParams) {
    return this.usersService.deleteItemCart(request.user, +id)
  }

  //--------------------------------------------------Чистка корзины---------------------------------------------------------------

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('shoppingCartClean')
  async cleanBucket(@Req() request: RequestWithUser) {
    return await this.usersService.cleanShoppingCart(request.user)
  }

  //----------------------------------------Сформировать заказ (Order)-------------------------------------------------------------

  @UseGuards(JwtAuthGuard)
  @Post('order')
  async createUserOrder(@Req() request: RequestWithUser, @Body() data: OrderCreateDto) {
    return await this.usersService.makeOrder(request.user, data)
  }

}
