import { NgxValidatorExtendService } from './../../../../core/services/ngx-validator-extend.service';
import { Observable } from 'rxjs/Observable';
import { NzModalService } from 'ng-zorro-antd';
import { DataDriveService } from './../../../../shared/components/data-drive/core/services/data-drive.service';
import { UtilService } from './../../../../core/services/util.service';
import { InspectionBossService } from './../shared/services/inspection-boss.service';
import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../../../shared/components/data-drive/shared/models/index';
import { FormBuilder } from '@angular/forms';
import { FormGroup, FormArray } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { isArray } from '../../../../shared/utils/index';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-inspection-boss-schedule',
  templateUrl: './inspection-boss-schedule.component.html',
  styleUrls: ['./inspection-boss-schedule.component.css'],
})
export class InspectionBossScheduleComponent implements OnInit {
  isVisible = false;
  formLayout = 'horizontal';
  scheduleForm: FormGroup;
  linesList;
  allDataDrive: any = {};
  tabIdx = 0;
  currentDataDrive: DataDrive;
  mriWeekList;
  weekOption;
  timeErr = '';
  translateTexts: any;
  changeUpdateViewer = data => {
    this.initForm(data);
    this.isVisible = true;
    return false;
  };
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private inspectionBossService: InspectionBossService,
    private util: UtilService,
    private dataDriveService: DataDriveService,
    private modalService: NzModalService,
    private validatorExtendService: NgxValidatorExtendService,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    this.translate
      .stream([
        'insoectionModule.startimeBeforeEndtime',
        'insoectionModule.sureDelete',
        'insertSuccess',
        'updateSuccess',
      ])
      .subscribe(res => {
        this.translateTexts = res;
      });
  }

  initForm(data?) {
    if (this.tabIdx === 2 && !this.mriWeekList) {
      this.inspectionBossService.getMriWeek().subscribe(c => {
        this.mriWeekList = c;
        this.weekOption = this.mriWeekList.map(m => ({
          property: m.WEEK_ID,
          value: m.WEEK_DESC,
        }));
      });
    }
    let array = [];
    if (isArray(data.empnoList)) {
      data.empnoList.forEach(n => array.push(this.initEmpno(n.trim())));
    } else {
      array.push(this.initEmpno());
    }
    if (data.linesList) {
      this.linesList = data.linesList;
    } else {
      this.linesList = [];
    }
    this.scheduleForm = this.fb.group({
      SCHEDULE_HEADER_ID: [data.SCHEDULE_HEADER_ID],
      SCHEDULE_NAME: [
        this.tabIdx === 2
          ? (() => {
              if (data.WEEK && data.YEAR) {
                return (
                  data.YEAR + (+data.WEEK < 10 ? '0' + data.WEEK : data.WEEK)
                );
              }
            })()
          : '',
        this.tabIdx === 2 ? this.validatorExtendService.required() : null,
      ],
      AREA: [
        data.AREA,
        this.tabIdx === 2 ? this.validatorExtendService.required() : null,
      ],
      FROM_DATE: [
        data.FROM_DATE,
        this.tabIdx !== 2 ? this.validatorExtendService.required() : null,
      ],
      FROM_TIME: [
        data.FROM_TIME ? data.FROM_TIME : '08:00',
        this.validatorExtendService.required(),
      ],
      TO_TIME: [
        data.TO_TIME ? data.TO_TIME : '18:00',
        this.validatorExtendService.required(),
      ],
      empnos: this.fb.array(array),
    });
    const fromTime = this.scheduleForm.get('FROM_TIME');
    const toTime = this.scheduleForm.get('TO_TIME');
    // 核對時間的合法性
    Observable.merge(fromTime.valueChanges, toTime.valueChanges).subscribe(
      c => {
        const prefix = '2018-01-01 ';
        if (
          new Date(prefix + fromTime.value).getTime() -
            new Date(prefix + toTime.value).getTime() <
          0
        ) {
          this.timeErr = '';
        } else {
          this.timeErr = this.translateTexts[
            'insoectionModule.startimeBeforeEndtime'
          ];
        }
      },
    );
  }

  initEmpno(val?) {
    return this.fb.group({
      person: [val, this.validatorExtendService.required()],
    });
  }

  cancleEmp(i) {
    const empnos = this.scheduleForm.get('empnos') as FormArray;
    const val = empnos.controls[i].value;
    if (val && val.person) {
      const store = this.linesList.find(l => l.EMPNO === val.person);
      // 刪除前對已在數據庫有的記錄進行詢問
      if (store) {
        const deleteFn = () => {
          this.inspectionBossService
            .deleteScheduleLines(store.SCHEDULE_LINE_ID)
            .subscribe(
              () => {
                empnos.removeAt(i);
                this.currentDataDrive = this.allDataDrive[this.tabIdx + 2];
                this.dataDriveService.updateViewData(this.currentDataDrive);
              },
              err => this.util.errDeal(err),
            );
        };
        this.modalService.confirm({
          title: this.translateTexts['insoectionModule.sureDelete'],
          onOk() {
            deleteFn();
          },
          onCancel() {},
          zIndex: 99999,
        });
      } else {
        empnos.removeAt(i);
      }
    } else {
      empnos.removeAt(i);
    }
  }

  addEmp() {
    const empnos = this.scheduleForm.get('empnos') as FormArray;
    empnos.push(this.initEmpno());
  }

  submitForm() {
    const val = this.scheduleForm.value;
    const user = this.auth.user;
    let weekDes = val.SCHEDULE_NAME
      ? this.mriWeekList.find(m => m.WEEK_ID === val.SCHEDULE_NAME)
      : {};
    weekDes = weekDes || {};
    let week, year;
    // 7s有這些項目
    if (weekDes.WEEK_ID) {
      week = +weekDes.WEEK_ID.slice(4);
      year = +weekDes.WEEK_ID.slice(0, 4);
    }
    const Header = {
      AREA: val.AREA || '',
      COMPANY_NAME: user.COMPANY_ID || '',
      ENABLED: 'Y',
      FROM_DATE: weekDes.WEEK_START_DAY || val.FROM_DATE || '',
      FROM_TIME: val.FROM_TIME || '',
      NAME_ID: this.tabIdx + 2,
      SCHEDULE_DATE: val.FROM_DATE || '',
      SCHEDULE_HEADER_ID: val.SCHEDULE_HEADER_ID || 0,
      SCHEDULE_NAME: weekDes.WEEK_DESC || '',
      TO_DATE: weekDes.WEEK_END_DAY || val.FROM_DATE || '',
      TO_TIME: val.TO_TIME || '',
      WEEK: week || '',
      YEAR: year || '',
    };
    const Lines = [];
    if (val.empnos && val.empnos.length > 0) {
      val.empnos.forEach((c, idx) => {
        if (c.person) {
          const person = c.person;
          const l = this.linesList.find(li => li.EMPNO === person);
          Lines.push({
            EMPNO: person,
            LINE_NUM: idx + 1,
            SCHEDULE_HEADER_ID: l ? l.SCHEDULE_HEADER_ID : 0,
            SCHEDULE_LINE_ID: l ? l.SCHEDULE_LINE_ID : 0,
          });
        }
      });
    }
    this.inspectionBossService
      .uploadSchedule({ Schedules: [{ Header, Lines }] })
      .subscribe(
        r => {
          this.util.showGlobalSucMes(
            val.SCHEDULE_HEADER_ID < 0
              ? this.translateTexts['insertSuccess']
              : this.translateTexts['updateSuccess'],
          );
          this.isVisible = false;
          this.currentDataDrive = this.allDataDrive[this.tabIdx + 2];
          this.dataDriveService.updateViewData(this.currentDataDrive);
        },
        err => this.util.errDeal(err),
      );
  }
  getDataDrive2(d: DataDrive) {
    const nameId = 2;
    this.alterDataDrive(d, nameId);
  }

  getDataDrive3(d: DataDrive) {
    const nameId = 3;
    this.alterDataDrive(d, nameId);
  }

  getDataDrive4(d: DataDrive) {
    const nameId = 4;
    this.alterDataDrive(d, nameId);
    d.beforeSearch(data => {
      if (data && data.week) {
        data.week = data.week.slice(4);
      }
      return data;
    });
  }

  alterDataDrive(d: DataDrive, nameId: number) {
    this.allDataDrive[nameId] = d;
    d.addDefaultSearchParams({ nameID: nameId });
    d.beforeInitTableData(data => this.combineSameHeader(data));
    d.beforeUpdateShow(this.changeUpdateViewer);
  }

  combineSameHeader(data) {
    let myData = [];
    while (data && data.length > 0) {
      let one = data.shift();
      one.linesList = [one];
      one.empnoList = [one.EMPNO];
      if (data.length > 0) {
        let same = data.filter(
          d => d.SCHEDULE_HEADER_ID === one.SCHEDULE_HEADER_ID,
        );
        if (same.length > 0) {
          same.forEach(s => {
            one.NAME += ', ' + s.NAME;
            one.empnoList.push(s.EMPNO);
            one.linesList.push(s);
          });
          data = data.filter(
            d => d.SCHEDULE_HEADER_ID !== one.SCHEDULE_HEADER_ID,
          );
        }
      }
      myData.push(one);
    }
    return myData;
  }
}
