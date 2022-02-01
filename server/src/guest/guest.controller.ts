import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {GuestService} from "./guest.service";
import {GuestGuard} from "./guest.guard";
import {GuestRecountOrder} from "./dto/guest-recount-order.dto";
import {GuestMakeOrderDto} from "./dto/guest-make-order.dto";

@UseGuards(GuestGuard)
@Controller('guest')
export class GuestController {

    constructor(private readonly guestService: GuestService) {
    }

    @Post('recount')
    async recountOrderPriceOfGuest(@Body() orderData: GuestRecountOrder[]) {
        return await this.guestService.recountTotalCostOfGuest(orderData)
    }

    @Post('order')
    async makeOrderByGuest(@Body() orderData: GuestMakeOrderDto) {
        return await this.guestService.makeOrderUnauthorized(orderData)
    }

}
