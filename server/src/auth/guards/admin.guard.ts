import {CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {RequestWithUser} from "../interfaces/request-with-user.interface";

@Injectable()
export class AdminGuard implements CanActivate {

  // Применять только с Guard'ом JwtAuthGuard
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest()
    const user = request.user

    if (user.isAdmin) {
    // if (!!user && user.email === 'komepec601@idrct.com' && user.id === 14 && user.isAdmin) {
      return true
    }

    throw new HttpException('Access denied, You are not admin', HttpStatus.FORBIDDEN)
  }

}
