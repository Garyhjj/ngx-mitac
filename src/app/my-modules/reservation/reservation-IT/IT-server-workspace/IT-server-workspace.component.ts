import { TranslateService } from '@ngx-translate/core';
import { NgxValidatorExtendService } from './../../../../core/services/ngx-validator-extend.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ImpressionListComponent } from './../shared/components/impression-list/impression-list.component';
import { UtilService } from './../../../../core/services/util.service';
import { NzModalService } from 'ng-zorro-antd';
import { ReservationApplication } from './../shared/models/index';
import { DataDriveService } from './../../../../shared/components/data-drive/core/services/data-drive.service';
import { ReservationITService } from './../shared/services/reservaton-IT.service';
import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../../../shared/components/data-drive/shared/models';
import * as moment from 'moment';
import { isArray } from '../../../../shared/utils';
import { UserState } from '../../../../core/store';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-IT-server-workspace',
  templateUrl: './IT-server-workspace.component.html',
  styleUrls: ['./IT-server-workspace.component.css']
})
export class ITServerWorkspaceComponent implements OnInit {

  newCount: number;
  processingCount: number;
  outTimeCount: number;
  otherOutTimeCount: number;
  nearlyOutTimeCount: number;
  d0: DataDrive;
  d1: DataDrive;
  d2: DataDrive;
  d3: DataDrive;
  d4: DataDrive;
  d6: DataDrive;
  user: UserState;
  commentCount;
  impressionName = 'impression';
  isClosedVisible = false;
  isDoneVisible = false;
  reason: string;
  closedTarget: ReservationApplication;
  doneTarget: ReservationApplication;
  doneForm: FormGroup;
  yinxiangText: string;
  confirmToAccept: string;
  confirmToReset: string;
  constructor(
    private reservationITService: ReservationITService,
    private dataDriveService: DataDriveService,
    private modalService: NzModalService,
    private util: UtilService,
    private fb: FormBuilder,
    private validatorExtendService: NgxValidatorExtendService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.user = this.reservationITService.user;
    this.translateService.get(['serviceModule.yinxiang2', 'serviceModule.confirmToAccept', 'serviceModule.confirmToReset']).subscribe(data => {
      // console.log(data);
      this.yinxiangText = data['serviceModule.yinxiang2'];
      this.confirmToAccept = data['serviceModule.confirmToAccept'];
      this.confirmToReset = data['serviceModule.confirmToReset'];
    });
  }

  getDataDrive0(d: DataDrive) {
    this.d0 = d;
    const hideList = ['REMARK', 'TYPE', 'HANDLE_TIME', 'SCORE', 'USER_COMMENT', 'impression'];
    d.tableData.columns = d.tableData.columns.filter(c => hideList.indexOf(c.property) < 0);
    d.afterDataInit((data) => {
      this.nearlyOutTimeCount = isArray(data) ? data.length : 0;
    });
  }
  async getDataDrive1(d: DataDrive) {
    this.d1 = d;
    const hideList = ['HANDLER', 'REMARK', 'TYPE', 'HANDLE_TIME', 'SCORE', 'USER_COMMENT', 'impression'];
    d.tableData.columns = d.tableData.columns.filter(c => hideList.indexOf(c.property) < 0);
    d.afterDataInit((data) => {
      this.newCount = isArray(data) ? data.length : 0;
    });
  }

  async getDataDrive2(d: DataDrive) {
    this.d2 = d;
    const hideList = ['REMARK', 'TYPE', 'HANDLE_TIME', 'SCORE', 'USER_COMMENT', 'impression'];
    d.tableData.columns = d.tableData.columns.filter(c => hideList.indexOf(c.property) < 0);
    d.afterDataInit((data) => {
      this.processingCount = isArray(data) ? data.length : 0;
    });
  }

  async getDataDrive3(d: DataDrive) {
    this.d3 = d;
    const hideList = ['REMARK', 'TYPE', 'HANDLE_TIME', 'SCORE', 'USER_COMMENT', 'impression'];
    d.tableData.columns = d.tableData.columns.filter(c => hideList.indexOf(c.property) < 0);
    d.afterDataInit((data) => {
      this.outTimeCount = isArray(data) ? data.length : 0;
    });
    d.beforeInitTableData((data: ReservationApplication[]) => {
      const newList = [];
      const processingList = [];
      const nearlyOutTimeList = [];
      const last = data.filter(ds => {
        const dept = this.reservationITService.dept;
        const PRE_MIN_MINUTE = dept.PRE_MIN_MINUTE ? dept.PRE_MIN_MINUTE : 0;
        const date = moment(ds.SERVICE_DATE).format('YYYY-MM-DD') + ' ' + ds.END_TIME;
        const status = ds.STATUS;
        const during = new Date().getTime() - new Date(date).getTime();
        if (during > 0) {
          return true;
        } else if (-during < PRE_MIN_MINUTE * 60 * 1000) {
          nearlyOutTimeList.push(ds);
        } else {
          if (status === 'New') {
            newList.push(ds);
          } else if (status === 'Processing') {
            processingList.push(ds);
          }
        }
        return false;
      });
      this.d1.selfUpdateTableData(newList);
      this.d2.selfUpdateTableData(processingList);
      this.d0.selfUpdateTableData(nearlyOutTimeList);
      return last;
    });
    await this.addDefaultSearchParams('', d);
  }

  async addDefaultSearchParams(status: string, d: DataDrive) {
    await this.reservationITService.getITDeptId();
    d.tableData.searchable = false;
    d.addDefaultSearchParams({
      status: status,
      deptID: this.reservationITService.deptId
    });
    this.dataDriveService.updateViewData(d);
  }

  async getDataDrive4(d: DataDrive) {
    this.d4 = d;
    await this.reservationITService.getITDeptId();
    d.afterDataInit(ls => this.commentCount = ls.length);
    const hideList = ['SCORE', 'USER_COMMENT', 'impression'];
    d.tableData.columns = d.tableData.columns.filter(c => hideList.indexOf(c.property) < 0);
    this.set45Default(d, 'Scoring');
  }

  async getDataDrive5(d: DataDrive) {
    await this.reservationITService.getITDeptId();
    d.beforeInitTableData((data) => {
      return data.map(da => {
        da[this.impressionName] = '';
        return da;
      });
    });
    d.addDefaultSearchParams({ date_fm: moment(new Date().getTime() - 1000 * 60 * 60 * 24 * 30).format('YYYY-MM-DD') });
    this.set45Default(d, 'Closed');
    d.addDefaultSearchParams({ date_fm: '' });
  }

  showImpressionDetail(app: ReservationApplication) {
    const subscription = this.modalService.open({
      title: this.yinxiangText,
      content: ImpressionListComponent,
      onOk() {
      },
      onCancel() {

      },
      footer: false,
      componentParams: {
        application: app
      }
    });
    subscription.subscribe(result => {
      // console.log(result);
    });
  }

  set45Default(d: DataDrive, status) {
    if (d.dataViewSet.more) {
      d.dataViewSet.more.showAction = false;
    }
    const empno = this.user.EMPNO;
    d.APIs.search =
      // tslint:disable-next-line:max-line-length
      'Service/GetServices?docno={docno}&status={status}&contact={contact}&handler={handler}&type={type}&company_id={*COMPANY_ID}&date_fm={date_fm}&date_to={date_to}';
    d.addDefaultSearchParams({
      status,
      handler: empno
    });
    d.beforeInitTableData(ds =>
      ds.filter((t: ReservationApplication) => t.CONTACT !== empno && t.DEPT_ID === this.reservationITService.deptId));
    this.dataDriveService.updateViewData(d);
  }

  async getDataDrive6(d: DataDrive) {
    this.d6 = d;
    await this.reservationITService.getITDeptId();
    d.tableData.editable = false;
    d.tableData.searchable = false;
    const hideList = ['REMARK', 'TYPE', 'HANDLE_TIME', 'SCORE', 'USER_COMMENT', 'impression'];
    d.tableData.columns = d.tableData.columns.filter(c => hideList.indexOf(c.property) < 0);
    d.APIs.search =
      // tslint:disable-next-line:max-line-length
      'Service/GetServices?docno={docno}&status={status}&contact={contact}&handler={handler}&type={type}&company_id={*COMPANY_ID}&date_fm={date_fm}&date_to={date_to}';
    d.addDefaultSearchParams({
      status: 'Processing',
    });
    const empno = this.user.EMPNO;
    d.beforeInitTableData(ds =>
      ds.filter((t: ReservationApplication) => {
        if (t.HANDLER !== empno && t.DEPT_ID === this.reservationITService.deptId) {
          const date = moment(t.SERVICE_DATE).format('YYYY-MM-DD') + ' ' + t.END_TIME;
          if (new Date().getTime() - new Date(date).getTime() > 0) {
            return true;
          }
        }
        return false;
      }));
    d.afterDataInit((ds) => this.otherOutTimeCount = ds.length);
    this.dataDriveService.updateViewData(d);
  }

  updateService(data: ReservationApplication, succ?: () => void) {
    const loadingID = this.util.showLoading();
    const final = () => this.util.dismissLoading(loadingID);
    this.reservationITService.updateService(data).subscribe(() => {
      final();
      // tslint:disable-next-line:no-unused-expression
      succ && succ();
      this.updateAllDataDrive();
    }, err => {
      this.util.errDeal(err);
      final();
    });
  }

  updateAllDataDrive() {
    this.dataDriveService.updateViewData(this.d3);
    this.dataDriveService.updateViewData(this.d6);
  }

  closeResvation(data: ReservationApplication) {
    this.isClosedVisible = true;
    this.closedTarget = data;
    // this.modalService.confirm({
    //   title: '您確定要關閉嗎？',
    //   onOk() {
    //     doClose();
    //   },
    //   onCancel() {
    //   }
    // });
  }

  submitClosedForm() {
    if (this.reason) {
      const doClose = () => {
        const send = Object.assign({}, this.closedTarget, { STATUS: 'CX', REMARK: this.reason });
        this.updateService(send, () => {
          this.isClosedVisible = false;
        });
        this.closedTarget = null;
      };
      doClose();
    }
  }


  receiveResvation(data: ReservationApplication) {
    const doReceive = () => {
      const send = Object.assign({}, data, { STATUS: 'Processing', HANDLER: this.reservationITService.user.EMPNO });
      this.updateService(send);
    };
    this.modalService.confirm({
      title: this.confirmToAccept,
      onOk() {
        doReceive();
      },
      onCancel() {
      }
    });
  }

  doneResvation(data: ReservationApplication) {
    this.doneForm = null;
    this.isDoneVisible = true;
    this.doneForm = this.fb.group({
      TYPE: [null, this.validatorExtendService.required()],
      HANDLE_TIME: [undefined, this.validatorExtendService.required()],
      REMARK: ['']
    });
    this.doneTarget = data;
    // this.modalService.confirm({
    //   title: '您確定要處理嗎？',
    //   onOk() {
    //     doDone();
    //   },
    //   onCancel() {
    //   }
    // });
  }

  submitDoneForm() {
    const val = this.doneForm.value;
    const alter = Object.assign({}, val, { STATUS: 'Scoring', PROCESS_TIME: moment().format('YYYY-MM-DDT HH:mm:ss') });
    const doDone = () => {
      const send = Object.assign({}, this.doneTarget, alter);
      this.updateService(send, () => {
        this.dataDriveService.updateViewData(this.d4);
        this.isDoneVisible = false;
        this.doneForm = null;
      });
    };
    doDone();
  }

  resetResvation(data: ReservationApplication) {
    const doReset = () => {
      const send = Object.assign({}, data, { STATUS: 'New', HANDLER: '', RESET_FLAG: 'Y' });
      this.updateService(send);
    };
    this.modalService.confirm({
      title: this.confirmToReset,
      onOk() {
        doReset();
      },
      onCancel() {
      }
    });
  }
}
