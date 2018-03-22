import { UtilService } from './../../../../core/services/util.service';
import { NzModalService } from 'ng-zorro-antd';
import { ReservationApplication } from './../shared/models/index';
import { DataDriveService } from './../../../../shared/components/data-drive/core/services/data-drive.service';
import { ReservationITService } from './../shared/services/reservaton-IT.service';
import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../../../shared/components/data-drive/shared/models';
import * as moment from 'moment';
import { isArray } from '../../../../shared/utils';

@Component({
  selector: 'app-IT-server-workspace',
  templateUrl: './IT-server-workspace.component.html',
  styleUrls: ['./IT-server-workspace.component.css']
})
export class ITServerWorkspaceComponent implements OnInit {

  newCount: number;
  processingCount: number;
  outTimeCount: number;
  d1: DataDrive;
  d2: DataDrive;
  d3: DataDrive
  constructor(
    private reservationITService: ReservationITService,
    private dataDriveService: DataDriveService,
    private modalService: NzModalService,
    private util: UtilService
  ) { }

  ngOnInit() {
  }

  async getDataDrive1(d: DataDrive) {
    this.d1 = d;
    d.afterDataInit((data) => {
      this.newCount = isArray(data) ? data.length : 0;
    })
    await this.addDefaultSearchParams('New', d);
  }

  async getDataDrive2(d: DataDrive) {
    this.d2 = d;
    d.afterDataInit((data) => {
      this.processingCount = isArray(data) ? data.length : 0;
    })
    await this.addDefaultSearchParams('Processing', d);
  }

  async getDataDrive3(d: DataDrive) {
    this.d3 = d;
    d.afterDataInit((data) => {
      this.outTimeCount = isArray(data) ? data.length : 0;
    })
    d.beforeInitTableData((data: ReservationApplication[]) => {
      return data.filter(d => {
        const date = moment(d.SERVICE_DATE).format('YYYY-MM-DD') + ' ' + d.END_TIME;
        if (new Date().getTime() - new Date(date).getTime() > 0) {
          return true;
        }
        return false;
      })
    })
    await this.addDefaultSearchParams('', d);
  }

  async addDefaultSearchParams(status: string, d: DataDrive) {
    await this.reservationITService.getITDeptId();
    d.addDefaultSearchParams({
      status: status,
      deptID: this.reservationITService.deptId
    });
    this.dataDriveService.updateViewData(d);
  }

  updateService(data: ReservationApplication) {
    const loadingID = this.util.showLoading();
      const final = () => this.util.dismissLoading(loadingID);
      this.reservationITService.updateService(data).subscribe(() => {
        final();
        this.updateAllDataDrive();
      }, err => {
        this.util.errDeal(err);
        final();
      })
  }

  updateAllDataDrive() {
    this.dataDriveService.updateViewData(this.d1);
    this.dataDriveService.updateViewData(this.d2);
    this.dataDriveService.updateViewData(this.d3);
  }

  closeResvation(data: ReservationApplication) {
    const doClose = () => {
      const send = Object.assign({}, data, {STATUS: 'Closed'});
      this.updateService(send);
    }
    this.modalService.confirm({
      title: '您確定要關閉此預約？',
      onOk() {
        doClose();
      },
      onCancel() {
      }
    });
  }

  receiveResvation(data: ReservationApplication) {
    const doReceive = () => {
      const send = Object.assign({}, data, {STATUS:'Processing', HANDLER: this.reservationITService.user.EMPNO});
      this.updateService(send);
    }
    this.modalService.confirm({
      title: '您確定要接收此預約？',
      onOk() {
        doReceive()
      },
      onCancel() {
      }
    });
  }

  doneResvation(data: ReservationApplication) {
    const doDone = () => {
      const send = Object.assign({}, data, {STATUS:'Scoring',PROCESS_TIME: moment().format('YYYY-MM-DDT HH:mm:ss')});
      this.updateService(send);
    }
    this.modalService.confirm({
      title: '您確定已經完成此預約？',
      onOk() {
        doDone();
      },
      onCancel() {
      }
    });
  }
  
  resetResvation(data: ReservationApplication) {
    const doReset = () => {
      const send = Object.assign({}, data, {STATUS:'New', HANDLER: ''});
      this.updateService(send);
    }
    this.modalService.confirm({
      title: '您確定要放棄處理此預約？',
      onOk() {
        doReset();
      },
      onCancel() {
      }
    });
  }
}
