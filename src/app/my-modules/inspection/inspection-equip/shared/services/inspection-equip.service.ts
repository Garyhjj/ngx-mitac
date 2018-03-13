import { UserState } from './../../../../../core/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../../../../core/services/auth.service';
import { replaceQuery } from '../../../../../shared/utils';

@Injectable()
export class InspectionEquipService {
    role = 3;
    user: UserState;
    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) {
        this.user = this.auth.user;
        if(this.user.privilege.find(m => m.FUNCTION_ID === 343)) {
            this.role = 1;
        }
    }

}

