import { inspectionBossConfig } from './../config/index';
import { UserState } from './../../../../../core/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../../../../core/services/auth.service';
import { replaceQuery } from '../../../../../shared/utils';

@Injectable()
export class InspectionBossService {
    role = 3;
    user: UserState;
    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) {
        this.user = this.auth.user;
        if (this.user.privilege.find(m => m.FUNCTION_ID === 124)) {
            this.role = 1;
        }
    }

    getEmployeeSchedule() {
        const send = { company: this.user.COMPANY_ID };
        return this.http.get(replaceQuery(inspectionBossConfig.getEmployeeSchedule, send));
    }

    uploadSchedule(d) {
        return this.http.post(inspectionBossConfig.uploadSchedule, d);
    }

    deleteScheduleLines(id) {
        const send = { sechedule_line_id: id };
        return this.http.delete(replaceQuery(inspectionBossConfig.deleteScheduleLines, send));
    }

    getMriWeek() {
        return this.http.get(inspectionBossConfig.getMriWeek);
    }

    getReport(id) {
        const send = { header_id: id };
        return this.http.get(replaceQuery(inspectionBossConfig.getReport, send));
    }

    uploadReport(d) {
        return this.http.post(inspectionBossConfig.uploadReport, d);
    }

}

