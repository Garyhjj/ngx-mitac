import { environment } from './../../../environments/environment';
import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { Headers, RequestOptions } from '@angular/http';
import { LoginConfig } from './../../login/shared/config/login.config';
import { AuthService, TokenMes } from './../services/auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';

const reqSubject = new Subject<any>();
export const reqObserve = reqSubject
  .asObservable()
  .pipe(throttleTime(1000 * 10));

@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (req.url === environment.fileEndUrl + 'SystemOperation/UploadFiles') {
      let fileReq = this.addToken(req);
      return next.handle(fileReq);
    }
    let authReq = req.clone({
      setHeaders: { 'Content-Type': 'application/json; charset=utf-8' },
    });
    if (this.isNeedToken(req.url)) {
      authReq = this.addToken(authReq);
      reqSubject.next(1);
    }
    return next.handle(authReq);
  }

  addToken(req: HttpRequest<any>) {
    let tokenStr = localStorage.getItem('tokenMes');
    if (tokenStr) {
      let tokenMes: TokenMes = JSON.parse(tokenStr);
      if (typeof tokenMes === 'object') {
        req = req.clone({
          setHeaders: { access_token: tokenMes.token },
        });
      }
    }
    return req;
  }

  isNeedToken(url: string) {
    const notNeedUrl = [LoginConfig.loginUrl];
    return notNeedUrl.indexOf(url) < 0;
  }
}
