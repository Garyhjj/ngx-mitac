import { TranslateService } from '@ngx-translate/core';
import { UtilService } from './../../../../core/services/util.service';
import { ReservationITService } from './../shared/services/reservaton-IT.service';
import { AppService } from './../../../../core/services/app.service';
import { NgxValidatorExtendService } from './../../../../core/services/ngx-validator-extend.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { isArray, sortUtils } from '../../../../shared/utils';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-IT-server-add',
  templateUrl: './IT-server-add.component.html',
  styleUrls: ['./IT-server-add.component.css'],
})
export class ITServerAddComponent implements OnInit {
  myForm: FormGroup;
  translateText: any = {};
  // disabledHours;
  searchFilter;
  statusOpts = [
    { property: 'Closed', value: '完成' },
    { property: 'New', value: '待受理' },
    { property: 'Processing', value: '处理中' },
  ];
  disabledMinutes = () => {
    let arr = [];
    for (let i = 1; i < 60; i++) {
      arr.push(i);
    }
    arr.splice(29, 1);
    return arr;
  };
  constructor(
    private fb: FormBuilder,
    private validatorExtendService: NgxValidatorExtendService,
    private gbService: AppService,
    private reservationITService: ReservationITService,
    private util: UtilService,
    private translateService: TranslateService,
  ) {}

  async ngOnInit() {
    this.translateService
      .get(['serviceModule.submitSuccess'])
      .subscribe(_ => (this.translateText = _));
    this.initForm();
    await this.reservationITService.getITDeptId();
    const deptId = this.reservationITService.deptId;
    this.reservationITService.getPersonList(deptId).subscribe((res: any[]) => {
      this.searchFilter = ds =>
        ds.filter(d => d).filter(d => res.find(r => r.EMPNO === d.EMPNO));
    });
    // this.reservationITService.getServiceTime(deptId).subscribe((m: any[]) => {
    //   if (m && m.length > 0) {
    //     const min = m.sort((a: any, b: any) =>
    //       sortUtils.byTime(a.START_TIME, b.END_TIME, true),
    //     )[0];
    //     const max = m.sort((a: any, b: any) =>
    //       sortUtils.byTime(a.START_TIME, b.END_TIME, false),
    //     )[0];
    //     const minTime = min.START_TIME ? +min.START_TIME.slice(0, 2) : 0;
    //     const endTime = max.END_TIME ? +max.END_TIME.slice(0, 2) : 23;
    // const timeHourValues: number[] = [];
    // for (let i = 0; i <= 23; i++) {
    //   timeHourValues.push(i);
    // }
    // timeHourValues.splice(minTime, endTime - minTime + 1);
    // this.myForm.patchValue({
    //   fromTime: (minTime < 10 ? '0' + minTime : minTime) + ':00',
    //   endTime: endTime + ':30',
    // });
    // this.disabledHours = () => timeHourValues;
    //   }
    // });
  }

  initForm() {
    let form = this.fb.group({
      SERVICE_DATE: [
        moment().format('YYYY-MM-DD'),
        this.validatorExtendService.required(),
      ],
      SERVICE_DESC: ['', this.validatorExtendService.required()],
      IMAGES: [],
      CONTACT: ['', this.validatorExtendService.required()],
      MOBILE: ['', this.validatorExtendService.required()],
      HANDLER: [''],
      TYPE: [null],
      REMARK: [''],
      HANDLE_TIME: [null],
      STATUS: ['Closed'],
    });
    const validate = () => {
      const from = form.get('fromTime');
      const end = form.get('endTime');
      if (from && end && from.value && end.value) {
        const date = '2018-01-01';
        if (moment(date + ' ' + from.value).isBefore(date + ' ' + end.value)) {
          return null;
        } else {
          return {
            timeError: true,
          };
        }
      }
      return null;
    };
    form.addControl(
      'fromTime',
      this.fb.control('', [
        this.validatorExtendService.required(),
        this.validatorExtendService.selfDefine(ctrl => {
          return validate();
        }),
      ]),
    );
    form.addControl(
      'endTime',
      this.fb.control('', [
        this.validatorExtendService.required(),
        this.validatorExtendService.selfDefine(ctrl => {
          return validate();
        }),
      ]),
    );
    const empno = this.reservationITService.user.EMPNO;
    form.get('CONTACT').setValue(empno);
    form.get('HANDLER').setValue(empno);
    setTimeout(() => {
      form.get('CONTACT').valueChanges.subscribe(v => {
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
    }, 200);
    this.myForm = form;
    const today = new Date(),
      hour = today.getHours(),
      minute = today.getMinutes();

    if (minute > 30) {
      const nextHour = hour + 1;
      this.myForm.patchValue({
        fromTime: (hour < 10 ? '0' + hour : hour) + ':30',
        endTime: (nextHour < 10 ? '0' + nextHour : nextHour) + ':00',
      });
    } else {
      const hourFormat = hour < 10 ? '0' + hour : hour;
      this.myForm.patchValue({
        fromTime: hourFormat + ':00',
        endTime: hourFormat + ':30',
      });
    }
  }

  submitForm() {
    const val = Object.assign({}, this.myForm.value);
    val.DEPT_ID = this.reservationITService.deptId;
    val.addServiceLater = true;
    val.ID = 0;
    const loadingID = this.util.showLoading();
    const final = () => this.util.dismissLoading(loadingID);
    this.reservationITService.updateService(val).subscribe(
      _ => {
        final();
        this.util.showGlobalSucMes(
          this.translateText['serviceModule.submitSuccess'],
        );
        this.myForm = null;
        setTimeout(() => {
          this.initForm();
        }, 10);
      },
      err => {
        final();
        this.util.errDeal(err);
      },
    );
  }
}
