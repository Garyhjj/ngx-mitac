import { DataDrive } from './../../../../shared/components/data-drive/shared/models/index';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-inspection-equip-improvement',
  templateUrl: './inspection-equip-improvement.component.html',
  styleUrls: ['./inspection-equip-improvement.component.css']
})
export class InspectionEquipImprovementComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getDataDrive(d: DataDrive) {

    d.onUpdateFormShow((fg) => {
      fg.get('ACTION_DATE').setValue(moment(new Date()).format('YYYY-MM-DD'))
    });

    d.onUpdateData((data) => {
      data.PROBLEM_STATUS = 'Done';
      return data;
    })
  }

}
