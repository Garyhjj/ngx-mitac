import { Headers, RequestOptions } from '@angular/http';
import { LoginConfig } from './../../login/shared/config/login.config';
import { AuthService } from './../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = req.clone({setHeaders: {'Content-Type':'application/json; charset=utf-8'}});
        if(this.isNeedToken(req.url)) {
            authReq = authReq.clone({setHeaders: {'access_token':'78654545454'}});
        }
        return next.handle(authReq);
    }

    isNeedToken(url:string) {
        const notNeedUrl = [LoginConfig.loginUrl];
        return notNeedUrl.indexOf(url) < 0
    }
}