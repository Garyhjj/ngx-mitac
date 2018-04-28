import { AppService } from './../../../../core/services/app.service';
import { isArray } from './../../../../shared/utils/index';
import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../../../shared/components/data-drive/shared/models';

@Component({
  selector: 'app-inspection-boss-lines',
  templateUrl: './inspection-boss-lines.component.html',
  styleUrls: ['./inspection-boss-lines.component.css'],
})
export class InspectionBossLinesComponent implements OnInit {
  constructor(private appService: AppService) {}

  ngOnInit() {}

  getDataDrive(d: DataDrive) {
    const searchSets = d.searchSets;
    if (isArray(searchSets)) {
      const status = searchSets.find(
        s => s.property === 'STATUS' || s.apiProperty === 'status',
      );
      status.InputOpts = status.InputOpts || {};
      status.InputOpts.default = 'New';
    }
    d.beforeSearch(s => {
      s = s || {};
      s.status = 'New';
      return s;
    });
    d.afterDataInit(ds => this.appService.getAllTips());
  }
}
