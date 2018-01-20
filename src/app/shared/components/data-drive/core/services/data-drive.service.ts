import { DataDrive } from './../../shared/models/index';
import { APPConfig } from './../../../../config/app.config';
import { HttpClient } from '@angular/common/http';
import { DataDriveStore } from './../../shared/config/index';
import { Injectable } from '@angular/core';
import { UtilService } from '../../../../../core/services/util.service';

@Injectable()
export class DataDriveService {

    constructor(
        private http: HttpClient,
        private utilSerive: UtilService
    ) { }

    async initDataDrive(name: string) {
        let pureOption = this.getDriveOption(name);
        if (typeof pureOption === 'string') {
            pureOption = await this.http.get(APPConfig.baseUrl + pureOption).toPromise().catch((err) => this.utilSerive.errDeal(err));
            if (pureOption) {
                pureOption = JSON.parse(pureOption);
            }
        }
        if (typeof pureOption === 'object') {
            return new DataDrive(pureOption);
        } else {
            return null;
        }
    }

    getInitData(dataDrive: DataDrive) {
        return this.http.get(APPConfig.baseUrl + dataDrive.APIs.search);
    }
    getDriveOption(name: string) {
        return DataDriveStore[name];
    }

}
