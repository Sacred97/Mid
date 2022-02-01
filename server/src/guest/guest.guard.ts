import {CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Request} from 'express'

@Injectable()
export class GuestGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest()

    const access = request.cookies.Authentication
    const refresh = request.cookies.Refresh
    if (!!access || !!refresh) throw new HttpException('Выйдите из аккаунта', HttpStatus.FORBIDDEN)
    return true
  }

}
