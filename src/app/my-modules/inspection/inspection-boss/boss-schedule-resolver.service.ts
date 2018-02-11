import { NzModalService } from 'ng-zorro-antd';
import { Injectable }             from '@angular/core';
import { Observable }             from 'rxjs/Observable';
import { Router, Resolve } from '@angular/router';
import { InspectionBossService } from './shared/services/inspection-boss.service';
 
@Injectable()
export class BossScheduleResolver implements Resolve<any> {
  constructor(private bs: InspectionBossService, private router: Router, private confirmServ: NzModalService) {}
 
  resolve(): Observable<any> {
 
    return this.bs.getEmployeeSchedule().map((schedule:any[]) => {
      if (schedule && schedule.length > 0) {
        return schedule;
      } else { // id not found
        this.confirmServ.info({
            title: '沒找到您的巡檢安排',
          });
        this.router.navigate(['/']);
        return null;
      }
    });
  }
}