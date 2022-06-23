import {Body, Controller, Get, Post} from '@nestjs/common';
import {MailService} from "./mail.service";
import {SupplierOfferDto} from "./dto/supplier-offer.dto";

@Controller()
export class MailController {

    constructor(private readonly mailService: MailService) {
    }

    @Post('mail/supplier')
    async supplierOffer(@Body() data: SupplierOfferDto) {
        return await this.mailService.sendSupplierOffer(data)
    }

}
