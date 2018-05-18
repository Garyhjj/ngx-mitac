import { APIGlobalConfig } from './../../shared/config/api-global.config';
import { MyStore, UserState } from './../store';
import { HttpClient } from '@angular/common/http';
import { Injectable, ErrorHandler } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable()
export class MyErrorHandlerService implements ErrorHandler {
  user: UserState;
  userID = -1;
  constructor(private http: HttpClient, private $store: Store<MyStore>) {
    this.$store.select(s => s.userReducer).subscribe(u => {
      this.user = u;
      this.userID = u.ID;
    });
  }
  handleError(err: any): void {
    console.error(err);
    if (err) {
      let log;
      if (err.status > -1) {
        log = new Log(err.status, err, this.userID);
      } else {
        log = new Log(0, { name: err.name, message: err.stack }, this.userID);
      }
      this.http.post(APIGlobalConfig.uploadError, log).subscribe(res => {});
    }
    // do something with the error
  }
}

class Log {
  STATUS_CODE: number;
  BODY: any;
  MOBILE_FLAG: 'Y' | 'N';
  EQUIP_NAME: string;
  CREATED_BY: number;
  constructor(code, body, by) {
    this.STATUS_CODE = code;
    this.BODY = body;
    this.CREATED_BY = by;
    this.MOBILE_FLAG = 'N';
    this.EQUIP_NAME = navigator.userAgent;
  }
}
