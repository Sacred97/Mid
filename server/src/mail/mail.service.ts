import { Injectable } from '@nestjs/common';
import {ISendMailOptions, MailerService} from '@nestjs-modules/mailer';
import {PriceListSendDto} from "../price-list/dto/price-list-send.dto";
import {Express} from 'express'
import {PriceListGetDto} from "../price-list/dto/price-list-get.dto";
import {OrderToMailInterface} from "./interfaces/order-to-mail.interface";
import {SupplierOfferDto} from "./dto/supplier-offer.dto";

@Injectable()
export class MailService {

  constructor(private mailerService: MailerService) {
  }

  async sendUserEmailVerification(email: string, token: string) {
    const url = `http://midkam.pro/action?mode=verification&token=${token}`
    await this.mailerService.sendMail({
      to: email,
      subject: 'Регистрация на сайте Midkam.ru',
      template: __dirname+'/templates/confirmation.hbs',
      context: {
        url: url,
        email: email
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  async sendEmailChangeLink(newEmail: string, token) {
    const url = `http://midkam.pro/action?mode=change&token=${token}`
    await this.mailerService.sendMail({
      to: newEmail,
      subject: 'Смена электронной почты Midkam.ru',
      template: __dirname+'/templates/change-email.hbs',
      context: {
        url: url
      }
    }).catch((error) => {
      console.log(error);
    })
  }

  async sendRestoreEmailLink(email: string, token: string) {
    const url = `http://midkam.pro/action?mode=restore&token=${token}`
    await this.mailerService.sendMail({
      to: email,
      subject: 'Процедура восстановления пароля',
      template: __dirname+'/templates/restore-password.hbs',
      context: {
        url: url
      }
    }).catch((error) => {
      console.log(error);
    })
  }

  async sendOrderToCustomer(order: OrderToMailInterface) {
    await this.mailerService.sendMail({
      to: order.email,
      subject: `Ваш заказ №${order.orderNumber} принят`,
      template: __dirname+'/templates/sendOrderToCustomer.hbs',
      context: {
        order: order
      }
    })
  }

  async sendOrderToMidkam(order: OrderToMailInterface) {
    await this.mailerService.sendMail({
      to: ['webcite@midkam.ru', 'sales@midkam.ru'],
      subject: `Оформлен заказ в интернет-магазине №${order.orderNumber}`,
      template: __dirname+'/templates/sendOrderToMidkam.hbs',
      context: {
        order: order
      }
    })
  }

  async sendPriceList(dataContext: PriceListSendDto, file?: Express.Multer.File) {
    await this.mailerService.sendMail({
      to: 'webcite@midkam.ru',
      subject: `Получен Прайс-Лист от клиента ${dataContext.name}`,
      template: __dirname+'/templates/sendPriceList.hbs',
      context: {
        name: dataContext.name,
        text: dataContext.text,
        comment: dataContext.comment,
        phone: dataContext.phone,
        email: dataContext.email
      },
      attachments: [{filename: file.originalname, content: file.buffer}]
    })
  }

  async getPriceListFiles(data: PriceListGetDto, files: {path: string, filename: string}[]) {
    let mailOptions: ISendMailOptions = {
      to: data.email,
      subject: `Мидкам, Прайс-Листы`,
      template: __dirname+'/templates/getPriceList.hbs',
      context: {
        name: data.name,
        phone: data.phone,
      },
      attachments: files.map(item => {
        return {path: item.path, filename: item.filename}
      })
    }
    await this.mailerService.sendMail(mailOptions)
  }

  async sendNotificationOfAdmissionDetail(data: {emails: string[],
    items: {id: string, name: string, vendorCode: string, price: string, url: string}[]}) {
    await this.mailerService.sendMail({
      to: data.emails,
      subject: 'Оповещение о поступлении товара',
      template: __dirname+'/templates/notification-of-admission.hbs',
      context: {
        items: data.items
      },
      attachments: []
    })
  }

  async sendSupplierOffer(data: SupplierOfferDto) {
    await this.mailerService.sendMail({
      to: 'webcite@midkam.ru',
      subject: 'Предложение поставщика',
      template: __dirname + '/templates/supplier-offer.hbs',
      context: data
    })

    return {message: 'Ok'}
  }

}
