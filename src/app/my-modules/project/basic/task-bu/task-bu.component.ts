import { DataDrive } from './../../../../shared/components/data-drive/shared/models/index';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-task-bu',
  templateUrl: './task-bu.component.html',
  styleUrls: ['./task-bu.component.css'],
})
export class TaskBuComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  getDataDrive(d: DataDrive) {
    d.onUpdateData(data => {
      data.LOOKUP_TYPE = 'PROJECT_BU';
      data.DESCRIPTION = 'N/A';
      data.ENABLED_FLAG = 'Y';
      data.START_DATE = data.START_DATE || moment().format('YYYY-MM-DD');
    });
  }
}
