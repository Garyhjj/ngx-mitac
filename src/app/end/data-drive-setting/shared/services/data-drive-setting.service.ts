import { DataDriveService } from './../../../../shared/components/data-drive/core/services/data-drive.service';
import { DataDriveSettingConfig } from './../config/index';
import { UserState } from './../../../../core/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { replaceQuery, stringify } from '../../../../shared/utils';

@Injectable()
export class DataDriveSettingService {
  user: UserState;
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private dataDriveService: DataDriveService,
  ) {
    this.user = this.auth.user;
  }

  uploadSetting(d) {
    if (typeof d !== 'object') {
      throw new Error('API參數不對');
    }
    const send: any = {};
    send.ID = d.id > 0 ? d.id : 0;
    send.TABLE_DATA = stringify(d.tableData);
    delete d.tableData;
    send.UPDATE_SETS = stringify(d.updateSets);
    delete d.updateSets;
    send.SEARCH_SETS = stringify(d.searchSets);
    send.DESCRIPTION = d.description;
    delete d.searchSets;
    delete d.id;
    delete d.description;
    send.MAIN_SET = stringify(d);
    for (let prop in send) {
      if (send.hasOwnProperty(prop)) {
        const value = send[prop];
        if (value === '' || value === void 0 || value === null) {
          delete send[prop];
        }
      }
    }
    return this.http.post(DataDriveSettingConfig.uploadSetting, send);
    // return this.http.put(DataDriveSettingConfig.uploadSetting, {
    //   columns: { ...send },
    //   where: {
    //     id: send.ID,
    //   },
    // });
  }

  getSetting(id) {
    return this.dataDriveService.getSettingByNet(id);
  }
}
