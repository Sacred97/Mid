import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';
import { TokenPayload } from '../interfaces/tokenPayload.interface';
import { Injectable } from '@nestjs/common';


@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy){

  constructor(private readonly configService: ConfigService, private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request.cookies?.Authentication
      }]),
      secretOrKey: configService.get('JWT_SECRET_KEY')
    });
  }

  async validate(payload: TokenPayload) {
    return this.usersService.getById(payload.userId)
  }

}
