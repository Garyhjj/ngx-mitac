import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReservationService } from './../../../shared/services/resvation.service';
import { AuthService } from './../../../../../core/services/auth.service';
import { UserState } from './../../../../../core/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { reservationITConfig } from '../config';
import { replaceQuery, isArray } from '../../../../../shared/utils';

@Injectable()
export class ReservationITService {
  role = 3;
  user: UserState;
  deptId;
  dept;
  timeMes;
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private reservationService: ReservationService,
  ) {
    this.user = this.auth.user;
    if (this.user.privilege.find(m => m.FUNCTION_ID === 343)) {
      this.role = 1;
    }
  }

  async getITDeptId() {
    if (this.deptId > 0) {
      return;
    }
    if (!this.reservationService.deptList) {
      const res = await this.reservationService
        .getServiceDeptInfo()
        .toPromise();
      this.reservationService.deptList = res;
    }
    const target = this.reservationService.deptList.find(
      c => c.TYPE === 'IT_SERVICE',
    );
    if (target) {
      this.dept = target;
      this.deptId = target.ID;
    }
  }

  async getDeptTimeMes() {
    if (isArray(this.timeMes)) {
      return this.timeMes;
    }
    await this.getITDeptId().catch(err => {});
    const res = await this.reservationService
      .getServiceTime(this.deptId)
      .toPromise()
      .catch(err => null);
    if (isArray(res)) {
      this.timeMes = res;
    }
  }

  getUndoneReservationList() {
    return forkJoin(
      this.getReservationList({ status: 'New' }),
      this.getReservationList({ status: 'Processing' }),
    ).pipe(map(res => res.reduce((a: any[], b: any[]) => a.concat(b), [])));
  }
  getReservationList(query: any = {}) {
    return this.http.get(
      replaceQuery(reservationITConfig.getReservationList, query, this.user),
    );
  }

  getServiceDateMes(dept_id: number) {
    return this.http.get(
      replaceQuery(reservationITConfig.getServiceDateMes, { dept_id }),
    );
  }

  getServiceDayInfo(dept_id: number, date: string) {
    return this.http.get(
      replaceQuery(reservationITConfig.getServiceDayInfo, { dept_id, date }),
    );
  }

  updateService(d: any) {
    return this.reservationService.updateService(d);
  }

  getServiceImpressionResults(service_id: number, empno?: string) {
    return this.http.get(
      replaceQuery(reservationITConfig.getServiceImpressionResults, {
        empno,
        service_id,
      }),
    );
  }

  getPersonImpression(empno: string, rownum = 30) {
    return this.http.get(
      replaceQuery(reservationITConfig.getPersonImpression, { empno, rownum }),
    );
  }

  getPersonComment(dept_id: number, empno: string, rownum: number) {
    return this.http.get(
      replaceQuery(reservationITConfig.getPersonComment, {
        dept_id,
        empno,
        rownum,
      }),
    );
  }
  getServiceTime(dept_id: number) {
    return this.http.get(
      replaceQuery(reservationITConfig.getServiceTime, { dept_id }),
    );
  }
  getPersonList(dept_id: number) {
    return this.http.get(
      replaceQuery(reservationITConfig.getPersonList, { dept_id }),
    );
  }
}
