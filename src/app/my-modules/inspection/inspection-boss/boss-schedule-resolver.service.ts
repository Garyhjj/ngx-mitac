import { NzModalService } from 'ng-zorro-antd';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, Resolve } from '@angular/router';
import { InspectionBossService } from './shared/services/inspection-boss.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class BossScheduleResolver implements Resolve<any> {
  translateTexts: any;
  constructor(
    private bs: InspectionBossService,
    private router: Router,
    private confirmServ: NzModalService,
    private translate: TranslateService,
  ) {}

  resolve(): Observable<any> {
    this.translate.get('insoectionModule.scheduleNotFound').subscribe(data => {
      this.translateTexts = data;
    });
    return this.bs.getEmployeeSchedule().map((schedule: any[]) => {
      if (schedule && schedule.length > 0) {
        return schedule;
      } else {
        // id not found
        this.confirmServ.info({
          title: this.translateTexts,
        });
        this.router.navigate(['/']);
        return null;
      }
    });
  }
}
