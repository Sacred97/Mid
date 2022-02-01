import {Body, Controller, HttpCode, Post, UseGuards} from '@nestjs/common';
import {OneCService} from "./one-c.service";
import {AdminGuard} from "../auth/guards/admin.guard";
import {AccessDto} from "./access.dto";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('one-c')
export class OneCController {

    constructor(private readonly oneCService: OneCService) {
    }

    @HttpCode(200)
    @Post()
    async keyChange(@Body() data: AccessDto) {
        await this.oneCService.changeAccessKey(data)
        return {message: 'Ключи доступа успешно были изменены'}
    }

}
