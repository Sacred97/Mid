import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {DetailsService} from "../details/details.service";
import {GuestRecountOrder} from "./dto/guest-recount-order.dto";
import {GuestMakeOrderDto} from "./dto/guest-make-order.dto";
import {OneCService} from "../one-c/one-c.service";
import {OrderItemsOneCInterface, OrderOneCInterface} from "../one-c/interfaces/orderOneC.interface";
import {UsersService} from "../users/users.service";
import {GuestOrderInterface} from "./interfaces/guest-order.interface";
import {GuestOrderItemsInterface} from "./interfaces/guest-order-items.interface";
import {OrderItemToMailInterface, OrderToMailInterface} from "../mail/interfaces/order-to-mail.interface";
import {commentCreateString, convertingNumbersToDigits, customerCreateString} from "../utils/utils";
import {DetailIdDto} from "../shared-dto/detail-id.dto";
import {getRepository} from "typeorm";
import {Detail} from "../details/entity/detail.entity";

@Injectable()
export class GuestService {

    constructor(private readonly detailsService: DetailsService, private readonly oneCService: OneCService,
                private readonly usersService: UsersService) {
    }

    async recountTotalCostOfGuest(purchase: GuestRecountOrder[]) {
        let recountedPrice: number = 0
        const ids: DetailIdDto[] = purchase.map(item => {
            return {id: item.detailId}
        })

        const details = await this.detailsService.getDetailsByIds(ids).then(res => res.filter(i => !i.isHide))
        let unhiddenIds = details.map(i => i.id)
        console.log(unhiddenIds)
        for (const item of details) {
            for (const orderItem of purchase) {
                if (orderItem.detailId === item.id) {
                    let query = `select sum(d.price * ${orderItem.quantity}) as total from detail d where d.id = '${item.id}'`
                    let price = await getRepository(Detail).query(query).then(res => res[0].total)
                    recountedPrice = recountedPrice + price
                    break;
                }
            }
        }

        return {totalCost: recountedPrice, ids: unhiddenIds}
    }

    async makeOrderUnauthorized(orderData: GuestMakeOrderDto) {
        const customer: string = customerCreateString(orderData.customer, orderData.requisites)
        const comment: string = commentCreateString({...orderData, customer: customer})
        const orderNumber: string = await this.usersService.getMaxNumberOrder()

        const ids: DetailIdDto[] = orderData.order.map(item => {
            return {id: item.detailId}
        })
        const details = await this.detailsService.getDetailsByIds(ids)

        const orderItemOneC: OrderItemsOneCInterface[] = []
        const orderItemToMail: OrderItemToMailInterface[] = []
        const orderItemToSave: GuestOrderItemsInterface[] = []

        let totalWeight: number = 0
        let totalCost: number = 0
        let index: number = 1
        for (const item of details) {
            for (const orderItem of orderData.order) {
                if (item.id === orderItem.detailId) {
                    const finalCost: number = item.price * orderItem.quantity
                    const finalWeight: number = item.weight * orderItem.quantity
                    totalCost = totalCost + finalCost
                    totalWeight = totalWeight + finalWeight

                    orderItemOneC.push({
                        id: item.id, price: item.price, quantity: orderItem.quantity
                    })
                    orderItemToMail.push({
                        index: index++,
                        productName: item.name,
                        vendorCode: item.vendorCode,
                        photoUrl: item.photoDetail.length>0? item.photoDetail[0].url : '',
                        price: convertingNumbersToDigits(item.price),
                        quantity: orderItem.quantity,
                        finalPrice: convertingNumbersToDigits(finalCost),
                        finalWeight: finalWeight.toFixed(3),
                        detailId: item.id
                    })
                    orderItemToSave.push({
                        productName: item.name,
                        vendorCode: item.vendorCode,
                        manufacturer: item.manufacturer ? item.manufacturer.nameCompany : null,
                        price: item.price,
                        quantity: orderItem.quantity,
                        totalCost: Number(finalCost.toFixed(2)),
                        totalWeight: Number(finalWeight.toFixed(3)),
                        detailId: item.id,
                    })
                    break;
                }
            }
        }

        if (totalCost <= 999) throw new HttpException('Сумма заказа слишком маленькая', HttpStatus.FORBIDDEN)

        const orderOneC: OrderOneCInterface = {
            orderNumber: orderNumber,
            orderCost: Number(totalCost.toFixed(2)),
            orderWeight: Number(totalWeight.toFixed(3)),
            details: orderItemOneC,
            comment: comment,
            inn: orderData.requisites && orderData.customer === 'Юр.лицо' ? orderData.requisites.inn : null
        }
        const orderToMail: OrderToMailInterface = {
            orderNumber: orderNumber,
            totalCost: convertingNumbersToDigits(totalCost),
            totalWeight: totalWeight.toString(),
            fullName: orderData.fullName,
            email: orderData.email,
            phone: orderData.phone,
            additionalPhone: orderData.additionalPhone?orderData.additionalPhone:'',
            customer: customer,
            paymentMethod: orderData.payment,
            deliveryMethod: orderData.delivery,
            deliveryAddress: orderData.address,
            orderItem: orderItemToMail
        }
        const orderToSave: GuestOrderInterface = {
            orderNumber: orderNumber,
            orderCost: totalCost,
            orderWeight: totalWeight,
            contactFullName: orderData.fullName,
            contactEmail: orderData.email,
            contactPhone: orderData.phone,
            contactAdditionalPhone: orderData.additionalPhone?orderData.additionalPhone:'',
            customer: orderData.customer,
            inn: orderData.requisites && orderData.customer === 'Юр.лицо' ? orderData.requisites.inn : null,
            company: orderData.requisites && orderData.customer === 'Юр.лицо' ? orderData.requisites.company : null,
            kpp: orderData.requisites && orderData.customer === 'Юр.лицо' ?
                orderData.requisites.kpp ? orderData.requisites.kpp : null : null,
            companyAddress: orderData.requisites && orderData.customer === 'Юр.лицо' ?
                orderData.requisites.companyAddress : null,
            paymentMethod: orderData.payment,
            deliveryMethod: orderData.delivery,
            deliveryAddress: orderData.address
        }

        const order = await this.usersService.createOrderUnauthorizedUser(orderToSave, orderItemToSave)
        await this.usersService.sendOrder(order.id, orderOneC, orderToMail)
        return order
    }



}
