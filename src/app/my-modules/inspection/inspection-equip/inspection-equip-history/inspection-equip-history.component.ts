import { DataDrive } from './../../../../shared/components/data-drive/shared/models/index';
import { Component, OnInit } from '@angular/core';
import { isArray } from '../../../../shared/utils';

@Component({
  selector: 'app-inspection-equip-history',
  templateUrl: './inspection-equip-history.component.html',
  styleUrls: ['./inspection-equip-history.component.css']
})
export class InspectionEquipHistoryComponent implements OnInit {

  issueList:any[];
  issueDataDrive: DataDrive;

  tabIdx = 0;
  constructor() { }

  ngOnInit() {
  }

  getDataDrive1(d: DataDrive) {
    d.beforeInitTableData((d:any) => {
      this.issueList = d.PROBLEMS;
      if(isArray(d.NOTES)) {
        return d.NOTES
      }else {
        return [];
      }
    });
  }

  toDetail(data) {
    this.tabIdx = 1;
    if(isArray(this.issueList)) {
      const HEADER_ID = data.HEADER_ID;
      this.issueDataDrive.selfUpdateTableData(this.issueList.filter(i => i.HEADER_ID === HEADER_ID));
    }
  }
  getDataDrive2(d: DataDrive) {
    this.issueDataDrive = d;
  }

}
