import { boardConfig } from './../config/index';
import { UserState } from './../../../../core/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { replaceQuery } from '../../../../shared/utils';

@Injectable()
export class BoardService {

    user: UserState;
    role: number = 3;
    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) {
        this.user = this.auth.user;
    }

    getEsdQuantity(flag: 'Y' | 'N') {
        const send = { flag };
        return this.http.get(replaceQuery(boardConfig.getEsdQuantity, send));
    }

    getTopDep() {
        return this.http.get(boardConfig.getTopDep);
    }

    getSubDep(bu_deptno: string) {
        const send = {bu_deptno};
        return this.http.get(replaceQuery(boardConfig.getSubDep, send));
    }

    getEsdNotPassList(chu_deptno: string) {
        const send = {chu_deptno};
        return this.http.get(replaceQuery(boardConfig.getEsdNotPassList, send));
    }


}

