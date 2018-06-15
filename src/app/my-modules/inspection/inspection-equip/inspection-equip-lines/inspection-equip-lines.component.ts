import { DataDrive } from './../../../../shared/components/data-drive/shared/models/index';
import { AppService } from './../../../../core/services/app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inspection-equip-lines',
  templateUrl: './inspection-equip-lines.component.html',
  styleUrls: ['./inspection-equip-lines.component.css'],
})
export class InspectionEquipLinesComponent implements OnInit {
  constructor(private appService: AppService) {}

  ngOnInit() {}

  getDataDrive(d: DataDrive) {
    d.setSearchInputDefault('status', 'New');
    d.afterDataInit(ds => this.appService.getAllTips());
    d.onUpdateFormShow((fg, sub, list) => {
      fg.get('OWNER_EMPNO').valueChanges.subscribe(v => {
        const statusFc = fg.get('PROBLEM_STATUS');
        if (v) {
          statusFc.setValue('Waiting');
        } else {
          statusFc.setValue('New');
        }
      });
    });
  }
}
