import { UtilService } from './../../../../core/services/util.service';
import { AppService } from './../../../../core/services/app.service';
import { DataDrive } from './../../../../shared/components/data-drive/shared/models/index';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inspection-equip-improvement',
  templateUrl: './inspection-equip-improvement.component.html',
  styleUrls: ['./inspection-equip-improvement.component.css'],
})
export class InspectionEquipImprovementComponent implements OnInit {
  constructor(private appService: AppService, private util: UtilService) {}

  ngOnInit() {}

  getDataDrive(d: DataDrive) {
    d.onUpdateFormShow(fg => {
      fg.get('ACTION_DATE').setValue(
        this.util.dateFormat(new Date(), 'YYYY-MM-DD'),
      );
    });

    d.onUpdateData(data => {
      data.PROBLEM_STATUS = 'Done';
      return data;
    });
    d.afterDataInit(_ => this.appService.getAllTips());
  }
}
