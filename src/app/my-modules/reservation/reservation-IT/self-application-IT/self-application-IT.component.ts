import { UtilService } from './../../../../core/services/util.service';
import { NzModalService } from 'ng-zorro-antd';
import { ReservationApplication } from './../shared/models/index';
import { DataDriveService } from './../../../../shared/components/data-drive/core/services/data-drive.service';
import { ReservationITService } from './../shared/services/reservaton-IT.service';
import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../../../shared/components/data-drive/shared/models';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-self-application-IT',
  templateUrl: './self-application-IT.component.html',
  styleUrls: ['./self-application-IT.component.css']
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
  impressionList: any[];
  impressionSelected: any = {};
  constructor(
    private reservationITService: ReservationITService,
    private dataDriveService: DataDriveService,
    private modalService: NzModalService,
    private util: UtilService
  ) { }

  ngOnInit() {

  }

  tabChange(idx) {

  }

  async getDataDrive1(d: DataDrive) {
    this.d1 = d;
    d.tableData.columns = d.tableData.columns.filter(c => this.extralList.indexOf(c.property) < 0);
    await this.alterData(d);
    d.addDefaultSearchParams({ status: 'New' });
    d.beforeUpdateShow((data) => {
      if (data.STATUS === 'New') {
        return true;
      } else {
        return false;
      }
    });
    this.dataDriveService.updateViewData(d);
  }

  async getDataDrive2(d: DataDrive) {
    this.d2 = d;
    d.tableData.columns = d.tableData.columns.filter(c => this.extralList.indexOf(c.property) < 0);
    await this.alterData(d);
    d.addDefaultSearchParams({ status: 'Processing' });
    this.dataDriveService.updateViewData(d);
  }


  async getDataDrive3(d: DataDrive) {
    this.d3 = d;
    d.tableData.editable = false;
    d.tableData.columns = d.tableData.columns.filter(c => this.extralList.indexOf(c.property) < 0);
    await this.alterData(d);
    d.addDefaultSearchParams({ status: 'Scoring' });
    this.dataDriveService.updateViewData(d);
  }

  async getDataDrive4(d: DataDrive) {
    this.d4 = d;
    d.tableData.editable = false;
    const more = d.dataViewSet.more;
    d.beforeInitTableData((data) => {
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
    });
  }
  cancelResvation(app: ReservationApplication) {
    const doCancel = () => {
      const send = Object.assign({}, app, { STATUS: 'Canceled' });
      this.updateService(send);
    };
    this.modalService.confirm({
      title: '您確定要取消吗？',
      onOk() {
        doCancel();
      },
      onCancel() {
      }
    });
  }

  showImpressionDetail(app: ReservationApplication) {
    this.impressionList = [];
    this.isImpressionVisible = true;
    this.impressionSelected = {};
    this.reservationITService.getPersonImpression(app.HANDLER).subscribe((imList: any[]) => this.impressionList = imList);
    this.reservationITService.getServiceImpressionResults(app.ID).subscribe(res => {
      if (Array.isArray(res)) {
        res.forEach(r => this.impressionSelected[r.IMPRESSION_ID] = true);
      }
    });
  }

}
