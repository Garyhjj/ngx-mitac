import { Subscription } from 'rxjs';
import { AppService } from './../../../../core/services/app.service';
import { NgxValidatorExtendService } from './../../../../core/services/ngx-validator-extend.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UtilService } from './../../../../core/services/util.service';
import { NzModalService } from 'ng-zorro-antd';
import { ReservationApplication } from './../shared/models/index';
import { DataDriveService } from './../../../../shared/components/data-drive/core/services/data-drive.service';
import { ReservationITService } from './../shared/services/reservaton-IT.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataDrive } from '../../../../shared/components/data-drive/shared/models';
import { ImpressionListComponent } from '../shared/components/impression-list/impression-list.component';
import { isArray } from '../../../../shared/utils';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-self-application-IT',
  templateUrl: './self-application-IT.component.html',
  styleUrls: ['./self-application-IT.component.css'],
})
export class SelfApplicationITComponent implements OnInit, OnDestroy {
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
  sub: Subscription;
  bodyCellStyleFn = (data, prop) => {
    if (prop === 'SERVICE_DESC') {
      return {
        'max-width': '200px'
      };
    } else if (prop === 'REMARK') {
      return {
        'max-width': '200px'
      };
    } else if (prop === 'TYPE') {
      return {
        'max-width': '100px'
      };
    }
  }
  constructor(
    private reservationITService: ReservationITService,
    private dataDriveService: DataDriveService,
    private modalService: NzModalService,
    private util: UtilService,
    private fb: FormBuilder,
    private validatorExtendService: NgxValidatorExtendService,
    private gbService: AppService,
  ) {}

  ngOnInit() {
    this.ob$Update();
  }

  ob$Update() {
    this.sub = this.reservationITService.$update.subscribe(() => {
      this.updateAllDataDrive();
    });
  }

  ngOnDestroy() {
    // tslint:disable-next-line:no-unused-expression
    this.sub && this.sub.unsubscribe();
  }

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
    d.tableData.searchable = false;
    d.tableData.columns = d.tableData.columns.filter(
      c => this.extralList.indexOf(c.property) < 0,
    );
    d.beforeInitTableData(data => {
      return data
        .sort((a , b) => this.reservationITService.sortByTime(a, b, true));
    });
    // await this.alterData(d);
    // d.addDefaultSearchParams({ status: 'New' });
    // d.beforeUpdateShow(data => {
    //   if (data.STATUS === 'New') {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // });
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
    // this.dataDriveService.updateViewData(d);
    d.beforeInsideUpdateView(() => {
      this.reservationITService.callForWholeUpdate();
      return false;
    });
  }

  // async getDataDrive2(d: DataDrive) {
  //   this.alterUpdate(d);
  //   this.d2 = d;
  //   d.tableData.columns = d.tableData.columns.filter(
  //     c => this.extralList.indexOf(c.property) < 0,
  //   );
  //   await this.alterData(d);
  //   d.addDefaultSearchParams({ status: 'Processing' });
  //   d.afterDataInit(ds => (this.processingCount = ds.length));
  //   this.dataDriveService.updateViewData(d);
  // }

  async getDataDrive3(d: DataDrive) {
    this.alterUpdate(d);
    this.d3 = d;
    d.tableData.editable = false;
    d.tableData.searchable = false;
    d.tableData.columns = d.tableData.columns.filter(
      c => this.extralList.indexOf(c.property) < 0,
    );
    // await this.alterData(d);
    // d.addDefaultSearchParams({ status: 'Scoring' });
    d.afterDataInit(ds => (this.commentCount = ds.length));
    // this.dataDriveService.updateViewData(d);
    d.beforeInsideUpdateView(() => {
      this.reservationITService.callForWholeUpdate();
      return false;
    });
  }

  async getDataDrive4(d: DataDrive) {
    const srv = this.dataDriveService;
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
      const unFinish = [],
        scroing = [],
        done = [],
        list = ['Closed', 'Canceled', 'CX'];
      data.forEach(s => {
        const status = s.STATUS;
        if (list.indexOf(status) > -1) {
          done.push(s);
        } else if (status === 'Scoring') {
          scroing.push(s);
        } else if (status === 'Processing' || status === 'New') {
          unFinish.push(s);
        }
      });
      this.d1.selfUpdateTableData(unFinish);
      this.d3.selfUpdateTableData(scroing);
      return done;
    });
    srv.updateViewData(d);
  }

  async alterData(d: DataDrive) {
    await this.reservationITService.getDeptTimeMes();
    this.timeMes = this.reservationITService.timeMes;
    const id = this.reservationITService.deptId;
    d.beforeInitTableData(data => {
      return data
        .filter(l => l.DEPT_ID === id)
        .map(t => {
          const time = this.timeMes.find(m => m.ID === t.TIME_ID);
          if (time) {
            t.TIME_ID = time.START_TIME + ' ~ ' + time.END_TIME;
          } else {
            t.TIME_ID = t.START_TIME + ' ~ ' + t.END_TIME;
          }
          return t;
        })
        .sort((a , b) => this.reservationITService.sortByTime(a, b, false));
    });
  }

  updateAllDataDrive() {
    // this.dataDriveService.updateViewData(this.d1);
    // this.dataDriveService.updateViewData(this.d2);
    // this.dataDriveService.updateViewData(this.d3);
    // tslint:disable-next-line:no-unused-expression
    this.d4 && this.dataDriveService.updateViewData(this.d4);
  }

  updateService(data: ReservationApplication) {
    const loadingID = this.util.showLoading();
    const final = () => this.util.dismissLoading(loadingID);
    this.reservationITService.updateService(data).subscribe(
      () => {
        final();
        this.reservationITService.callForWholeUpdate();
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
    send.COMMENT_TIME = this.util.dateFormat(new Date(), this.dateFormat);
    const loadingID = this.util.showLoading();
    const final = () => {
      this.util.dismissLoading(loadingID);
    };
    this.reservationITService.updateService(send).subscribe(
      res => {
        final();
        this.isCommentVisible = false;
        this.reservationITService.callForWholeUpdate();
      },
      err => {
        this.util.errDeal(err);
        final();
      },
    );
  }

  _onReuseDestroy() {
    this.ngOnDestroy();
  }
  _onReuseInit() {
    this.ob$Update();
    this.updateAllDataDrive();
  }
}
