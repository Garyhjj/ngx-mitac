import { DataDrive } from './../../../../shared/components/data-drive/shared/models/index';
import { InspectionService } from './../../shared/services/inspection.service';
import { Component, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-inspection-equip-checkList',
  templateUrl: './inspection-equip-checkList.component.html',
  styleUrls: ['./inspection-equip-checkList.component.css'],
})
export class InspectionEquipCheckListComponent implements OnInit {
  tabs;
  constructor(private inspectionService: InspectionService) {}

  ngOnInit() {
    this.inspectionService.getMRIName('equip').subscribe(c => {
      this.tabs = c;
    });
  }

  getDataDrive(d: DataDrive, id: number) {
    d.addDefaultSearchParams({ name_id: id });
    d.onUpdateData(data => {
      data.NAME_ID = id;
      return data;
    });
  }
}
