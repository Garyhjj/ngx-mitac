import { ReservationService } from './../../../shared/services/resvation.service';
import { AuthService } from './../../../../../core/services/auth.service';
import { UserState } from './../../../../../core/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { reservationITConfig } from '../config';
import { replaceQuery } from '../../../../../shared/utils';

@Injectable()
export class ReservationITService {

    role = 3;
    user: UserState;
    deptId;
    constructor(
        private http: HttpClient,
        private auth: AuthService,
        private reservationService: ReservationService
    ) {
        this.user = this.auth.user;
        if(this.user.privilege.find(m => m.FUNCTION_ID === 343)) {
            this.role = 1;
        }
    }

    async getITDeptId() {
        if(this.deptId > 0) return;
        if(!this.reservationService.deptList) {
            let res = await this.reservationService.getServiceDeptInfo().toPromise();
            this.reservationService.deptList = res;
        }
        const target = this.reservationService.deptList.find(c => c.TYPE === 'IT_SERVICE');
        if(target) {
            this.deptId = target.ID;
        }
    }

    getServiceDateMes(dept_id: number) {
        return this.http.get(replaceQuery(reservationITConfig.getServiceDateMes, {dept_id}));
    }

    getServiceDayInfo(dept_id: number, date: string) {
        return this.http.get(replaceQuery(reservationITConfig.getServiceDayInfo, {dept_id, date}));
    }

}

