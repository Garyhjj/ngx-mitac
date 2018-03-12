import { DataDrive } from './../../../../shared/components/data-drive/shared/models/index';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inspection-equip-status',
  templateUrl: './inspection-equip-status.component.html',
  styleUrls: ['./inspection-equip-status.component.css']
})
export class InspectionEquipStatusComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getDataDrive1(d: DataDrive) {
    d.addDefaultSearchParams({NAME_ID:7});
    d.beforeInitTableData(data => {
      return data.filter(d => +d.REPORT_HEADER_ID > 0);
    })
  }

  getDataDrive2(d: DataDrive) {
    d.addDefaultSearchParams({NAME_ID:7})
    d.beforeInitTableData(data => {
      return data.filter(d => d.REPORT_HEADER_ID === '');
    })
  }

}
