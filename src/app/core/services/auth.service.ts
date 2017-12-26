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
    constructor(
        private http: HttpClient,
        private encryptUtilService: EncryptUtilService,
        private store$: Store<myStore>
    ) { 
        this.updateAuth(this.checkAuth())
    }

    login(data: any) {
        return this.http.post(LoginConfig.loginUrl, this.getNewToken(data.userName, data.password)).do((d: any) => {
            let user: UserState = {};
            Object.assign(user, d.User)
            user.modules = d.Modules;
            user.password = data.password;
            user.rememberPWD = data.remember;
            this.updateTokenMes(d.Expires,d.Token);
            this.auth = true;
            this.updateAuth(true);
            this.store$.dispatch(new User_Login(user));
        })
    }

    checkAuth() {
        let tokenStr = localStorage.getItem(this.tokenStoreName);
        if(tokenStr) {
            let tokenMes:TokenMes = JSON.parse(tokenStr);
            if(typeof tokenMes === 'object') {
                if(tokenMes.expires > new Date().getTime()) {
                    return true
                }
            }
        }
        return false;
    }
    updateTokenMes(expires:number, token:string) {
        let tokenMes: TokenMes ={expires, token};
        localStorage.setItem(this.tokenStoreName, JSON.stringify(tokenMes));
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

interface TokenMes {
    expires: number;
    token: string;
}