import { AppService } from './../../../../core/services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxValidatorExtendService } from './../../../../core/services/ngx-validator-extend.service';
import { Router } from '@angular/router';
import {
  ServiceTimeInfo,
  ReservationApplication,
} from './../shared/models/index';
import { UtilService } from './../../../../core/services/util.service';
import { ReservationITService } from './../shared/services/reservaton-IT.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { isArray } from '../../../../shared/utils';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-application-IT',
  templateUrl: './application-IT.component.html',
  styleUrls: ['./application-IT.component.css'],
})
export class ApplicationITComponent implements OnInit {
  current = 0;

  index = 'First-content';
  myForm: FormGroup;
  dateMes: {
    CDATE: string;
    REMAIN_NUMBER: number;
    DONE_FLAG: string;
  }[];
  dayInfo: ServiceTimeInfo[] = [];
  deptId = 1;
  dateFormat = 'YYYY-MM-DD';
  selectedDate: string;
  selectedTimeId;
  serviceTime;
  selectedTimeMes: ServiceTimeInfo;
  noServiceText: string;
  loading: boolean;
  constructor(
    private _message: NzMessageService,
    private fb: FormBuilder,
    private reservationITService: ReservationITService,
    private util: UtilService,
    private router: Router,
    private validatorExtendService: NgxValidatorExtendService,
    private gbService: AppService,
    private translateService: TranslateService,
    private appService: AppService,
  ) {}

  pre() {
    this.current -= 1;
    this.changeContent();
  }

  next() {
    if (this.current === 2) {
      let val: ReservationApplication = Object.assign({}, this.myForm.value);
      val.DEPT_ID = this.deptId;
      val.SERVICE_DATE = this.selectedDate;
      val.TIME_ID = this.selectedTimeId;
      val.START_TIME = this.selectedTimeMes.START_TIME;
      val.END_TIME = this.selectedTimeMes.END_TIME;
      val.ID = 0;
      if (this.testTime()) {
        let loadingId = this.util.showLoading();
        this.loading = true;
        const final = id => {
          this.util.dismissLoading(id);
          this.loading = false;
        };
        this.reservationITService.updateService(val).subscribe(
          res => {
            final(loadingId);
            this.current += 1;
            this.changeContent();
            this.appService.getAllTips();
            this.reservationITService.callForWholeUpdate();
          },
          err => {
            this.util.errDeal(err);
            final(loadingId);
          },
        );
      } else {
        this._message.error(
          '操作超時,當前時間已不允許申請該時間段的服務,請返回重新選擇',
        );
      }
    } else {
      this.current += 1;
      this.changeContent();
    }
  }

  testTime() {
    const time = this.dayInfo.find(d => d.TIME_ID === this.selectedTimeId);
    if (time) {
      const lastTime = this.selectedDate + ' ' + time.END_TIME;
      if (
        new Date(lastTime).getTime() - new Date().getTime() >
        time.PRE_MIN_MINUTE * 60 * 1000
      ) {
        return true;
      }
    }
    return false;
  }

  done() {
    this._message.success('done');
  }

  canNext() {
    switch (this.current) {
      case 0: {
        return this.selectedDate;
      }
      case 1:
        return this.selectedTimeId;
      case 2:
        return this.myForm.valid;
    }
  }

  changeContent() {
    switch (this.current) {
      case 0: {
        this.selectedDate = '';
        this.dateMes = null;
        const loadingId = this.util.showLoading();
        const final = () => this.util.dismissLoading(loadingId);
        this.reservationITService.getServiceDateMes(this.deptId).subscribe(
          (res: any) => {
            this.dateMes = res;
            final();
          },
          err => {
            this.util.errDeal(err);
            final();
          },
        );
        break;
      }
      case 1: {
        if (!this.selectedDate) {
          return (this.current = 0);
        }
        this.dayInfo = [];
        this.selectedTimeId = 0;
        const loadingId = this.util.showLoading();
        const final = () => this.util.dismissLoading(loadingId);
        this.reservationITService
          .getServiceDayInfo(this.deptId, this.selectedDate)
          .subscribe(
            (c: ServiceTimeInfo[]) => {
              this.dayInfo = c;
              final();
            },
            err => {
              this.util.errDeal(err);
              final();
            },
          );
        break;
      }
      case 2: {
        this.myForm = this.fb.group({
          STATUS: ['New'],
          DEPT_ID: [],
          SERVICE_DATE: [],
          TIME_ID: [],
          SERVICE_DESC: ['', this.validatorExtendService.required()],
          IMAGES: [],
          CONTACT: ['', this.validatorExtendService.required()],
          MOBILE: ['', this.validatorExtendService.required()],
        });
        const contactInput = this.myForm.get('CONTACT');
        contactInput.valueChanges.subscribe(v => {
          this.gbService.getColleague(v).subscribe(cg => {
            if (isArray(cg) && cg.length === 1) {
              const tar = cg[0];
              this.myForm.get('MOBILE').setValue(
                (() => {
                  const mobile = tar.MOBILE;
                  const telephone = tar.TELEPHONE;
                  if (mobile && telephone) {
                    return `${telephone} / ${mobile}`;
                  } else {
                    return mobile ? mobile : telephone ? telephone : '';
                  }
                })(),
              );
            }
          });
        });
        contactInput.setValue(this.reservationITService.user.EMPNO);
        break;
      }
      case 3: {
        setTimeout(() => {
          this.current = 0;
          this.changeContent();
        }, 2500);
        break;
      }
      default: {
      }
    }
  }

  selectCard(item: ServiceTimeInfo) {
    if (item.REMAIN_NUMBER > 0) {
      this.selectedTimeMes = item;
      this.selectedTimeId = item.TIME_ID;
      this.serviceTime =
        this.selectedDate + ' ' + item.START_TIME + ' ~ ' + item.END_TIME;
      this.next();
    }
  }

  getDetailByDate(date: any) {
    const target = this.dateMes.find(
      d =>
        this.util.dateFormat(new Date(d.CDATE), this.dateFormat) ===
        this.util.dateFormat(date, this.dateFormat),
    );
    return target ? target.REMAIN_NUMBER : 0;
  }

  getIsHasApplictionByDate(date: any) {
    const target = this.dateMes.find(
      d =>
        this.util.dateFormat(new Date(d.CDATE), this.dateFormat) ===
        this.util.dateFormat(date, this.dateFormat),
    );
    return target ? target.DONE_FLAG === 'Y' : false;
  }

  selectDate(date: any) {
    if (this.getDetailByDate(date) > 0) {
      this.selectedDate = this.util.dateFormat(date, 'YYYY-MM-DD');
      this.next();
    }
  }

  async ngOnInit() {
    this.translateService.get('serviceModule.noService').subscribe(data => {
      this.noServiceText = data;
    });

    await this.reservationITService.getITDeptId();
    if (this.reservationITService.deptId > 0) {
      this.deptId = this.reservationITService.deptId;
    } else {
      this.router.navigate(['/modules']);
    }
    const loadingId = this.util.showLoading();
    let res = await this.reservationITService
      .getServiceDateMes(this.deptId)
      .toPromise()
      .catch(err => this.util.errDeal(err));
    this.util.dismissLoading(loadingId);
    if (Array.isArray(res)) {
      this.dateMes = res;
    }
  }
}
