import { AppService } from './../../../../core/services/app.service';
import { NgxValidatorExtendService } from './../../../../core/services/ngx-validator-extend.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { UtilService } from './../../../../core/services/util.service';
import { NzModalService } from 'ng-zorro-antd';
import { ReservationApplication } from './../shared/models/index';
import { DataDriveService } from './../../../../shared/components/data-drive/core/services/data-drive.service';
import { ReservationITService } from './../shared/services/reservaton-IT.service';
import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../../../shared/components/data-drive/shared/models';
import * as moment from 'moment';
import { ImpressionListComponent } from '../shared/components/impression-list/impression-list.component';
import { isArray } from '../../../../shared/utils';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-self-application-IT',
  templateUrl: './self-application-IT.component.html',
  styleUrls: ['./self-application-IT.component.css'],
})
export class SelfApplicationITComponent implements OnInit {
  tabIdx;
  timeMes;

  d1: DataDrive;
  d2: DataDrive;
  d3: DataDrive;
  d4: DataDrive;
  impressionName = 'impression';
  extralList = [this.impressionName, 'SCORE', 'USER_COMMENT'];
  isImpressionVisible = false;
  isCommentVisible = false;
  impressionList: any[];
  impressionSelected: any = {};
  myForm: FormGroup;
  commentTarget: ReservationApplication;
  dateFormat = 'YYYY-MM-DDT HH:mm:ss';
  newCount;
  processingCount;
  commentCount;
  constructor(
    private reservationITService: ReservationITService,
    private dataDriveService: DataDriveService,
    private modalService: NzModalService,
    private util: UtilService,
    private fb: FormBuilder,
    private validatorExtendService: NgxValidatorExtendService,
    private gbService: AppService,
    private appService: AppService,
  ) {}

  ngOnInit() {}

  tabChange(idx) {}
  alterUpdate(d: DataDrive) {
    d.beforeUpdateSubmit((fg, sub, ori) => {
      return {
        DOCNO: ori.DOCNO,
        LAST_UPDATED_DATE: ori.LAST_UPDATED_DATE,
      };
    });
  }

  async getDataDrive1(d: DataDrive) {
    this.alterUpdate(d);
    this.d1 = d;
    d.tableData.columns = d.tableData.columns.filter(
      c => this.extralList.indexOf(c.property) < 0,
    );
    await this.alterData(d);
    d.addDefaultSearchParams({ status: 'New' });
    d.beforeUpdateShow(data => {
      if (data.STATUS === 'New') {
        return true;
      } else {
        return false;
      }
    });
    d.onUpdateFormShow(fg => {
      const contactInput = fg.get('CONTACT');
      contactInput.valueChanges.subscribe(v => {
        this.gbService.getColleague(v).subscribe(cg => {
          if (isArray(cg) && cg.length === 1) {
            const tar = cg[0];
            fg.get('MOBILE').setValue(
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
    });
    d.afterDataInit(ds => (this.newCount = ds.length));
    this.dataDriveService.updateViewData(d);
  }

  async getDataDrive2(d: DataDrive) {
    this.alterUpdate(d);
    this.d2 = d;
    d.tableData.columns = d.tableData.columns.filter(
      c => this.extralList.indexOf(c.property) < 0,
    );
    await this.alterData(d);
    d.addDefaultSearchParams({ status: 'Processing' });
    d.afterDataInit(ds => (this.processingCount = ds.length));
    this.dataDriveService.updateViewData(d);
  }

  async getDataDrive3(d: DataDrive) {
    this.alterUpdate(d);
    this.d3 = d;
    d.tableData.editable = false;
    d.tableData.columns = d.tableData.columns.filter(
      c => this.extralList.indexOf(c.property) < 0,
    );
    await this.alterData(d);
    d.addDefaultSearchParams({ status: 'Scoring' });
    d.afterDataInit(ds => (this.commentCount = ds.length));
    this.dataDriveService.updateViewData(d);
  }

  async getDataDrive4(d: DataDrive) {
    this.alterUpdate(d);
    this.d4 = d;
    d.tableData.editable = false;
    const more = d.dataViewSet.more;
    d.beforeInitTableData(data => {
      return data.map(da => {
        da[this.impressionName] = '';
        return da;
      });
    });
    if (d.dataViewSet.type === 'table' && more) {
      d.dataViewSet.more.showAction = false;
    }
    await this.alterData(d);
    d.beforeInitTableData(data => {
      return data.filter(s => {
        const status = s.STATUS;
        const list = ['Closed', 'Canceled', 'CX'];
        return list.indexOf(status) > -1;
      });
    });
    this.dataDriveService.updateViewData(d);
  }

  async alterData(d: DataDrive) {
    await this.reservationITService.getDeptTimeMes();
    this.timeMes = this.reservationITService.timeMes;
    const id = this.reservationITService.deptId;
    d.beforeInitTableData(data => {
      return data.filter(l => l.DEPT_ID === id).map(t => {
        const time = this.timeMes.find(m => m.ID === t.TIME_ID);
        if (time) {
          t.TIME_ID = time.START_TIME + ' ~ ' + time.END_TIME;
        }
        return t;
      });
    });
  }

  updateAllDataDrive() {
    this.dataDriveService.updateViewData(this.d1);
    this.dataDriveService.updateViewData(this.d2);
    this.dataDriveService.updateViewData(this.d3);
    this.dataDriveService.updateViewData(this.d4);
    this.appService.getAllTips();
  }

  updateService(data: ReservationApplication) {
    const loadingID = this.util.showLoading();
    const final = () => this.util.dismissLoading(loadingID);
    this.reservationITService.updateService(data).subscribe(
      () => {
        final();
        this.updateAllDataDrive();
      },
      err => {
        this.util.errDeal(err);
        final();
      },
    );
  }
  cancelResvation(app: ReservationApplication) {
    const doCancel = () => {
      const send = Object.assign({}, app, { STATUS: 'Canceled' });
      this.updateService(send);
    };
    this.modalService.confirm({
      nzTitle: '您確定要取消吗？',
      nzOnOk() {
        doCancel();
      },
      nzOnCancel() {},
    });
  }

  showImpressionDetail(app: ReservationApplication) {
    const subscription = this.modalService.create({
      nzTitle: '印象',
      nzContent: ImpressionListComponent,
      nzOnOk() {},
      nzOnCancel() {},
      nzFooter: null,
      nzComponentParams: {
        application: app,
      },
    });
  }

  commentResvation(app: ReservationApplication) {
    this.myForm = null;
    this.isCommentVisible = true;
    this.impressionList = [];
    this.impressionSelected = {};
    const loadingID = this.util.showLoading();
    const final = () => {
      this.util.dismissLoading(loadingID);
    };
    this.reservationITService.getPersonImpression(app.HANDLER).subscribe(
      (_: any[]) => {
        this.impressionList = _;
        final();
        this.myForm = this.fb.group({
          SCORE: ['', this.validatorExtendService.required()],
          USER_COMMENT: [''],
        });
        this.commentTarget = app;
      },
      err => {
        final();
        this.util.errDeal(err);
      },
    );
  }

  selectImpression(i: any) {
    this.impressionSelected[i.ID] = !this.impressionSelected[i.ID];
    this.impressionList = this.impressionList.map(g => {
      if (g === i) {
        g.QTY = this.impressionSelected[i.ID] ? g.QTY + 1 : g.QTY - 1;
      }
      return g;
    });
  }

  submitForm() {
    const val = this.myForm.value;
    const send = Object.assign({}, this.commentTarget, val);
    send.newImpressionList = [];
    for (const prop in this.impressionSelected) {
      if (this.impressionSelected[prop]) {
        send.newImpressionList.push(prop);
      }
    }
    send.STATUS = 'Closed';
    send.COMMENT_TIME = moment().format(this.dateFormat);
    const loadingID = this.util.showLoading();
    const final = () => {
      this.util.dismissLoading(loadingID);
    };
    this.reservationITService.updateService(send).subscribe(
      res => {
        final();
        this.isCommentVisible = false;
        this.updateAllDataDrive();
      },
      err => {
        this.util.errDeal(err);
        final();
      },
    );
  }
}
