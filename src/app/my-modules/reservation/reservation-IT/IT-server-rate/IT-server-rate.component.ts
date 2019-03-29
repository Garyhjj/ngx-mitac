import { filter } from 'rxjs/operators';
import { DataDriveService } from './../../../../shared/components/data-drive/core/services/data-drive.service';
import { forkJoin, Subscription } from 'rxjs';
import { ReservationITService } from './../shared/services/reservaton-IT.service';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { DataDrive } from '../../../../shared/components/data-drive/shared/models';
import { ReservationApplication } from '../shared/models';
import { UtilService } from '../../../../core/services/util.service';
import { arrayClassifyByOne } from '../../../../shared/utils';
import * as moment from 'moment';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-IT-server-rate',
  templateUrl: './IT-server-rate.component.html',
  styleUrls: ['./IT-server-rate.component.css'],
})
export class ITServerRateComponent implements OnInit, OnDestroy {
  yinxiangList: any = [];
  commentList: any = [];
  isDetailVisible = false;
  sub: Subscription;
  dataList: any[];

  ave: any = {};

  targetFrom: { first: any[]; second?: any[] };

  targetEmpno;

  targetColumn;

  firstD: DataDrive;
  secondD: DataDrive;

  @ViewChild('myTable') myTable: TemplateRef<void>;
  constructor(
    private reservationITService: ReservationITService,
    private util: UtilService,
    private dSrv: DataDriveService,
  ) {}

  ngOnInit() {
    // this.reservationITService.getReservationList().subscribe((list:any[]) => {
    //   console.log(arrayClassifyByOne(list, 'HANDLER'));
    //   this.calAll(list);
    // });
  }

  showDetails(c, n, f) {
    this.targetColumn = c;
    this.targetEmpno = n;
    this.targetFrom = f;
    if (this.firstD) {
      this.firstD.selfUpdateTableData(f.first.slice());
    }
    if (this.secondD && f.second) {
      this.secondD.selfUpdateTableData(f.second.slice());
    }
  }

  getDataDrive1(d: DataDrive) {
    this.firstD = d;
    if (this.targetFrom) {
      setTimeout(
        () => d.selfUpdateTableData(this.targetFrom.first.slice()),
        80,
      );
    }
  }

  getDataDrive2(d: DataDrive) {
    this.secondD = d;
    const t = this.targetFrom;
    if (t && t.second) {
      setTimeout(() => d.selfUpdateTableData(t.second.slice()), 80);
    }
  }

  calAll(list: any[]) {
    const personCy: any = arrayClassifyByOne(list, 'HANDLER');
    const servers = Object.keys(personCy);
    const data: any[] = [];
    for (let prop in personCy) {
      if (prop !== 'null') {
        data.push(this.cac(prop, personCy[prop]));
      }
    }
    const total = this.cacTotal(data, list);
    this.cacAve(data, total);
    data.push(total);
    this.dataList = data;
  }

  cac(prop: string, tar: any[]) {
    const out: any = { handler: prop };
    const doneType = tar.filter(t => {
      const { STATUS } = t;
      return STATUS === 'Closed' || STATUS === 'Scoring';
    });
    // out.doneCount = doneType.length;
    out.doneCount = {
      data: doneType.length,
      from: {
        first: doneType.slice(),
      },
    };
    out.workTime = doneType.reduce((t, b) => {
      const bt = +b.HANDLE_TIME || 0;
      return bt + t;
    }, 0) as number;
    // out.workTime = out.workTime.toFixed(0);
    out.workTime = {
      data: out.workTime.toFixed(0),
      from: {
        first: doneType.slice(),
      },
    };

    // 不是补登的预约的数量
    const normalType = tar.filter(t => t.MANUAL_FLAG !== 'Y');
    const outType = doneType.filter(t => t.MANUAL_FLAG !== 'Y');
    const forOutTime = outType.reduce((t, b) => {
      const bt = +b.HANDLE_TIME || 0;
      return bt + t;
    }, 0);
    // out.normalTimeRate = (
    //   (+forOutTime.toFixed(0) / out.workTime.data) *
    //   100
    // ).toFixed(0);
    out.normalTimeRate = {
      data: ((+forOutTime.toFixed(0) / out.workTime.data) * 100).toFixed(0),
      from: {
        first: outType.slice(),
        second: doneType.slice(),
      },
    };
    // out.normalCountRate = ((normalType.length / tar.length) * 100).toFixed(0);

    out.normalCountRate = {
      data: ((normalType.length / tar.length) * 100).toFixed(0),
      from: {
        first: normalType.slice(),
        second: tar.slice(),
      },
    };

    // 需求人不是自己的
    const notMyContact = tar.filter(t => t.CONTACT !== prop);
    const helpOthersType = doneType.filter(t => t.CONTACT !== prop);
    console.log(prop, helpOthersType);
    const helpOtherTime = helpOthersType.reduce((t, b) => {
      const bt = +b.HANDLE_TIME || 0;
      return bt + t;
    }, 0);
    out.notMyContact = notMyContact;
    out.helpOtherTime = helpOtherTime;
    out.helpOthersType = helpOthersType;
    // out.helpOtherRate = (
    //   (+helpOtherTime.toFixed(0) / out.workTime.data) *
    //   100
    // ).toFixed(0);
    out.helpOtherRate = {
      data: ((+helpOtherTime.toFixed(0) / out.workTime.data) * 100).toFixed(0),
      from: {
        first: helpOthersType.slice(),
        second: [...doneType],
      },
    };
    // out.helpOtherCountRate = ((notMyContact.length / tar.length) * 100).toFixed(
    //   0,
    // );

    out.helpOtherCountRate = {
      data: ((notMyContact.length / tar.length) * 100).toFixed(0),
      from: {
        first: notMyContact.slice(),
        second: tar.slice(),
      },
    };

    // 不是自己提出,但是自己处理的已结案
    const closedType = notMyContact.filter(t => t.STATUS === 'Closed');
    const goodCommentType = closedType.filter(t => t.SCORE >= 4);
    out.closedType = closedType;
    out.goodCommentType = goodCommentType;
    // out.commentRate = ((closedType.length / notMyContact.length) * 100).toFixed(
    //   0,
    // );
    out.commentRate = {
      data: ((closedType.length / notMyContact.length) * 100).toFixed(0),
      from: {
        first: [...closedType],
        second: [...notMyContact],
      },
    };
    // out.goodCommentRate =
    //   closedType.length === 0
    //     ? 0
    //     : ((goodCommentType.length / closedType.length) * 100).toFixed(0);
    out.goodCommentRate = {
      data:
        closedType.length === 0
          ? 0
          : ((goodCommentType.length / closedType.length) * 100).toFixed(0),
      from: {
        first: [...goodCommentType],
        second: [...closedType],
      },
    };

    // 效率计算
    const halfHourType = [],
      oneDayType = [],
      weekType = [];
    const closeNormalType = normalType.filter(_ => _.PROCESS_TIME); // 非补登已结案
    closeNormalType.forEach(_ => {
      const pT = _.PROCESS_TIME,
        endTime = moment(_.SERVICE_DATE).format('YYYY-MM-DD ') + _.END_TIME;
      const during = new Date(pT).getTime() - new Date(endTime).getTime();
      if (during <= 0) {
        halfHourType.push(_);
      } else if (
        moment(pT).format('YYYY-MM-DD') ===
        moment(_.SERVICE_DATE).format('YYYY-MM-DD')
      ) {
        oneDayType.push(_);
      } else if (during < 1000 * 60 * 60 * 24 * 7) {
        weekType.push(_);
      }
    });

    const fastResponse = normalType.filter(_ => {
      const reponseTime = _.FIRST_RESPONSE_TIME || new Date('2018-01-01'),
        endTime = moment(_.SERVICE_DATE).format('YYYY-MM-DD ') + _.END_TIME;
      const during =
        new Date(reponseTime).getTime() - new Date(endTime).getTime();
      return during <= 0;
    });
    // out.fastResponseRate = (
    //   (fastResponse.length / normalType.length) *
    //   100
    // ).toFixed(0);
    out.fastResponseRate = {
      data: ((fastResponse.length / normalType.length) *
      100
    ).toFixed(0),
      from:{
        first: [...fastResponse],
        second: [...normalType]
      }
    }
    // out.halfHourDoneRate = (
    //   (halfHourType.length / normalType.length) *
    //   100
    // ).toFixed(0);
    out.halfHourDoneRate = {
      data: (
        (halfHourType.length / normalType.length) *
        100
      ).toFixed(0),
      from: {
        first: [...halfHourType],
        second: [...normalType]
      }
    }
    // out.oneDayDoneRate = (
    //   ((oneDayType.length + halfHourType.length) / normalType.length) *
    //   100
    // ).toFixed(0);
    out.oneDayDoneRate = {
      data: (
        ((oneDayType.length + halfHourType.length) / normalType.length) *
        100
      ).toFixed(0),
      from: {
        first: [...halfHourType, ...oneDayType],
        second: [...normalType]
      }
    }
    // out.weekDoneRate = (
    //   ((weekType.length + oneDayType.length + halfHourType.length) /
    //     normalType.length) *
    //   100
    // ).toFixed(0);

    out.weekDoneRate = {
      data: (
        ((weekType.length + oneDayType.length + halfHourType.length) /
          normalType.length) *
        100
      ).toFixed(0),
      from: {
        first: [...halfHourType, ...oneDayType, ...weekType],
        second: [...normalType]
      }
    }

    const undoneType = tar.filter(t => {
      const { STATUS } = t;
      return STATUS === 'New' || STATUS === 'Processing';
    });
    const outTime = undoneType.filter(_ => {
      const endTime = moment(_.SERVICE_DATE).format('YYYY-MM-DD ') + _.END_TIME;
      return moment().isAfter(moment(endTime));
    });
    out.outTimeUndone = outTime.length;
    out.normalUndone = undoneType.length - outTime.length;
    return out;
  }

  cacTotal(servers: any[], all: any[]) {
    const out = this.cac('Total', all);
    let notMyContact = [],
      helpOtherTime = 0,
      helpOthersType = [],
      closedType = [],
      goodCommentType = [];
    servers.forEach(_ => {
      notMyContact = notMyContact.concat(_.notMyContact);
      helpOtherTime = helpOtherTime + _.helpOtherTime;
      helpOthersType = helpOthersType.concat(_.helpOthersType);
      closedType = closedType.concat(_.closedType);
      goodCommentType = goodCommentType.concat(_.goodCommentType);
    });
    out.helpOtherRate = (
      (+helpOtherTime.toFixed(0) / out.workTime.data) *
      100
    ).toFixed(0);
    out.helpOtherRate = {
      data: ((+helpOtherTime.toFixed(0) / out.workTime.data) * 100).toFixed(0),
      from: {
        first: helpOthersType,
        second: out.workTime.from.first,
      },
    };
    // out.helpOtherCountRate = ((notMyContact.length / all.length) * 100).toFixed(
    //   0,
    // );
    out.helpOtherCountRate = {
      data: ((notMyContact.length / all.length) * 100).toFixed(0),
      from: {
        first: [...notMyContact],
        second: [...all],
      },
    };
    // out.commentRate = ((closedType.length / notMyContact.length) * 100).toFixed(
    //   0,
    // );
    out.commentRate = {
      data: ((closedType.length / notMyContact.length) * 100).toFixed(0),
      from: {
        first: [...closedType],
        second: [...notMyContact],
      },
    };
    // out.goodCommentRate =
    //   closedType.length === 0
    //     ? 0
    //     : ((goodCommentType.length / closedType.length) * 100).toFixed(0);
    out.goodCommentRate = {
      data:
        closedType.length === 0
          ? 0
          : ((goodCommentType.length / closedType.length) * 100).toFixed(0),
      from: {
        first: [...goodCommentType],
        second: [...closedType],
      },
    };
    return out;
  }
  cacAve(servers: any[], total: any) {
    const lg = servers.length;
    if (lg > 0) {
      const ave = { ...total };
      ave.workTime = (ave.workTime.data / lg).toFixed(0);
      ave.doneCount = (ave.doneCount.data / lg).toFixed(0);
      ave.outTimeUndone = (ave.outTimeUndone / lg).toFixed(0);
      ave.normalUndone = (ave.normalUndone / lg).toFixed(0);
      this.ave = ave;
    }
  }
  ngOnDestroy() {
    // tslint:disable-next-line:no-unused-expression
    this.sub && this.sub.unsubscribe();
  }

  getDataDrive(d: DataDrive) {
    d.beforeInitTableData(ls =>
      ls.sort((a, b) => {
        return b.PRAISERATE - a.PRAISERATE;
      }),
    );
    this.sub = this.reservationITService.$update.subscribe(() =>
      this.dSrv.updateViewData(d),
    );
    const { type } = d.viewerRegister(this.myTable);
    d.switchViewType(type);
    d.changeSearchWay(p => this.reservationITService.getReservationList(p));
    d.setSearchInputDefault('date_fm', moment().format('YYYY-MM-01'));
    d.setSearchInputDefault('date_to', moment().format('YYYY-MM-DD'));
    d.beforeInitTableData(list => this.calAll(list));
  }

  async toRateDetail(app: any) {
    await this.reservationITService.getITDeptId();
    const empno = app.EMPNO;
    const deptID = this.reservationITService.deptId;
    this.yinxiangList = [];
    this.commentList = [];
    const loadingID = this.util.showLoading();
    const final = () => this.util.dismissLoading(loadingID);
    forkJoin(
      this.reservationITService.getPersonImpression(empno, 6),
      this.reservationITService.getPersonComment(deptID, empno, 5),
    ).subscribe(
      res => {
        this.yinxiangList = res[0];
        this.commentList = res[1];
        this.isDetailVisible = true;
        final();
      },
      err => {
        this.util.errDeal(err);
        final();
      },
    );
  }
}
