import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable()
export class UtilService {

    constructor(
        private router: Router,
        private _message: NzMessageService
    ) { }

    errDeal(err) {
        if (err && !isNaN(err.status)) {
            switch (err.status) {
                case 403:
                    this.tokenTimeOut();
                    return;

            }
        }
    }

    tokenTimeOut() {
        this._message.create('error', '授权已超时,请重新登录', { nzDuration: 5000 });
        this.router.navigate(['/login']);
    }

}
