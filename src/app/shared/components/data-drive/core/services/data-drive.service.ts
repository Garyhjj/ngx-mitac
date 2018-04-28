import { isArray, parse } from './../../../../utils/index';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './../../../../../core/services/auth.service';
import { MyStore, UserState } from './../../../../../core/store';
import { DataDrive } from './../../shared/models/index';
import { APPConfig } from './../../../../config/app.config';
import { HttpClient } from '@angular/common/http';
import { DataDriveStore } from './../../shared/config/index';
import { Injectable } from '@angular/core';
import { UtilService } from '../../../../../core/services/util.service';
import { replaceQuery } from '../../../../utils/index';
import { DataDriveSettingConfig } from '../../../../../end/data-drive-setting/shared/config';

@Injectable()
export class DataDriveService {
  user: UserState;
  constructor(
    private http: HttpClient,
    private utilSerive: UtilService,
    private auth: AuthService,
  ) {
    this.user = this.auth.user;
  }

  async initDataDrive(name: string) {
    let pureOption = this.getDriveOption(name);
    // tslint:disable-next-line:no-unused-expression
    typeof pureOption === 'object' &&
      (pureOption = JSON.parse(JSON.stringify(pureOption)));
    let userName = this.user ? this.user.USER_NAME : '';
    if (typeof pureOption === 'number') {
      pureOption = await this.getSettingByNet(pureOption)
        .toPromise()
        .catch(err => {
          this.utilSerive.errDeal(err);
        });
      pureOption = pureOption || '';
    }
    if (typeof pureOption === 'object') {
      return new DataDrive(pureOption, userName);
    } else {
      return null;
    }
  }

  getSettingByNet(id) {
    return this.http
      .get(replaceQuery(DataDriveSettingConfig.getSetting, { id }))
      .map((d: any[]) => {
        if (isArray(d) && d.length === 1) {
          const opts: any = {};
          const target = d[0];
          opts.tableData = parse(target.TABLE_DATA);
          opts.updateSets = parse(target.UPDATE_SETS);
          opts.searchSets = parse(target.SEARCH_SETS);
          if (target.MAIN_SET) {
            Object.assign(opts, parse(target.MAIN_SET));
          }
          opts.id = target.ID;
          opts.description = target.DESCRIPTION;
          return opts;
        } else {
          return null;
        }
      });
  }

  getInitData(dataDrive: DataDrive) {
    const searchSets = dataDrive.searchSets;
    const def = {};
    if (isArray(searchSets)) {
      searchSets.forEach(s => {
        const opts = s.InputOpts;
        if (opts && opts.default !== void 0) {
          def[s.apiProperty ? s.apiProperty : s.property] = opts.default;
        }
      });
    }
    return this.searchData(dataDrive, def);
  }

  searchData(dataDrive: DataDrive, params: any = {}) {
    const newSearchWay = dataDrive.runChangeSearchWay(params) as Observable<
      any
    >;
    if (newSearchWay instanceof Observable) {
      return newSearchWay;
    }
    if (Object.keys(params).length === 0) {
      params = dataDrive.lastestSearchParams
        ? dataDrive.lastestSearchParams
        : {};
    } else {
      dataDrive.lastestSearchParams = params;
    }
    const isCompanyLimited = dataDrive.isCompanyLimited() as any;
    if (isCompanyLimited) {
      params = this.addCompanyID(params, isCompanyLimited);
    }
    params = dataDrive.runBeforeSearch(params) || params;
    const defaultSearchParams =
      (dataDrive.tableData && dataDrive.tableData.defaultSearchParams) || {};
    const copyDefault = Object.assign(
      {},
      this.bindUserMesFordefaultSearchParams(defaultSearchParams),
    );
    params = Object.assign(copyDefault, params);
    return this.http.get(
      replaceQuery(
        APPConfig.baseUrl + dataDrive.APIs.search,
        params,
        this.user,
      ),
    );
  }
  bindUserMesFordefaultSearchParams(p) {
    for (const prop in p) {
      if (p.hasOwnProperty(prop)) {
        const val = p[prop];
        if (typeof val === 'string') {
          p[prop] = replaceQuery(p[prop], this.user);
        }
      }
    }
    return p;
  }
  getDriveOption(name: string) {
    if (typeof name === 'object') {
      return name;
    }
    return DataDriveStore[name];
  }
  updateViewData(dataDrive: DataDrive) {
    this.getInitData(dataDrive).subscribe(
      (c: any[]) => {
        this.initTableData(dataDrive, c);
      },
      err => this.utilSerive.errDeal(err),
    );
  }

  initTableData(dataDrive: DataDrive, ds: any[]) {
    let tableData = dataDrive.tableData;
    const alterData = dataDrive.runBeforeInitTableData(ds);
    if (alterData) {
      ds = alterData;
    }
    if (ds.length && ds.length > 0) {
      const sortMes = Object.keys(ds[0]);
      // 根据返回的数据筛选已配置的列
      tableData.columns = tableData.columns.filter(
        c => sortMes.indexOf(c.property) > -1,
      );
      const mySort = tableData.columns.map(c => c.property);
      // tableData.columns.sort((a, b) => sortMes.indexOf(a.property) - sortMes.indexOf(b.property));
      const columnsPros = tableData.columns.map(c => c.property);
      const data = ds.map(d => {
        const trs = [];
        for (const prop in d) {
          if (Object.prototype.hasOwnProperty.call(d, prop)) {
            trs.push({
              property: prop,
              value: d[prop],
              hide: columnsPros.indexOf(prop) > -1 ? false : true,
            });
          }
        }
        // 根據配置排序拿到的數據
        return trs.sort(
          (a, b) => mySort.indexOf(a.property) - mySort.indexOf(b.property),
        );
      });
      tableData.data = data;
    } else {
      tableData.data = [];
    }
    dataDrive.emitAfterDataInit(ds);
  }

  updateData(dataDrive: DataDrive, ds: any) {
    ds = dataDrive.runOnUpdateData(ds);
    const isCompanyLimited = dataDrive.isCompanyLimited() as any;
    if (isCompanyLimited) {
      ds = this.addCompanyID(ds, isCompanyLimited);
    }
    const newUpdateWay = dataDrive.runChangeUpdateWay(ds) as Observable<any>;
    if (newUpdateWay instanceof Observable) {
      return newUpdateWay;
    }
    if (!dataDrive.APIs || !dataDrive.APIs.update) {
      throw new Error('沒有找到更新的api配置信息');
    }
    const url = dataDrive.APIs.update;
    return this.http.post(APPConfig.baseUrl + url, ds);
  }

  deleteData(dataDrive: DataDrive, ds: any[]) {
    if (!dataDrive.APIs || !dataDrive.APIs.delete) {
      throw new Error('沒有找到刪除的api配置信息');
    }
    const url = dataDrive.APIs.delete;
    const out: any = {};
    ds.forEach(d => {
      out[d.property] = d.value;
    });
    return this.http.delete(
      replaceQuery(APPConfig.baseUrl + url, out, this.user),
    );
  }
  toExcel(dataDrive: DataDrive) {
    if (!dataDrive) {
      return;
    }
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
    this.utilSerive.toExcel(name, excelHeader, excelData);
  }

  addCompanyID(send: any, otherName: string) {
    if (typeof send === 'object' && this.user) {
      const name = typeof otherName === 'string' ? otherName : 'company_id';
      const out = Object.assign({}, send, { [name]: this.user.COMPANY_ID });
      return out;
    } else {
      return send;
    }
  }

  lazyLoad(api: string) {
    if (!api) {
      throw new Error('無API');
    }
    return this.http.get(
      replaceQuery(
        api.indexOf('https:') > -1 || api.indexOf('http:') > -1
          ? api
          : APPConfig.baseUrl + api,
        {},
        this.user,
      ),
    );
  }
}
