import { Injectable, NestMiddleware } from '@nestjs/common';
import {Request, Response, NextFunction} from 'express'

@Injectable()
export class GlobalMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {

    console.log('Входящий запрос: '+ req.method, ' Url: ' + req.originalUrl)
    console.log('Тело: '+ JSON.stringify(req.body).slice(0, 2000))

    next();
  }
}
