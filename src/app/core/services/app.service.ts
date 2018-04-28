import { UserUpdateModules } from './../actions/user.action';
import { MyStore, MyModule } from './../store';
import { Store } from '@ngrx/store';
// tslint:disable
import { tify } from '../../shared/utils/chinese-conv';
import { APIGlobalConfig } from './../../shared/config/api-global.config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { replaceQuery } from '../../shared/utils/index';
import { AuthService } from './auth.service';

@Injectable()
export class AppService {
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private store$: Store<MyStore>,
  ) { }

  getColleague(name: string): Observable<any> {
    if (!(typeof name === 'string') || !name) return Observable.of([]);
    let emp_name = name.toUpperCase();
    emp_name = tify(emp_name)
      .replace(/^\"/g, '')
      .replace(/\"$/g, '');
    return this.http.get(
      replaceQuery(APIGlobalConfig.getAgentUrl, { emp_name }),
    );
  }

  uploadPicture(img: string) {
    if (!img) return;
    img = img.replace(/data\:image\/\w+\;base64\,/, '');
    return this.http
      .post(APIGlobalConfig.uploadPicture, { PICTURE: img })
      .map(res => {
        let url = res['PICTURE_URL'];
        return url;
      });
  }

  getAllTips() {
    const user = this.auth.user;
    const send = {
      empno: user.EMPNO,
      company_name: user.COMPANY_ID,
      moduleId: [61, 26031]
    }
    this.http.post(APIGlobalConfig.getAllTips, send).subscribe((tips: MyModule[]) => {
      this.store$.dispatch(new UserUpdateModules(tips));
    })
  }
}

