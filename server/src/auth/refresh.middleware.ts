import { Injectable, NestMiddleware } from '@nestjs/common';
import {Response, Request, NextFunction} from 'express'
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import * as proxy from 'http-proxy-middleware'
import http from 'http'
import * as querystring from 'querystring'
import { AuthService } from './auth.service';
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class RefreshMiddleware implements NestMiddleware {

  constructor(private authService: AuthService, private usersService: UsersService,
              private configService: ConfigService, private jwtService: JwtService) {
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const refreshToken: string = req.cookies.Refresh
    const authToken: string = req.cookies.Authentication

    if (!!authToken) {
      const tokenData: any = this.jwtService.decode(authToken, {json: true})
      const maxDifference: number = 43200 // 12 часов в секундах
      const difference: number = tokenData.exp - (Date.now() / 1000)

      if (difference > maxDifference) {
        next()
        return
      } else {
        const newAuthTokenCookie = this.authService.getCookieJwtToken(tokenData.userId)
        const newRefreshTokenData = this.authService.getCookieWithJwtRefreshToken(tokenData.userId)
        await this.usersService.setCurrentRefreshToken(newRefreshTokenData.token, tokenData.userId)
        req.res.setHeader('Set-Cookie', [newAuthTokenCookie, newRefreshTokenData.cookie])
        const p = proxy.createProxyMiddleware('**',{
          target: 'http://localhost:3000', secure: false,
          prependPath: true,
          changeOrigin: true,
          headers: {
            "Connection": "keep-alive"
          },
          onProxyReq(proxyReq: http.ClientRequest, req: Request, res: Response): void {
            proxyReq.setHeader('Cookie', [newAuthTokenCookie, newRefreshTokenData.cookie])

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
        p(req, res, next)
        return
      }

    } else if (!!refreshToken) {
      const refreshData = this.jwtService.verify(refreshToken,
          {secret: this.configService.get('JWT_REFRESH_SECRET_KEY')}
      )
      const newAuthTokenCookie = this.authService.getCookieJwtToken(refreshData.userId)
      const newRefreshTokenData = this.authService.getCookieWithJwtRefreshToken(refreshData.userId)
      await this.usersService.setCurrentRefreshToken(newRefreshTokenData.token, refreshData.userId)
      console.log(newRefreshTokenData.cookie)
      req.res.setHeader('Set-Cookie', [newAuthTokenCookie, newRefreshTokenData.cookie])
      const p = proxy.createProxyMiddleware('**',{
        target: 'http://localhost:3000', secure: false,
        prependPath: true,
        changeOrigin: true,
        headers: {
          "Connection": "keep-alive"
        },
        onProxyReq(proxyReq: http.ClientRequest, req: Request, res: Response): void {
          proxyReq.setHeader('Cookie', [newAuthTokenCookie, newRefreshTokenData.cookie])

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
      p(req, res, next)
      return
    }

    next()
    return
  }

}
