import { reqObserve } from './../interceptors/http-header.interceptor';
import { User_Login } from './../actions/user.action';
import { Store } from '@ngrx/store';
import { UserState, myStore } from './../store';
import { EncryptUtilService } from './encryptUtil.service';
import { LoginConfig } from './../../login/shared/config/login.config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';

import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class AuthService {

    auth = false;
    authSubject = new BehaviorSubject<boolean>(false);
    tokenStoreName: string = 'tokenMes';
    loginPageSubject = new BehaviorSubject<boolean>(false);
    user:UserState;
    tokenEffectTime: number = 1000*60*20;
    constructor(
        private http: HttpClient,
        private encryptUtilService: EncryptUtilService,
        private store$: Store<myStore>
    ) { 
        this.updateAuth(this.checkAuth());
        reqObserve.subscribe((a) => this.updateToken());
        this.store$.select(s => s.userReducer).subscribe(u => this.user = u);
    }

    login(data: any) {
        return this.http.post(LoginConfig.loginUrl, this.getNewToken(data.userName, data.password)).do((d: any) => {
            let user: UserState = {};
            Object.assign(user, d.User)
            user.modules = d.Modules;
            user.password = data.password;
            user.rememberPWD = data.remember;
            let expires = d.Expires;
            this.tokenEffectTime = expires - new Date().getTime();
            this.updateTokenMes(expires,d.Token);
            this.auth = true;
            this.updateAuth(true);
            this.store$.dispatch(new User_Login(user));
        })
    }

    updateToken() {
        let tokenMes = this.getTokenMes();
        if(tokenMes) {
            let expires = tokenMes.expires;
            let time = new Date().getTime();
            if((expires > time) && expires < time + this.tokenEffectTime*0.5) {
                let user = this.user;
                this.login({userName:user.USER_NAME,password:user.password,remember:user.rememberPWD}).subscribe();
            }
        }
    }

    checkAuth() {
        let tokenMes = this.getTokenMes();
        return tokenMes && (tokenMes.expires> new Date().getTime());
    }
    updateTokenMes(expires:number, token:string) {
        let tokenMes: TokenMes ={expires, token};
        localStorage.setItem(this.tokenStoreName, JSON.stringify(tokenMes));
    }

    getTokenMes() {
        let tokenStr = localStorage.getItem(this.tokenStoreName);
        if(tokenStr) {
            let tokenMes:TokenMes = JSON.parse(tokenStr);
            if(typeof tokenMes === 'object') {
                return tokenMes;
            }
        }
        return null;
    }

    clearTokenMes() {
        localStorage.removeItem(this.tokenStoreName);
    }

    getNewToken(userName: string, password: string) {
        let enUsername = this.encryptUtilService.AesEncrypt(userName, this.encryptUtilService.key, this.encryptUtilService.iv);
        let enPassword = this.encryptUtilService.AesEncrypt(password, this.encryptUtilService.key, this.encryptUtilService.iv);
        return { userName: enUsername, password: enPassword };
    }

    updateAuth(auth:boolean) {
        this.authSubject.next(auth);
    }
}

export interface TokenMes {
    expires: number;
    token: string;
}