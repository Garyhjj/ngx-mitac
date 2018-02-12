import { inspectionBossConfig } from './../config/index';
import { UserState } from './../../../../../core/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../../../../core/services/auth.service';
import { replaceQuery } from '../../../../../shared/utils';

@Injectable()
export class InspectionBossService {

    user: UserState;
    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) {
        this.user = this.auth.user;
    }

    getEmployeeSchedule() {
        const send = {company: this.user.COMPANY_ID}
        return this.http.get(replaceQuery(inspectionBossConfig.getEmployeeSchedule, send));
    }

}
