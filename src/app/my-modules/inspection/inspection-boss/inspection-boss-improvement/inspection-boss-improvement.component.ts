import { UtilService } from './../../../../core/services/util.service';
import { AppService } from './../../../../core/services/app.service';
import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../../../shared/components/data-drive/shared/models/index';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-inspection-boss-improvement',
  templateUrl: './inspection-boss-improvement.component.html',
  styleUrls: ['./inspection-boss-improvement.component.css'],
})
export class InspectionBossImprovementComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private appService: AppService,
    private util: UtilService,
  ) {}

  ngOnInit() {}

  getDataDrive(d: DataDrive) {
    d.addDefaultSearchParams({ empno: this.auth.user.EMPNO });

    d.onUpdateFormShow(fg => {
      fg.get('ACTION_DATE').setValue(
        this.util.dateFormat(new Date(), 'YYYY-MM-DD'),
      );
    });

    d.onUpdateData(data => {
      data.PROBLEM_STATUS = 'Done';
      return data;
    });
    d.afterDataInit(data => this.appService.getAllTips());
  }
}
