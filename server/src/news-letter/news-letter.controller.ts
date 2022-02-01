import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Req,
    UseGuards,
} from '@nestjs/common';
import {NewsLetterService} from "./news-letter.service";
import {FindOneParams} from "../utils/params/findOneParams";
import {NewsLetterUpdateDto} from "./dto/news-letter-update.dto";
import {NewsLetterCreateDto} from "./dto/news-letter-create.dto";
import {AdminGuard} from "../auth/guards/admin.guard";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {RequestWithUser} from "../auth/interfaces/request-with-user.interface";

@Controller('news-letter')
export class NewsLetterController {

    constructor(private readonly newsLetterService: NewsLetterService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getNewsLetters(@Req() req: RequestWithUser) {
        return await this.newsLetterService.getAll(req.user.isAdmin)
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getNewsLetterById(@Req() req: RequestWithUser, @Param() {id}: FindOneParams) {
        return await this.newsLetterService.getById(+id, req.user.isAdmin)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Post()
    async newsLetterCreate(@Body() data: NewsLetterCreateDto) {
        return await this.newsLetterService.createNewsLetter(data)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put()
    async newsLetterUpdate(@Body() data: NewsLetterUpdateDto) {
        return await this.newsLetterService.updateNewsLetter(data)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete(':id')
    async newsLetterDelete(@Param() {id}: FindOneParams) {
        return await this.newsLetterService.deleteNewsLetter(+id)
    }

}
