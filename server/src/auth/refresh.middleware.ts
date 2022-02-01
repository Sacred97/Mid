import { Injectable, NestMiddleware } from '@nestjs/common';
import {Response, Request, NextFunction} from 'express'
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import * as proxy from 'http-proxy-middleware'
import http from 'http'
import * as querystring from 'querystring'
import { AuthService } from './auth.service';
import {JwtService} from "@nestjs/jwt";
import {TokenPayload} from "./interfaces/tokenPayload.interface";

@Injectable()
export class RefreshMiddleware implements NestMiddleware {

  constructor(private authService: AuthService, private usersService: UsersService,
              private configService: ConfigService, private jwtService: JwtService) {
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const refreshToken: string = req.cookies.Refresh
    const authToken: string = req.cookies.Authentication

    let expirationTime: number = 0
    if (!!authToken) {
      const data: any = this.jwtService.decode(authToken, {json: true})
      expirationTime = data.exp - (Date.now()/1000)
    }

    if ( (!!refreshToken && !authToken) || (!!refreshToken && !!authToken && expirationTime < 10)) {
      const decodedRefresh: TokenPayload =
          this.jwtService.verify(refreshToken, {secret: this.configService.get('JWT_REFRESH_SECRET_KEY')})
      const newAccessTokenCookie: string = this.authService.getCookieJwtToken(decodedRefresh.userId)
      req.res.setHeader('Set-Cookie', newAccessTokenCookie)

      const proxyChangeReq = proxy.createProxyMiddleware('**',{
        target: 'http://localhost:3000', secure: false,
        prependPath: true,
        changeOrigin: true,
        headers: {
          "Connection": "keep-alive"
        },
        onProxyReq(proxyReq: http.ClientRequest, req: Request, res: Response): void {
          proxyReq.setHeader('Cookie', newAccessTokenCookie)
          if (!req.body || !Object.keys(req.body).length) {
            return;
          }
          const contentType: string = proxyReq.getHeader('Content-Type').toString()
          const writeBody = (bodyData: string) => {
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
            proxyReq.setHeader('Content-Type', contentType)
            proxyReq.write(bodyData)
          }
          if (contentType.includes('application/json') || contentType.includes('multipart/form-data')) {
            writeBody(JSON.stringify(req.body))
          }
          if (contentType === 'application/x-www-form-urlencoded') {
            writeBody(querystring.stringify(req.body))
          }
        }
      })
      proxyChangeReq(req,res,next)
      return
    }
    next();
  }
}
