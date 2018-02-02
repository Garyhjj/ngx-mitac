import { UserState } from './../../../../core/store';
import { examConfig, ExamMapping } from './../config/index';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';

@Injectable()
export class ExamService {

    user: UserState
    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) { 
        this.user = this.auth.user;
    }

    UpdateMapping(data: ExamMapping) {
        data.COMPANY_ID = this.user.COMPANY_ID;
        return this.http.post(examConfig.UpdateMapping, data);
    }

}