import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../../users/user.entity';

@Injectable()
export class VerificationGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const user: User = request.user
    if (user.emailVerified) {
      return true
    }
    throw new HttpException('Аккаунт не подтвержден. Сначала подтвердите аккаунт', HttpStatus.FORBIDDEN)
  }

}
