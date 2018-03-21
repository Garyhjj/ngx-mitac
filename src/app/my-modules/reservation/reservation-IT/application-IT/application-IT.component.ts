import { NgxValidatorExtendService } from './../../../../core/services/ngx-validator-extend.service';
import { Router } from '@angular/router';
import { ServiceTimeInfo, ReservationApplication } from './../shared/models/index';
import { UtilService } from './../../../../core/services/util.service';
import { ReservationITService } from './../shared/services/reservaton-IT.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { DayInterface } from 'ng-zorro-antd/src/calendar/nz-calendar.component';

@Component({
  selector: 'app-application-IT',
  templateUrl: './application-IT.component.html',
  styleUrls: ['./application-IT.component.css']
})
export class ApplicationITComponent implements OnInit {

  current = 0;

  index = 'First-content';
  myForm: FormGroup;
  dateMes: {
    CDATE: string,
    REMAIN_NUMBER: number
  }[];
  dayInfo: ServiceTimeInfo[] = [];
  deptId = 1;
  dateFormat = 'YYYY-MM-DD';
  selectedDate: string;
  selectedTimeId;
  serviceTime;
  selectedTimeMes: ServiceTimeInfo;
  constructor(
    private _message: NzMessageService,
    private fb: FormBuilder,
    private reservationITService: ReservationITService,
    private util: UtilService,
    private router: Router,
    private validatorExtendService: NgxValidatorExtendService
  ) {
  }



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
        const final = (id) => {
          this.util.dismissLoading(id);
        }
        this.reservationITService.updateService(val).subscribe(res => {
          final(loadingId);
          this.current += 1;
        }, err => {
          this.util.errDeal(err);
          final(loadingId);
        })
      } else {
        this._message.error('操作超時,當前時間已不允許申請該時間段的服務,請返回重新選擇');

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
      if (new Date(lastTime).getTime() - new Date().getTime() > time.PRE_MIN_MINUTE * 60 * 1000) {
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
        this.index = 'First-content';
        break;
      }
      case 1: {
        if (!this.selectedDate) return this.current = 0;
        this.dayInfo = [];
        this.selectedTimeId = 0;
        this.reservationITService.getServiceDayInfo(this.deptId, this.selectedDate).subscribe((c: ServiceTimeInfo[]) => {
          this.dayInfo = c;
        })
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
          MOBILE: ['', this.validatorExtendService.required()]
        });
        break;
      }
      default: {
        this.index = 'error';
      }
    }
  }

  selectCard(item: ServiceTimeInfo) {
    if (item.REMAIN_NUMBER > 0) {
      this.selectedTimeMes = item;
      this.selectedTimeId = item.TIME_ID;
      this.serviceTime = this.selectedDate + ' ' + item.START_TIME + ' ~ ' + item.END_TIME;
    }
  }

  getDetailByDate(date: DayInterface) {
    const target = this.dateMes.find(d => moment(new Date(d.CDATE)).format(this.dateFormat) === moment(date.date).format(this.dateFormat));
    return target ? target.REMAIN_NUMBER : '無服務';
  }

  selectDate(date: DayInterface) {
    if (this.getDetailByDate(date) > 0) {
      this.selectedDate = moment(date.date).format('YYYY-MM-DD');
    }
  }

  async ngOnInit() {
    await this.reservationITService.getITDeptId();
    if (this.reservationITService.deptId > 0) {
      this.deptId = this.reservationITService.deptId;
    } else {
      this.router.navigate(['/modules']);
    }
    let res = await this.reservationITService.getServiceDateMes(this.deptId).toPromise().catch((err) => this.util.errDeal(err));
    if (Array.isArray(res)) {
      this.dateMes = res;
    }
  }

}
