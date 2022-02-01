import {CallHandler, ExecutionContext, NestInterceptor} from "@nestjs/common";
import {Observable} from "rxjs";
import {Request} from "express";

export class TransformToArrayInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const http = context.switchToHttp()
        const req: Request = http.getRequest()

        if (!Array.isArray(req.body)) {
            req.body = [req.body]
        }

        return next.handle();
    }

}
