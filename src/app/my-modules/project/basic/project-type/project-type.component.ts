import { DataDrive } from './../../../../shared/components/data-drive/shared/models/index';
import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../../../core/services/util.service';

@Component({
  selector: 'app-project-type',
  templateUrl: './project-type.component.html',
  styleUrls: ['./project-type.component.css'],
})
export class ProjectTypeComponent implements OnInit {
  constructor(private util: UtilService) {}

  ngOnInit() {}

  getDataDrive(d: DataDrive) {
    d.onUpdateData(data => {
      data.LOOKUP_TYPE = 'PROJECT_TYPE';
      data.DESCRIPTION = 'N/A';
      data.ENABLED_FLAG = 'Y';
      data.START_DATE =
        data.START_DATE || this.util.dateFormat(new Date(), 'YYYY-MM-DD');
    });
  }
}
