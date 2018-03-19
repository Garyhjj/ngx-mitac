import { NgxValidatorExtendService } from './../../../../core/services/ngx-validator-extend.service';
import { Router } from '@angular/router';
import { ServiceTimeInfo } from './../shared/models/index';
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
  }[] = [];
  dayInfo: ServiceTimeInfo[] = [];
  deptId = 1;
  dateFormat = 'YYYY-MM-DD';
  selectedDate: string;
  selectedTimeId;
  serviceTime;
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
    if(this.current === 2) {
      console.log(this.myForm.value)
    }else {
      this.current += 1;
      this.changeContent();
    }
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
          STATUS: ['NEW'],
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
