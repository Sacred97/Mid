import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from './user.entity';
import {ILike, Repository} from 'typeorm';
import * as bcrypt from 'bcrypt'
import {UserUpdateDto} from './dto/user-update.dto';
import {ManagerCreateDto} from './dto/manager-create.dto';
import {Manager} from './entities/manager.entity';
import {ManagerUpdateDto} from './dto/manager-update.dto';
import {DetailsService} from '../details/details.service';
import {ShoppingCart} from './entities/shoppingCart.entity';
import {CartItem} from './entities/cartItem.entity';
import {Order} from './entities/order.entity';
import {OrderItem} from './entities/orderItem.entity';
import {MailService} from '../mail/mail.service';
import {OrderItemsOneCInterface, OrderOneCInterface} from "../one-c/interfaces/orderOneC.interface";
import {OneCService} from "../one-c/one-c.service";
import {OrderCreateDto} from "./dto/order-create.dto";
import {Company} from "./entities/company.entity";
import {CompanyCreateDto} from "./dto/company-create.dto";
import {CompanyUpdateDto} from "./dto/company-update.dto";
import {CartItemDto} from "./dto/cart-item.dto";
import {OrderItemToMailInterface, OrderToMailInterface} from "../mail/interfaces/order-to-mail.interface";
import {Address} from "./entities/address.entity";
import {AddressCreateDto} from "./dto/address-create.dto";
import {AddressUpdateDto} from "./dto/address-update.dto";
import {GuestOrderInterface} from "../guest/interfaces/guest-order.interface";
import {GuestOrderItemsInterface} from "../guest/interfaces/guest-order-items.interface";
import {Subscriptions} from "./entities/subscriptions.entity";
import {NewsLetterService} from "../news-letter/news-letter.service";
import {SubscriptionsUpdateDto} from "./dto/subscriptions-update.dto";
import {SubscriptionsCreateDto} from "./dto/subscriptions-create.dto";
import {RequestHistoryCreateDto} from "./dto/request-history-create.dto";
import {RequestHistory} from "./entities/request-history.entity";
import {WaitingItemDto} from "./dto/waiting-item.dto";
import {WaitingList} from "./entities/waiting-list.entity";
import {WaitingItem} from "./entities/waiting-item.entity";
import {RegistrationUserDto} from "../auth/dto/registration-user.dto";
import {commentCreateString, convertingNumbersToDigits, customerCreateString} from "../utils/utils";
import {RequestHistoryUpdateDto} from "./dto/request-history-update.dto";
import {ChangeUserPasswordDto} from "./dto/change-user-password.dto";

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private userRepository: Repository<User>,
              @InjectRepository(Manager) private managerRepository: Repository<Manager>,
              @InjectRepository(Company) private companyRepository: Repository<Company>,
              @InjectRepository(Subscriptions) private subscriptionsRepository: Repository<Subscriptions>,
              @InjectRepository(RequestHistory) private requestHistoryRepository: Repository<RequestHistory>,
              @InjectRepository(Address) private addressRepository: Repository<Address>,
              @InjectRepository(ShoppingCart) private shoppingCartRepository: Repository<ShoppingCart>,
              @InjectRepository(CartItem) private cartItemRepository: Repository<CartItem>,
              @InjectRepository(Order) private orderRepository: Repository<Order>,
              @InjectRepository(OrderItem) private orderItemRepository: Repository<OrderItem>,
              @InjectRepository(WaitingList) private waitingListRepository: Repository<WaitingList>,
              @InjectRepository(WaitingItem) private waitingItemRepository: Repository<WaitingItem>,
              private readonly newsLetterService: NewsLetterService,
              private readonly detailsService: DetailsService,
              private readonly mailService: MailService,
              private readonly oneCService: OneCService) {
  }

  //------------------------------------------------CRUD Пользователь(User)--------------------------------------------------------

  async getUserWithAdmin(offset: number, query?: string) {
    if (query) {
      const [users, count] =  await this.userRepository.findAndCount({
        select: ['id', 'email'],
        where: {email: ILike(`%${query}%`), isAdmin: false},
        skip: 0,
        take: 20
      })
      return {users, count}
    }

    const [users, count] = await this.userRepository.findAndCount({
      select: ['id', 'email'],
      where: {isAdmin: false},
      skip: offset,
      take: 20
    })
    return {users, count}
  }

  async deleteUserWithAdmin(userId: number) {
    const user = await this.getById(userId)
    await this.userRepository.delete(user.id)
    await this.waitingListRepository.delete(user.waitingList.id)
    await this.shoppingCartRepository.delete(user.shoppingCart.id)
    return {message: 'Пользователь удален'}
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({email})
    if (user) {
      return user
    }
    throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND)
  }

  async getById(userId: number) {
    const user = await this.userRepository.findOne(userId, {relations: [
        'manager', 'company', 'shoppingCart', 'waitingList', 'address', 'subscriptions', 'order', 'requestHistory'
      ]})
    if (user) {
      return user
    }
    throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND)
  }

  async createUser(userData: RegistrationUserDto) {
    const newUser = await this.userRepository.create({
      ...userData,
      waitingList: {emails: userData.email},
      shoppingCart: {totalCost: 0, totalWeight: 0}
    })
    return await this.userRepository.save(newUser)
  }

  async updateUser(id: number, userData: UserUpdateDto) {
    await this.userRepository.update(id, {...userData, isAdmin: false})
    return await this.userRepository.findOne(id)
  }

  async newEmail(newEmail): Promise<boolean> {
    const user = await this.userRepository.findOne({email: newEmail})
    return !user
  }

  async changeUserEmail(newEmail: string, userId: number) {
    const isBusy: boolean = !!(await this.userRepository.findOne({email: newEmail}))
    if (isBusy) throw new HttpException('Email уже занят, выберите другой', HttpStatus.CONFLICT)
    await this.userRepository.update(userId, {email: newEmail})
  }

  async verifyUser(user: User) {
    await this.userRepository.update(user.id, {emailVerified: true})
  }

  async restorePasswordTokenSave(user: User, token: string) {
    await this.userRepository.update(user.id, {restorePasswordToken: token})
  }

  async newUserPassword(user: User, hashedPassword: string) {
    await this.userRepository.update(user.id, {password: hashedPassword, restorePasswordToken: null})
  }

  async changeUserPassword(user: User, data: ChangeUserPasswordDto) {
    const userCredential = await this.getById(user.id)
    const passwordMatching = await bcrypt.compare(data.currentPassword, userCredential.password)
    if (!passwordMatching) {
      throw new HttpException('Старый пароль не верный', HttpStatus.FORBIDDEN)
    }
    const newHashedPassword = await bcrypt.hash(data.newPassword, 10)
    await this.userRepository.update(user.id, {password: newHashedPassword})
    return await this.getById(user.id)
  }

  //--------------------------------------------Работа с токенами обновления (Refresh token)---------------------------------------

  async getUserIfTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId)
    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.currentHashedRefreshToken)
    if (isRefreshTokenMatching) {
      return user
    }
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10)
    await this.userRepository.update(userId, {currentHashedRefreshToken})
  }

  async removeRefreshToken(userId: number) {
    return this.userRepository.update(userId, {
      currentHashedRefreshToken: null
    })
  }

  //-------------------------------------------Чистка пользователей, которые не подтвердили почту-----------------------------------

  async deleteNotVerifiedUsers() {
    const usersNotVerified = await this.userRepository.find({where: {emailVerified: false}})
    if (usersNotVerified.length === 0) return
    const usersOnDelete = usersNotVerified.filter((user) => {
      const endLife: number = new Date(user.dateOfCreateAccount).getTime() + 1000*3600*24
      return Date.now() >= endLife
    })
    if (usersOnDelete.length>0) await this.userRepository.remove(usersOnDelete)
  }

  //---------------------------------------------------CRUD по Менеджерам(Manager)-------------------------------------------------

  async getAllManagerOfUser(userId: number) {
    return await this.managerRepository.find({where: {user: {id: userId}}})
  }

  async getManagerById(userId: number, id:number) {
    return await this.managerRepository.findOne(id, {where: {user: {id: userId}}})
  }

  async createManager(user: User, manager: ManagerCreateDto) {
    const newManager = await this.managerRepository.create({
      ...manager,
      user: user
    })
    await this.managerRepository.save(newManager)
    return await this.getAllManagerOfUser(user.id)
  }

  async updateManager(user: User, updateManager: ManagerUpdateDto) {
    const manager = await this.managerRepository.findOne(updateManager.id, {where: {user: {id: user.id}}})
    if (manager) {
      const emails: string[] = user.waitingList.emails.split(';')
      const index: number = emails.findIndex(e => e === manager.email)
      if (index !== -1) {
        emails[index] = updateManager.email
        await this.changeEmailsForNotifications(user, emails.join(';'))
      }
      await this.managerRepository.update(updateManager.id, updateManager)
      return await this.getAllManagerOfUser(user.id)
    }
    throw new HttpException("Менеджер не найден", HttpStatus.NOT_FOUND)
  }

  async deleteManager(user: User, id: number) {
    const manager = await this.managerRepository.findOne(id,  {where: {user: {id: user.id}}})
    if (manager) {
      const emails: string[] = user.waitingList.emails.split(';')
      if (emails.includes(manager.email)) {
        const newEmails: string[] = emails.filter(email => email !== manager.email)
        await this.changeEmailsForNotifications(user, newEmails.join(';'))
      }
      await this.managerRepository.delete(id)
      return await this.getAllManagerOfUser(user.id)
    }
    throw new HttpException("Менеджер не найден", HttpStatus.NOT_FOUND)
  }

  //-----------------------------------------------CRUD Адрес (Address)-------------------------------------------------------------

  async getAllAddressOfUser(userId: number) {
    return await this.addressRepository.find({where: {user: {id: userId}}})
  }

  async getAddressById(userId: number, id: number) {
    return await this.addressRepository.findOne(id, {where: {user: {id: userId}}})
  }

  async createAddress(user: User, addressData: AddressCreateDto) {
    if (addressData.isMain) {
      for (let a of user.address) {
        await this.addressRepository.update(a.id, {isMain: false})
      }
    }

    const newAddress = await this.addressRepository.create({...addressData, user: user})
    await this.addressRepository.save(newAddress)
    return this.getAllAddressOfUser(user.id)
  }

  async updateAddress(user: User, addressData: AddressUpdateDto) {
    const address = await this.addressRepository.findOne(addressData.id)
    if (address) {
      if (addressData.isMain) {
        for (let a of user.address) {
          await this.addressRepository.update(a.id, {isMain: false})
        }
      }
      await this.addressRepository.update(addressData.id, addressData)
      return await this.getAllAddressOfUser(user.id)
    }
    throw new HttpException("Адрес не найден", HttpStatus.NOT_FOUND)
  }

  async deleteAddress(user: User, id: number) {
    const address = await this.addressRepository.findOne(id)
    if (address) {
      await this.addressRepository.delete(id)
      return await this.getAllAddressOfUser(user.id)
    }
    throw new HttpException("Адрес не найден", HttpStatus.NOT_FOUND)
  }

  //----------------------------------CRUD Подписки на рассылки (Subscriptions)-----------------------------------------------

  async getAllSubscribersByAdmin() {
    return await this.subscriptionsRepository.find({relations: ['user']})
  }

  async removeSubscriptionByAdmin(id: number) {
    const sub = await this.subscriptionsRepository.findOne(id)
    if (sub) {
      await this.subscriptionsRepository.delete(id)
      return await this.getAllSubscribersByAdmin()
    }
    throw new HttpException('Подписка не найдена', HttpStatus.NOT_FOUND)
  }

  async getAllSubscriptionsOfUser(userId: number) {
    return await this.subscriptionsRepository.find({where: {user: {id: userId}}})
  }

  async getSubscriptionById(userId: number, id: number) {
    return await this.subscriptionsRepository.findOne(id,{where: {user: {id: userId}}})
  }

  async createSubscription(user: User, subscriptionsData: SubscriptionsCreateDto) {
    const newsLetter = await this.newsLetterService.getById(subscriptionsData.newsLetterId)
    const newSubscription = await this.subscriptionsRepository.create({
      ...subscriptionsData,
      user: user,
      newsLetter: newsLetter})
    await this.subscriptionsRepository.save(newSubscription)
    return await this.getAllSubscriptionsOfUser(user.id)
  }

  async updateSubscription(user: User, subscriptionData: SubscriptionsUpdateDto) {
    const subscription = await this.subscriptionsRepository.findOne(subscriptionData.id)
    if (subscription) {
      if (subscriptionData.newsLetterId) {
        const newsLetter = await this.newsLetterService.getById(subscriptionData.newsLetterId)
        Object.assign(subscriptionData, {newsLetter: newsLetter})
        delete subscriptionData.newsLetterId
      }
      await this.subscriptionsRepository.update(subscriptionData.id, subscriptionData)
      return await this.getAllSubscriptionsOfUser(user.id)
    }
    throw new HttpException('Подписка на рассылку не найдена', HttpStatus.NOT_FOUND)
  }

  async deleteSubscription(user: User, id: number) {
    const subscription = await this.subscriptionsRepository.findOne(id)
    if (subscription) {
      await this.subscriptionsRepository.delete(id)
      return await this.getAllSubscriptionsOfUser(user.id)
    }
    throw new HttpException('Подписка на рассылку не найдена', HttpStatus.NOT_FOUND)
  }

  //------------------------------------CRUD История запросов(RequestHistory)--------------------------------------------------

  async getAllRequestHistoryOfUser(userId: number) {
    return await this.requestHistoryRepository.find({where: {user: {id: userId}}})
  }

  async addRequestToHistory(user: User, requestData: RequestHistoryCreateDto) {
    const newRequestString = await this.requestHistoryRepository.create({...requestData, user: user})
    await this.requestHistoryRepository.save(newRequestString)
    return await this.getAllRequestHistoryOfUser(user.id)
  }

  async updateRequestToHistory(user: User, data: RequestHistoryUpdateDto) {
    const request = await this.requestHistoryRepository.findOne(data.id, {relations: ['user']})
    if (request) {
      if (request.user.id === user.id) {
        await this.requestHistoryRepository.update(data.id, {...data})
        return await this.getAllRequestHistoryOfUser(user.id)
      }
      throw new HttpException('Изменение запрещено', HttpStatus.FORBIDDEN)
    }
    throw new HttpException('Поисковый запрос не найден', HttpStatus.NOT_FOUND)
  }

  async deleteRequestFromHistory(user: User, id: number) {
    const requestString = await this.requestHistoryRepository.findOne(id)
    if (requestString) {
      await this.requestHistoryRepository.delete(id)
      return await this.getAllRequestHistoryOfUser(user.id)
    }
    throw new HttpException('Такого запроса не было', HttpStatus.NOT_FOUND)
  }

  async clearOldRequestString() {
    const requestString = await this.requestHistoryRepository.find()
    const onDeleteRequest: RequestHistory[] = requestString
        .filter((request) => {
          const endLife: number = new Date(request.requestDate).getTime() + (1000 * 3600 * 24 * 30)
          return Date.now() >= endLife
        })
    await this.requestHistoryRepository.remove(onDeleteRequest)
  }

  //-----------------------------------CRUD Организаций пользователя (Company)-------------------------------------------------

  async getAllCompanyOfUser(userId: number) {
    return await this.companyRepository.find({where: {user: {id: userId}}})
  }

  async getCompanyByIdUser(userId: number, id: number) {
    return await this.companyRepository.findOne(id, {where: {user: {id: userId}}})
  }

  async createCompanyUser(user: User, companyData: CompanyCreateDto) {
    const newCompany = await this.companyRepository.create({
      ...companyData,
      user: user
    })
    await this.companyRepository.save(newCompany)
    return await this.getAllCompanyOfUser(user.id)
  }

  async updateCompanyUser(user: User, companyData: CompanyUpdateDto) {
    const company = await this.companyRepository.findOne(companyData.id)
    if (company) {
      await this.companyRepository.update(companyData.id, companyData)
      return await this.getAllCompanyOfUser(user.id)
    }
    throw new HttpException("Организация не найдена", HttpStatus.NOT_FOUND)
  }

  async deleteCompanyUser(user: User, id: number) {
    const company = await this.companyRepository.findOne(id)
    if (company) {
      await this.companyRepository.delete(id)
      return await this.getAllCompanyOfUser(user.id)
    }
    throw new HttpException("Организация не найдена", HttpStatus.NOT_FOUND)
  }

  //------------------------------------------Подписка на товары (WaitingItem)-----------------------------------------------------------

  async getWaitingListOfUser(listId: number) {
    return await this.waitingListRepository.findOne(listId)
  }

  async addWaitingItem(user: User, itemData: WaitingItemDto) {
    const detail = await this.detailsService.getDetailById(itemData.detailId, user.isAdmin)
    if (!detail) throw new HttpException('Товар не найден', HttpStatus.NOT_FOUND)

    const max: number = Math.max(detail.storageGES, detail.storageOrlovka, detail.storageGarage2000)
    if (max >= 0) throw new HttpException('Невозможно подписаться на товар который есть в наличии',
        HttpStatus.BAD_REQUEST)

    const newWaitingItem = await this.waitingItemRepository.create({detail: detail, waitingList: user.waitingList})
    await this.waitingItemRepository.save(newWaitingItem)
    return await this.getWaitingListOfUser(user.waitingList.id)
  }

  async deleteWaitingItem(user: User, id: number) {
    const waitingItem = await this.waitingItemRepository.findOne(id)
    const candidate = user.waitingList.waitingItem.find(wi => wi.id === id)
    if (waitingItem && candidate) {
      await this.waitingItemRepository.delete(id)
      return this.getWaitingListOfUser(user.waitingList.id)
    }
    throw new HttpException('Товар не найден в списке ожидания', HttpStatus.NOT_FOUND)
  }

  async changeEmailsForNotifications(user: User, emails: string) {
    await this.waitingListRepository.update(user.waitingList.id, {emails: emails})
    return await this.getWaitingListOfUser(user.waitingList.id)
  }

  async notificationOfAdmission() {
    const lists = await this.waitingListRepository.find()
    if (!lists.length) return

    for (const list of lists) {
      let data: {emails: string[], items: {id: string, name: string, vendorCode: string, price: string, url: string}[]} = {
        emails: [], items: []
      }
      let onDelete: number[] = []

      for (const item of list.waitingItem) {
        const max: number = Math.max(item.detail.storageGES, item.detail.storageOrlovka, item.detail.storageGarage2000)
        if (max === -10) continue;
        const detail = await this.detailsService.getDetailById(item.detail.id)
        const photo = detail.photoDetail.find(i => i.isMain)
        const url = photo ? photo.url : ''
        const price = new Intl.NumberFormat('ru-RU', {
          currency: 'rub',
          style: 'currency'
        }).format(item.detail.price)
        data.items.push({id: detail.id, name: detail.name, vendorCode: detail.vendorCode, price: price, url: url})
        onDelete.push(item.id)
      }

      if (onDelete.length > 0) {
        data.emails = list.emails.split(';')
        try {
          await this.mailService.sendNotificationOfAdmissionDetail(data)
          for (let d of onDelete) {
            await this.waitingItemRepository.delete(d)
          }
        } catch (e) {
          console.log(e);
        }
      }

    }

  }

  async analogNotifications() {
    //Найти всех пользователей у которых есть оповещение о поступлении товара
    const users = await this.userRepository.find()
    if (!users) return

    for (let u of users) {
      const detailArr: {id: string, name: string, wId: number}[] = []

      for (let w of u.waitingList.waitingItem) {
        const max: number = Math.max(w.detail.storageGES, w.detail.storageOrlovka, w.detail.storageGarage2000)
        if (max === -10) continue;
        detailArr.push({id: w.detail.id, name: w.detail.name, wId: w.id})
      }

      if (!detailArr.length) continue;

      //Отправить пользователю одно письмо с 1 или несколькими поступлениями


      //Очистить лист ожидания
      for (let d of detailArr) {
        await this.waitingItemRepository.delete(d.wId)
      }

    }

  }

  //------------------------------------------Товары в корзине (CartItem)-----------------------------------------------------------

  async createUpdateCartItem(userCredentials: User, cartItemData: CartItemDto) {

    try {
      const detail = await this.detailsService.getDetailById(cartItemData.detailId)
      let duplicateItemId: number
      for (let cart of userCredentials.shoppingCart.cartItem) {
        if (cart.detail.id === cartItemData.detailId) {
          duplicateItemId = cart.id
          break;
        }
      }

      if (!duplicateItemId) {
        const newCartItem = await this.cartItemRepository.create({
          quantity: cartItemData.quantity,
          price: detail.price,
          finalPrice: detail.price * cartItemData.quantity,
          shoppingCart: userCredentials.shoppingCart,
          weight: detail.weight,
          finalWeight: detail.weight * cartItemData.quantity,
          detail: detail
        })
        const test = await this.cartItemRepository.save(newCartItem)
      } else {
        await this.recount(cartItemData.quantity, duplicateItemId)
      }

      await this.totalCost(userCredentials.shoppingCart.id)
      return await this.shoppingCartRepository.findOne(userCredentials.shoppingCart.id)
    } catch (error) {
      console.log(error)
      return userCredentials.shoppingCart
    }
  }

  async deleteItemCart(user: User, id: number) {
    const cartItem = await this.cartItemRepository.findOne(id)
    if (cartItem) {
      await this.cartItemRepository.delete(id)
      await this.totalCost(user.shoppingCart.id)
      return await this.shoppingCartRepository.findOne(user.shoppingCart.id)
    }
    throw new HttpException('Товар в корзине не обнаружен', HttpStatus.NOT_FOUND)
  }

  //----------------------------------------------------Пересчет стоимости товаров--------------------------------------------------

  async recount(quantity: number, cartItemId: number): Promise<void> {
    const data = await this.cartItemRepository.query(`
      SELECT d.price * ${quantity} as finalPrice, d.weight * ${quantity} as finalWeight 
      FROM cart_item c_i
      LEFT JOIN detail d ON d.id = c_i."detailId" 
      WHERE c_i.id = ${cartItemId}
    `)
    await this.cartItemRepository.update(cartItemId, {
      finalPrice: data[0].finalprice,
      finalWeight: data[0].finalweight,
      quantity: quantity})
  }

  async totalCost(shoppingCartId: number): Promise<void> {
    const result = await this.shoppingCartRepository.query(`
      SELECT SUM("c_i"."finalPrice") as totalCost, SUM("c_i"."finalWeight") as totalWeight
      FROM shopping_cart sh_c
      LEFT JOIN cart_item c_i ON c_i."shoppingCartId" = sh_c.id
      WHERE sh_c.id = ${shoppingCartId}
    `)
    await this.shoppingCartRepository.update(shoppingCartId, {
      totalCost: !!result[0].totalcost ? result[0].totalcost : 0,
      totalWeight: !!result[0].totalweight ? result[0].totalweight : 0
    })
  }

  async recountAllPrices(userCredentials: User): Promise<ShoppingCart> {
    for (let item of userCredentials.shoppingCart.cartItem) {
      await this.recount(item.quantity, item.id)
    }
    await this.totalCost(userCredentials.shoppingCart.id)
    return await this.shoppingCartRepository.findOne(userCredentials.shoppingCart.id)
  }

  //--------------------------------------------------------Чистка корзины----------------------------------------------------------

  async cleanShoppingCart(userCredentials: User): Promise<ShoppingCart> {
    if (!!userCredentials.shoppingCart) {
      await this.cartItemRepository.remove(userCredentials.shoppingCart.cartItem)
      await this.shoppingCartRepository.update(userCredentials.shoppingCart.id, {totalCost: 0, totalWeight: 0})
      return await this.shoppingCartRepository.findOne(userCredentials.shoppingCart.id)
    }
    throw new HttpException('В корзине не обнаружено товаров', HttpStatus.NOT_FOUND)
  }

  //---------------------------------------- Формирование заказа и чистки корзины (Order)-------------------------------------------

  async makeOrder(userCredentials: User, orderData: OrderCreateDto) {
    const orderNumber: string = await this.getMaxNumberOrder()

    if (orderData.customer === 'Юр.лицо' && !orderData.requisites) {
      throw new HttpException('Заполните данные о вашей компании', HttpStatus.BAD_REQUEST)
    }

    if (userCredentials.shoppingCart.totalCost <= 0 || userCredentials.shoppingCart.cartItem.length === 0) {
      throw new HttpException('Ваша корзина пуста', HttpStatus.BAD_REQUEST)
    }

    const newOrder = await this.orderRepository.create({
      orderNumber: orderNumber,
      orderCost: userCredentials.shoppingCart.totalCost,
      orderWeight: userCredentials.shoppingCart.totalWeight,
      contactFullName: orderData.fullName,
      contactEmail: orderData.email,
      contactPhone: orderData.phone,
      contactAdditionalPhone: orderData.additionalPhone,
      customer: orderData.customer,
      company: orderData.requisites && orderData.customer === 'Юр.лицо' ? orderData.requisites.company : null,
      inn: orderData.requisites && orderData.customer === 'Юр.лицо' ? orderData.requisites.inn : null,
      kpp: orderData.requisites && orderData.customer === 'Юр.лицо' ? orderData.requisites.kpp : null,
      companyAddress: orderData.requisites && orderData.customer === 'Юр.лицо' ? orderData.requisites.companyAddress : null,
      paymentMethod: orderData.payment,
      deliveryMethod: orderData.delivery,
      deliveryAddress: orderData.address,
      user: userCredentials
    })
    const order = await this.orderRepository.save(newOrder)

    const orderMailItem: OrderItemToMailInterface[] = []
    const itemsOneC: OrderItemsOneCInterface[] = []
    let index = 1

    for (let item of userCredentials.shoppingCart.cartItem) {
      const newOrderItem = await this.orderItemRepository.create({
        productName: item.detail.name,
        vendorCode: item.detail.vendorCode,
        manufacturer: item.detail.manufacturer?item.detail.manufacturer.nameCompany:'Не указано',
        price: item.price,
        quantity: item.quantity,
        totalCost: item.finalPrice,
        totalWeight: item.finalWeight,
        detailId: item.detail.id,
        order: order
      })
      await this.orderItemRepository.save(newOrderItem)

      orderMailItem.push({
        index: index++,
        photoUrl: item.detail.photoDetail.length>0
            ?item.detail.photoDetail.sort((a, b) =>
                (a.isMain === b.isMain) ? 0 : a.isMain ? -1 : 1)[0].url
            :'',
        productName: item.detail.name,
        vendorCode: item.detail.vendorCode,
        price: convertingNumbersToDigits(item.price),
        quantity: item.quantity,
        finalPrice: convertingNumbersToDigits(item.finalPrice),
        finalWeight: item.finalWeight?item.finalWeight.toString():'Не указан',
        detailId: item.detail.id
      })

      itemsOneC.push({
        id: item.detail.id,
        quantity: item.quantity,
        price: item.price
      })
    }

    const customerString: string = customerCreateString(orderData.customer, orderData.requisites)
    const commentString: string = commentCreateString({...orderData, customer: customerString})

    const orderMail: OrderToMailInterface = {
      orderNumber: orderNumber,
      totalCost: convertingNumbersToDigits(order.orderCost),
      totalWeight: order.orderWeight.toString(),
      fullName: orderData.fullName,
      email: orderData.email,
      phone: orderData.phone,
      additionalPhone: orderData.additionalPhone?orderData.additionalPhone:'',
      customer: customerString,
      paymentMethod: orderData.payment,
      deliveryMethod: orderData.delivery,
      deliveryAddress: orderData.address,
      orderItem: orderMailItem
    }

    const orderOneC: OrderOneCInterface = {
      orderNumber: orderNumber,
      orderCost: order.orderCost,
      orderWeight: order.orderWeight,
      details: itemsOneC,
      comment: commentString,
      inn: orderData.requisites && orderData.customer === 'Юр.лицо'? orderData.requisites.inn : null
    }

    await this.cartItemRepository.remove(userCredentials.shoppingCart.cartItem)
    await this.shoppingCartRepository.update(userCredentials.shoppingCart.id, {totalCost: 0, totalWeight: 0})
    const shoppingCart = await this.shoppingCartRepository.findOne(userCredentials.shoppingCart.id)
    await this.sendOrder(order.id, orderOneC, orderMail)
    return await this.getById(userCredentials.id)
  }

  async getMaxNumberOrder(): Promise<string> {
    const maxOrderId: number = await this.orderRepository.query('SELECT max(id) FROM "order"')
        .then((value) => {
          return value[0].max > 0 ? value[0].max + 1 : 1
        })
    if (maxOrderId >= 1000000) {
      return maxOrderId.toString()
    }
    return ("000000" + maxOrderId).slice(-6);
  }

  async sendOrder(id: number, oneC: OrderOneCInterface, mail: OrderToMailInterface): Promise<void> {
    let isSendToOneC: boolean = false
    let isSendToMidkam: boolean = false
    let isSendToUser: boolean = false
    try {
      await this.oneCService.sendOrderToOneC(oneC)
      isSendToOneC = true
    } catch (error) {
      console.log('Ошбика при отправке на 1С:')
      console.log(error);
    }
    try {
      await this.mailService.sendOrderToMidkam(mail)
      isSendToMidkam = true
    } catch (error) {
      console.log('Ошбика при отправке на почту Мидкам:')
      console.log(error);
    }
    try {
      await this.mailService.sendOrderToCustomer(mail)
      isSendToUser = true
    } catch (error) {
      console.log('Ошбика при отправке на почту Пользователя:')
      console.log(error);
    }
    await this.orderRepository.update(id, {
      isSendToOneC: isSendToOneC, isSendToMailMidkam: isSendToMidkam, isSendToMailCustomer: isSendToUser
    })
  }

  //----------------------------------Повторное отправление данных в 1С или на почту-------------------------------------------

  async resendUsersOrderToMidkam() {
    const orders = await this.orderRepository.find({where: {isSendToOneC: false}})
    if (!orders.length) return

    for (let order of orders) {
      const itemsOneC: OrderItemsOneCInterface[] = order.orderItem.map(item => {
        return {id: item.detailId, price: item.price, quantity: item.quantity}
      })

      const customerString: string = customerCreateString(order.customer, order)
      const commentString: string = commentCreateString({
        fullName: order.contactFullName,
        phone: order.contactPhone,
        email: order.contactEmail,
        additionalPhone: order.contactAdditionalPhone,
        customer: customerString,
        payment: order.paymentMethod,
        delivery: order.deliveryMethod,
        address: order.deliveryAddress
      })

      const dataOneC: OrderOneCInterface = {
        orderNumber: order.orderNumber,
        orderCost: order.orderCost,
        orderWeight: order.orderWeight,
        details: itemsOneC,
        comment: commentString,
        inn: order.inn || null
      }

      await this.oneCService.sendOrderToOneC(dataOneC)
      await this.orderRepository.update(order.id, {isSendToOneC: true})
    }

  }

  async resendOrderToMailMidkam(): Promise<void> {
    const orders = await this.orderRepository.find({where: {isSendToMailMidkam: false}})
    if (!orders.length) return
    for (let order of orders) {
      const mailData: OrderToMailInterface = this.assemblyMailOrder(order)
      await this.mailService.sendOrderToMidkam(mailData)
      await this.orderRepository.update(order.id, {isSendToMailMidkam: true})
    }
  }

  async resendOrderToMailUser(): Promise<void> {
    const orders = await this.orderRepository.find({where: {isSendToMailCustomer: false}})
    if (!orders.length) return
    for (let order of orders) {
      const mailData: OrderToMailInterface = this.assemblyMailOrder(order)
      await this.mailService.sendOrderToCustomer(mailData)
      await this.orderRepository.update(order.id, {isSendToMailCustomer: true})
    }
  }

  private assemblyMailOrder(order: Order): OrderToMailInterface {
    const items: OrderItemToMailInterface[] = order.orderItem.map((item, idx) => {
      return {
        index: idx+1,
        productName: item.productName,
        vendorCode: item.vendorCode,
        price: convertingNumbersToDigits(item.price),
        quantity: item.quantity,
        finalPrice: convertingNumbersToDigits(item.totalCost),
        finalWeight: item.totalWeight.toString(),
        detailId: item.detailId
      }
    })

    return {
      orderNumber: order.orderNumber,
      totalCost: convertingNumbersToDigits(order.orderCost),
      totalWeight: order.orderWeight.toString(),
      fullName: order.contactFullName,
      phone: order.contactPhone,
      email: order.contactEmail,
      additionalPhone: order.contactAdditionalPhone ? order.contactAdditionalPhone : '',
      customer: customerCreateString(order.customer, order),
      paymentMethod: order.paymentMethod,
      deliveryMethod: order.deliveryMethod,
      deliveryAddress: order.deliveryAddress,
      orderItem: items
    }
  }

  //---------------------------------------Создание заказа неавторизованного пользователя--------------------------------------

  async createOrderUnauthorizedUser(orderData: GuestOrderInterface, orderItemData: GuestOrderItemsInterface[]): Promise<Order> {
    const newOrder = await this.orderRepository.create({...orderData})
    const order = await this.orderRepository.save(newOrder)
    const orderItems: OrderItem[] = []
    for (const item of orderItemData) {
      const newOrderItem = await this.orderItemRepository.create({...item, order: order})
      orderItems.push(newOrderItem)
    }
    await this.orderItemRepository.save(orderItems)
    return await this.orderRepository.findOne(order.id)
  }

}
