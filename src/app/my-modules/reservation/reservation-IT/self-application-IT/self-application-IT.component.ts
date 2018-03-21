import { DataDriveService } from './../../../../shared/components/data-drive/core/services/data-drive.service';
import { ReservationITService } from './../shared/services/reservaton-IT.service';
import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../../../shared/components/data-drive/shared/models';

@Component({
  selector: 'app-self-application-IT',
  templateUrl: './self-application-IT.component.html',
  styleUrls: ['./self-application-IT.component.css']
})
export class SelfApplicationITComponent implements OnInit {

  tabIdx
  timeMes;

  constructor(
    private reservationITService: ReservationITService,
    private dataDriveService: DataDriveService
  ) { }

  ngOnInit() {
    
  }

  tabChange(idx) {

  }

  async getDataDrive1(d: DataDrive) {
    await this.alterData(d);
    d.addDefaultSearchParams({status: 'New'});
    d.beforeUpdateShow((data) => {
      if(data.STATUS === 'New') {
        return true;
      }else {
        return false;
      }
    })
    this.dataDriveService.updateViewData(d);
  }

  async getDataDrive2(d: DataDrive) {
    await this.alterData(d);
    d.addDefaultSearchParams({status: 'Processing'});
    this.dataDriveService.updateViewData(d);
  }


  async getDataDrive3(d: DataDrive) {
    await this.alterData(d);
    d.addDefaultSearchParams({status: 'Scoring'});
    this.dataDriveService.updateViewData(d);
  }

  async getDataDrive4(d: DataDrive) {
    await this.alterData(d);
    d.beforeInitTableData(data => {
      return data.filter(s => {
        const status = s.STATUS;
        const list = ['Closed', 'Canceled', 'CX'];
        return list.indexOf(status) > -1;
      })
    })
    this.dataDriveService.updateViewData(d);
  }

  async alterData(d: DataDrive) {
    await this.reservationITService.getDeptTimeMes();
    this.timeMes = this.reservationITService.timeMes;
    const id = this.reservationITService.deptId;
    d.beforeInitTableData(data => {
      return data.filter(l => l.DEPT_ID === id).map(t => {
        const time = this.timeMes.find(m => m.ID === t.TIME_ID);
        if(time) {
          t.TIME_ID = time.START_TIME + ' ~ ' + time.END_TIME
        }
        return t;
      });
    });
  }

}
