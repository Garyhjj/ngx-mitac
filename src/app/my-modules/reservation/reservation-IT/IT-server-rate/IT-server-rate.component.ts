import { Observable } from 'rxjs/Observable';
import { ReservationITService } from './../shared/services/reservaton-IT.service';
import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../../../shared/components/data-drive/shared/models';
import { ReservationApplication } from '../shared/models';
import { UtilService } from '../../../../core/services/util.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-IT-server-rate',
  templateUrl: './IT-server-rate.component.html',
  styleUrls: ['./IT-server-rate.component.css'],
})
export class ITServerRateComponent implements OnInit {
  yinxiangList: any = [];
  commentList: any = [];
  isDetailVisible = false;
  constructor(
    private reservationITService: ReservationITService,
    private util: UtilService,
  ) {}

  ngOnInit() {}

  getDataDrive(d: DataDrive) {
    d.beforeInitTableData(ls =>
      ls.sort((a, b) => {
        return b.PRAISERATE - a.PRAISERATE;
      }),
    );
  }

  async toRateDetail(app: any) {
    await this.reservationITService.getITDeptId();
    const empno = app.EMPNO;
    const deptID = this.reservationITService.deptId;
    this.yinxiangList = [];
    this.commentList = [];
    const loadingID = this.util.showLoading();
    const final = () => this.util.dismissLoading(loadingID);
    Observable.forkJoin(
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
