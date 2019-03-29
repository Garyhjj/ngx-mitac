import { ServerSubScoringComponent } from './../shared/components/server-sub-scoring/server-sub-scoring.component';
import { UtilService } from './../../../../core/services/util.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ServerSubComponent } from './../shared/components/server-sub/server-sub.component';
import { DataDriveService } from './../../../../shared/components/data-drive/core/services/data-drive.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataDrive } from '../../../../shared/components/data-drive/shared/models';
import { ReservationITService } from '../shared/services/reservaton-IT.service';
import { ServerSubClosedComponent } from '../shared/components/server-sub-closed/server-sub-closed.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-IT-server-Whole',
  templateUrl: './IT-server-Whole.component.html',
  styleUrls: ['./IT-server-Whole.component.css'],
})
export class ITServerWholeComponent implements OnInit, OnDestroy {
  dataChange1 = new BehaviorSubject<any[]>([]);
  dataChange2 = new BehaviorSubject<any[]>([]);
  dataChange3 = new BehaviorSubject<any[]>([]);
  dataChange4 = new BehaviorSubject<any[]>([]);
  dataChange5 = new BehaviorSubject<any[]>([]);

  dataChange6 = new BehaviorSubject<any[]>([]);

  d1: DataDrive;
  d5: DataDrive;
  d6: DataDrive;
  sub: Subscription;
  constructor(
    private dSre: DataDriveService,
    private itSre: ReservationITService,
    private util: UtilService,
  ) {}

  ngOnInit() {
    this.ob$Update();
  }

  ob$Update() {
    this.sub = this.itSre.$update.subscribe(() => {
      this.updateAllDataDrive();
    });
  }

  updateAllDataDrive() {
    // tslint:disable-next-line:no-unused-expression
    this.d1 && this.dSre.updateViewData(this.d1);
    // tslint:disable-next-line:no-unused-expression
    this.d5 && this.dSre.updateViewData(this.d5);
    // tslint:disable-next-line:no-unused-expression
    this.d6 && this.dSre.updateViewData(this.d6);
  }

  ngOnDestroy() {
    // tslint:disable-next-line:no-unused-expression
    this.sub && this.sub.unsubscribe();
  }

  changeViewer(d: DataDrive, dataChange) {
    d.additionalFn.menu = false;
    const viewer = d.viewerRegister(ServerSubComponent, {
      dataChange,
    });
    d.switchViewType(viewer.type);
  }

  getDataDrive1(d: DataDrive) {
    this.d1 = d;
    this.changeViewer(d, this.dataChange1);
    d.changeSearchWay(() => this.itSre.getUndoneReservationList());
    d.beforeInitTableData(res => {
      const outTime = [],
        dayTask = [],
        weekTask = [],
        monthTask = [];
      const { dateFormat } = this.util;
      res.sort((a, b) => this.itSre.sortByTime(a, b, true)).forEach(l => {
        const date =
          dateFormat(l.SERVICE_DATE, 'YYYY-MM-DD') + ' ' + l.END_TIME;
        if (Date.now() - new Date(date).getTime() > 0) {
          outTime.push(l);
        } else {
          const startTime =
            dateFormat(l.SERVICE_DATE, 'YYYY-MM-DD') + ' ' + l.START_TIME;
          const aheadTime = new Date(startTime).getTime() - Date.now(),
            oneDay = 1000 * 60 * 60 * 24;
          if (aheadTime <= oneDay) {
            dayTask.push(l);
          } else if (aheadTime <= oneDay * 7) {
            weekTask.push(l);
          } else if (aheadTime <= oneDay * 30) {
            monthTask.push(l);
          }
          // normal.push(l);
        }
      });
      this.dataChange4.next(monthTask);
      this.dataChange3.next(weekTask);
      this.dataChange2.next(dayTask);
      this.dataChange1.next(outTime);
      return [];
    });
    this.dSre.updateViewData(d);
  }

  getDataDrive2(d) {
    this.changeViewer(d, this.dataChange2);
  }

  getDataDrive3(d) {
    this.changeViewer(d, this.dataChange3);
  }

  getDataDrive4(d) {
    this.changeViewer(d, this.dataChange4);
  }

  getDataDrive5(d: DataDrive) {
    this.d5 = d;
    d.additionalFn.menu = false;
    const viewer = d.viewerRegister(ServerSubScoringComponent, {
      dataChange: this.dataChange5.asObservable(),
    });
    d.switchViewType(viewer.type);
    d.changeSearchWay(() => this.itSre.getScoringReservationList());
    d.beforeInitTableData(res => {
      this.dataChange5.next(
        res.sort((a, b) => this.itSre.sortByTime(a, b, false)),
      );
      return [];
    });
    this.dSre.updateViewData(d);
  }

  getDataDrive6(d: DataDrive) {
    this.d6 = d;
    d.additionalFn.menu = false;
    d.tableData.searchable = true;
    const dataChange = this.dataChange6;
    const viewer = d.viewerRegister(ServerSubClosedComponent, {
      dataChange: dataChange.asObservable(),
    });
    d.switchViewType(viewer.type);
    const { dateFormat } = this.util;
    const today = new Date();
    const date = dateFormat(today, 'YYYY-MM-DD'),
      lastMonth = dateFormat(new Date().setMonth(today.getMonth() - 1), 'YYYY-MM-DD');
    d.setSearchInputDefault('date_to', date);
    d.setSearchInputDefault('date_fm', lastMonth);
    d.changeSearchWay(opts =>
      this.itSre.getReservationList({ ...opts, status: 'Closed' }),
    );
    d.beforeInitTableData(res => {
      dataChange.next(res.sort((a, b) => this.itSre.sortByTime(a, b, false)));
      return [];
    });
    this.dSre.updateViewData(d);
  }
}
