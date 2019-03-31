import { UtilService } from './../../../../core/services/util.service';
import { ReservationITService } from './../shared/services/reservaton-IT.service';
import { DataDriveService } from './../../../../shared/components/data-drive/core/services/data-drive.service';
import { DataDrive } from './../../../../shared/components/data-drive/shared/models/index';
import { Component, OnInit } from '@angular/core';
import { sortUtils } from '../../../../shared/utils';
import * as moment from 'moment';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-IT-server-board',
  templateUrl: './IT-server-board.component.html',
  styleUrls: ['./IT-server-board.component.css'],
})
export class ITServerBoardComponent implements OnInit {
  dataDrive: DataDrive;
  bodyCellStyle = (data, prop) => {
    const { class: className } = data;
    let color = '#000';
    switch (className) {
      case 'day-task':
        color = 'blue';
        break;
      case 'out-time':
        color = 'red';
        break;
      case 'week-task':
        color = '#6666cc';
        break;
      case 'month-task':
        color = 'green';
        break;
    }
    return { color };
  }
  constructor(
    private reservationITService: ReservationITService,
    private dataDriveService: DataDriveService,
    private util: UtilService,
  ) { }

  ngOnInit() { }

  async getDataDrive(d: DataDrive) {
    this.dataDrive = d;
    await this.reservationITService.getITDeptId();
    const DEPT_ID = this.reservationITService.deptId;
    d.beforeInitTableData((ds) => {
      return ds.map(l => {
        const { SERVICE_DATE } = l;
        const date =
          moment(SERVICE_DATE).format('YYYY-MM-DD') + ' ' + l.END_TIME;
        if (Date.now() - new Date(date).getTime() > 0) {
          l.class = 'out-time';
        } else {
          const startTime =
            moment(l.SERVICE_DATE).format('YYYY-MM-DD') + ' ' + l.START_TIME;
          const aheadTime = new Date(startTime).getTime() - Date.now(),
            oneDay = 1000 * 60 * 60 * 24;
          if (aheadTime <= oneDay) {
            // dayTask.push(l);
            l.class = 'day-task';
          } else if (aheadTime <= oneDay * 7) {
            // weekTask.push(l);
            l.class = 'week-task';
          } else if (aheadTime <= oneDay * 30) {
            l.class = 'month-task';
          }
          // normal.push(l);
        }
        return l;
      }).sort((a, b) => this.reservationITService.sortByTime(a, b, true));
    });
    // d.beforeInitTableData(ds =>
    //   ds
    //     .filter(l => {
    //       if (l.DEPT_ID !== DEPT_ID) {
    //         return false;
    //       } else {
    //         const dept = this.reservationITService.dept;
    //         const PRE_MIN_MINUTE = dept.PRE_MIN_MINUTE
    //           ? dept.PRE_MIN_MINUTE
    //           : 0;
    //         const date =
    //           this.util.dateFormat(l.SERVICE_DATE, 'YYYY-MM-DD') +
    //           ' ' +
    //           l.END_TIME;
    //         const during = new Date().getTime() - new Date(date).getTime();
    //         if (during > 0 || -during < PRE_MIN_MINUTE * 60 * 1000) {
    //           return true;
    //         } else {
    //           return false;
    //         }
    //       }
    //     })
    //     .sort((a, b) =>
    //       sortUtils.byDate(
    //         this.util.dateFormat(a.SERVICE_DATE, 'YYYY-MM-DD') +
    //           ' ' +
    //           a.START_TIME,
    //         this.util.dateFormat(b.SERVICE_DATE, 'YYYY-MM-DD') +
    //           ' ' +
    //           b.END_TIME,
    //       ),
    //     ),
    // );
    d.changeSearchWay(() =>
      this.reservationITService.getUndoneReservationList(),
    );
    d.afterDataInit(allData => {
      if (allData && allData.length > 0) {
        this.util.playAudio(`有${allData.length}条待办服务`, {
          single: true,
        });
      }
    });
    this.dataDriveService.updateViewData(d);
  }

  _onReuseDestroy() {
    this.dataDrive.runIntoBackground();
  }
  _onReuseInit() {
    this.dataDrive.backIntoFront();
  }
}
