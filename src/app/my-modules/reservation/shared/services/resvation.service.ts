import { Subject } from 'rxjs/Rx';
import { reservationConfig } from './../config/index';
import { AuthService } from './../../../../core/services/auth.service';
import { UserState } from './../../../../core/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { replaceQuery } from '../../../../shared/utils';

@Injectable()
export class ReservationService {

    role = 3;
    user: UserState;
    deptList;
    deptListSub = new Subject<any>();
    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) {
        this.user = this.auth.user;
    }

    getServiceDeptInfo() {
        return this.http.get(replaceQuery(reservationConfig.getServiceDeptInfo, {}, this.user));
    }

    updateService(d:any) {
        d.COMPANY_ID = this.user.COMPANY_ID;
        return this.http.post(reservationConfig.updateService, d);
    }

    getServiceTime(dept_id:number) {
        return this.http.get(replaceQuery(reservationConfig.getServiceTime,{dept_id}))
    }

}

