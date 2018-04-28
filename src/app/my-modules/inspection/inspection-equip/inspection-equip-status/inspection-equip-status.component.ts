import { DataDrive } from './../../../../shared/components/data-drive/shared/models/index';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inspection-equip-status',
  templateUrl: './inspection-equip-status.component.html',
  styleUrls: ['./inspection-equip-status.component.css'],
})
export class InspectionEquipStatusComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  addDefaultTime(d: DataDrive) {
    const searchSets = d.searchSets;
    searchSets.forEach(s => {
      const property = s.apiProperty;
      if (property === 'year') {
        s.InputOpts = s.InputOpts || {};
        s.InputOpts.default = new Date().getFullYear();
      } else if (property === 'month') {
        s.InputOpts = s.InputOpts || {};
        s.InputOpts.default = new Date().getMonth() + 1;
      }
    });
  }
  getDataDrive1(d: DataDrive) {
    d.addDefaultSearchParams({ NAME_ID: 7 });
    this.addDefaultTime(d);
    d.beforeInitTableData(data => {
      return data.filter(ds => +ds.REPORT_HEADER_ID > 0);
    });
  }

  getDataDrive2(d: DataDrive) {
    d.addDefaultSearchParams({ NAME_ID: 7 });
    this.addDefaultTime(d);
    d.beforeInitTableData(data => {
      return data.filter(ds => ds.REPORT_HEADER_ID === '');
    });
  }
}
