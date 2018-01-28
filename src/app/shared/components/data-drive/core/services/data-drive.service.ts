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

    toExcel(dataDrive: DataDrive) {
        if(!dataDrive) return;
        const tableData = dataDrive.tableData;
        const dataViewSet = dataDrive.dataViewSet;
        const name = (dataViewSet && dataViewSet.title) || 'default';
        const columns = tableData.columns;
        const data = tableData.data;
        let excelHeader = [];
        let excelData = [];
        if (columns && columns.length > 0) {
            excelHeader = columns.map(c => c.value);
        }
        if (data && data.length > 0) {
            excelData = data.map(c => c.map(d => d.value));
        }
        this.utilSerive.toExcel(name, excelHeader, excelData)
    }

}
