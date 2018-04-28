import { Subject } from 'rxjs/Rx';
import { Headers, RequestOptions } from '@angular/http';
import { LoginConfig } from './../../login/shared/config/login.config';
import { AuthService, TokenMes } from './../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';

const reqSubject = new Subject<any>();
export const reqObserve = reqSubject.asObservable().throttleTime(1000 * 10);

@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    let authReq = req.clone({
      setHeaders: { 'Content-Type': 'application/json; charset=utf-8' },
    });
    if (this.isNeedToken(req.url)) {
      let tokenStr = localStorage.getItem('tokenMes');
      if (tokenStr) {
        let tokenMes: TokenMes = JSON.parse(tokenStr);
        if (typeof tokenMes === 'object') {
          authReq = authReq.clone({
            setHeaders: { access_token: tokenMes.token },
          });
        }
      }
      reqSubject.next(1);
    }
    return next.handle(authReq);
  }

  isNeedToken(url: string) {
    const notNeedUrl = [LoginConfig.loginUrl];
    return notNeedUrl.indexOf(url) < 0;
  }
}
