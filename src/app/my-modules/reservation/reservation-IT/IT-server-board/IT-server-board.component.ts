import { UtilService } from './../../../../core/services/util.service';
import { ReservationITService } from './../shared/services/reservaton-IT.service';
import { DataDriveService } from './../../../../shared/components/data-drive/core/services/data-drive.service';
import { DataDrive } from './../../../../shared/components/data-drive/shared/models/index';
import { Component, OnInit } from '@angular/core';
import { sortUtils } from '../../../../shared/utils';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-IT-server-board',
  templateUrl: './IT-server-board.component.html',
  styleUrls: ['./IT-server-board.component.css'],
})
export class ITServerBoardComponent implements OnInit {
  dataDrive: DataDrive;
  constructor(
    private reservationITService: ReservationITService,
    private dataDriveService: DataDriveService,
    private util: UtilService,
  ) {}

  ngOnInit() {}

  async getDataDrive(d: DataDrive) {
    this.dataDrive = d;
    await this.reservationITService.getITDeptId();
    const DEPT_ID = this.reservationITService.deptId;
    d.beforeInitTableData(ds =>
      ds
        .filter(l => {
          if (l.DEPT_ID !== DEPT_ID) {
            return false;
          } else {
            const dept = this.reservationITService.dept;
            const PRE_MIN_MINUTE = dept.PRE_MIN_MINUTE
              ? dept.PRE_MIN_MINUTE
              : 0;
            const date =
              this.util.dateFormat(l.SERVICE_DATE, 'YYYY-MM-DD') +
              ' ' +
              l.END_TIME;
            const during = new Date().getTime() - new Date(date).getTime();
            if (during > 0 || -during < PRE_MIN_MINUTE * 60 * 1000) {
              return true;
            } else {
              return false;
            }
          }
        })
        .sort((a, b) =>
          sortUtils.byDate(
            this.util.dateFormat(a.SERVICE_DATE, 'YYYY-MM-DD') +
              ' ' +
              a.START_TIME,
            this.util.dateFormat(b.SERVICE_DATE, 'YYYY-MM-DD') +
              ' ' +
              b.END_TIME,
          ),
        ),
    );
    d.changeSearchWay(() =>
      this.reservationITService.getUndoneReservationList(),
    );
    d.afterDataInit(allData => {
      if (allData && allData.length > 0) {
        this.util.playAudio(`有${allData.length}条超期或快超期的服务`, {
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
