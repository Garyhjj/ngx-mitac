import { EncryptUtilService } from './encryptUtil.service';
import { LoginConfig } from './../../login/shared/config/login.config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class AuthService {

    constructor(
        private http: HttpClient,
        private encryptUtilService: EncryptUtilService
    ) { }

    login(data:any) {
        this.http.post(LoginConfig.loginUrl,this.getNewToken(data.userName,data.password)).subscribe((res) =>console.log(res)
        )
    }

    getNewToken(userName:string,password:string) {
        console.log(password,userName);
        
        let enUsername = this.encryptUtilService.AesEncrypt(userName, this.encryptUtilService.key, this.encryptUtilService.iv);
        let enPassword = this.encryptUtilService.AesEncrypt(password, this.encryptUtilService.key, this.encryptUtilService.iv);
        return { userName: enUsername, password: enPassword };
    }

}
