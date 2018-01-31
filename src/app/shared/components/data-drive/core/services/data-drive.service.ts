import { AuthService } from './../../../../../core/services/auth.service';
import { myStore, UserState } from './../../../../../core/store';
import { DataDrive } from './../../shared/models/index';
import { APPConfig } from './../../../../config/app.config';
import { HttpClient } from '@angular/common/http';
import { DataDriveStore } from './../../shared/config/index';
import { Injectable } from '@angular/core';
import { UtilService } from '../../../../../core/services/util.service';
import { replaceQuery } from '../../../../utils/index';

@Injectable()
export class DataDriveService {
    user: UserState;
    constructor(
        private http: HttpClient,
        private utilSerive: UtilService,
        private auth: AuthService
    ) { 
        this.user = this.auth.user;
    }

    async initDataDrive(name: string) {
        let pureOption = this.getDriveOption(name);
        let userName = this.user? this.user.USER_NAME: '';
        if (typeof pureOption === 'string') {
            pureOption = await this.http.get(replaceQuery(APPConfig.baseUrl + pureOption, {})).toPromise().catch((err) => this.utilSerive.errDeal(err));
            if (pureOption) {
                pureOption = JSON.parse(pureOption);
            }
        }
        if (typeof pureOption === 'object') {
            return new DataDrive(pureOption, userName);
        } else {
            return null;
        }
    }

    getInitData(dataDrive: DataDrive) {
        return this.searchData(dataDrive);
    }

    searchData(dataDrive: DataDrive, params: any = {}) {
        if (typeof params !== 'object') {
            params = {};
        }
        return this.http.get(replaceQuery(APPConfig.baseUrl + dataDrive.APIs.search, params));
    }
    getDriveOption(name: string) {
        return DataDriveStore[name];
    }
    updateViewData(dataDrive: DataDrive) {
        this.getInitData(dataDrive).subscribe((c:any[]) => {
            this.initTableData(dataDrive, c);
        });
    }

    initTableData(dataDrive: DataDrive, ds: any[]) {
        const tableData = dataDrive.tableData;
        if (ds.length && ds.length > 0) {
            const sortMes = Object.keys(ds[0]);
            // 根据返回的数据筛选已配置的列
            tableData.columns = tableData.columns.filter(c => sortMes.indexOf(c.property) > -1);
            tableData.columns.sort((a, b) => sortMes.indexOf(a.property) - sortMes.indexOf(b.property));
            const columnsPros = tableData.columns.map(c => c.property);
            const data = ds.map(d => {
                const trs = [];
                for (const prop in d) {
                    if (Object.prototype.hasOwnProperty.call(d, prop)) {
                        trs.push({ property: prop, value: d[prop], hide: columnsPros.indexOf(prop) > -1? false: true});
                    }
                }
                return trs;
            });
            tableData.data = data;
        }else {
            tableData.data = [];
        }
        dataDrive.emitAfterDataInit();
    }

    updateData(dataDrive: DataDrive, ds: any) {
        if(!dataDrive.APIs || !dataDrive.APIs.update) {
            throw new Error('沒有找到更新的api配置信息');
        }
        const url = dataDrive.APIs.update;
        return this.http.post(APPConfig.baseUrl + url, ds);
    }

    deleteData(dataDrive: DataDrive, ds: any[]) {
        if(!dataDrive.APIs || !dataDrive.APIs.delete) {
            throw new Error('沒有找到刪除的api配置信息');
        }
        const url = dataDrive.APIs.delete;
        let prop = 'ID';
        const target = ds.find(d => d.property === prop);
        if(!target) {
            throw new Error('沒有找到刪除的api所需的參數'+ prop.toLowerCase());
        }
        const send = {id: target.value};
        return this.http.delete(replaceQuery(APPConfig.baseUrl + url, send));
    }
    toExcel(dataDrive: DataDrive) {
        if (!dataDrive) return;
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
            excelData = data.map(c => c.filter(s => !s.hide).map(d => d.value));
        }
        this.utilSerive.toExcel(name, excelHeader, excelData)
    }

}
