import {CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Request} from 'express'
import {OneCService} from "./one-c.service";

@Injectable()
export class OneCGuard implements CanActivate {

    constructor(private readonly oneCService: OneCService) {
    }

    // Только для 1С
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const access = await this.oneCService.getAccessForOneC()
        const request: Request = context.switchToHttp().getRequest()
        const requestIp = request.ip.split(':')
        const ip = requestIp[requestIp.length - 1]
        console.log(ip)
        if (ip === access.key) {
            return true
        }
        throw new HttpException('Access denied', HttpStatus.FORBIDDEN)
    }

}
