import { Injectable } from '@nestjs/common';
import {Cron, Interval} from '@nestjs/schedule';
import * as cluster from 'cluster'
import { UsersService } from '../users/users.service';
import {ManufacturerService} from "../manufacturer/manufacturer.service";
import {RedisCacheService} from "../redis-cache/redis-cache.service";

const hour: number = 3600000

@Injectable()
export class SchedulingService {
  constructor(private readonly usersService: UsersService,
              private readonly manufacturerService: ManufacturerService,
              private readonly redisCacheService: RedisCacheService) {
  }

  // Очищение кэша
  // Каждый час
  @Interval(hour)
  private async clearCache() {
    if (cluster.worker.id === 1) {
      await this.redisCacheService.clearCache()
    }
  }

  // Переотправить неотправленные заказы на 1С Мидкам
  // Каждый час
  @Interval(hour)
  async resendOrderToMidkamDB() {
    if (cluster.worker.id === 1) {
      await this.usersService.resendUsersOrderToMidkam()
    }
  }

  // Переотправить неотправленные заказы на почту Мидкам
  // Каждый час
  @Interval(hour)
  async resendEmailToMidkam() {
    if (cluster.worker.id === 1) {
      await this.usersService.resendOrderToMailMidkam()
    }
  }

  // Переотправить неотправленные заказы на почту Заказчиков (Клиента)
  // Каждый час
  @Interval(hour)
  async resendEmailToUser() {
    if (cluster.worker.id === 1) {
      await this.usersService.resendOrderToMailUser()
    }
  }

  // Оповестить пользователей о наличии товара, на которые они были подписаны
  // Каждый час
  @Interval(hour)
  async notification() {
    if (cluster.worker.id === 1) {
      await this.usersService.notificationOfAdmission()
    }
  }

  // Удалить пользователей которые не подтвердили свои аккаунты
  // Каждый день в 00:10 и 12:10
  @Cron('0 10 0,12 * * *')
  async deleteNotVerifiedEmail() {
    if (cluster.worker.id === 1) {
      await this.usersService.deleteNotVerifiedUsers()
    }
  }

  // Удалить старые истории запросов пользователей
  // Каждый день в 00:30
  @Cron('0 30 0 * * *')
  async deleteOldRequestString() {
    if (cluster.worker.id === 1) {
      await this.usersService.clearOldRequestString()
    }
  }

  // Присвоить производителю Страну/Город "Не указан" если его поле Country равняется null
  // Каждую среду в 01:00
  @Cron('0 0 1 * * 3')
  async updateManufacturerWithoutCountry() {
    if (cluster.worker.id === 1) {
      await this.manufacturerService.overWriteCountry()
    }
  }

}
