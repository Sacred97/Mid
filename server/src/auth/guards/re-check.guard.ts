import {CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable} from "@nestjs/common";
import { Request } from 'express'
import {VerificationRestoreDto} from "../dto/verification-restore.dto";
import {UsersService} from "../../users/users.service";

@Injectable()
export class ReCheckGuard implements CanActivate {

    constructor(private readonly usersService: UsersService) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest()
        const body: VerificationRestoreDto = request.body

        return this.usersService.getByEmail(body.email)
            .then((user) => {
                if (!user) throw new HttpException('Аккаунт не существует', HttpStatus.NOT_FOUND)
                if (user.emailVerified) throw new HttpException('Аккаунт уже подтвержден', HttpStatus.CONFLICT)
                return true
            }, (error) => {
                console.log(error);
                throw new HttpException('Произошла ошибка', HttpStatus.INTERNAL_SERVER_ERROR)
            })
    }
}
